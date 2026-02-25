<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChartsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $isTeacher = $user->hasRole('teacher');
        $isAdmin = $user->hasRole('admin');

        $quizQuery = Quiz::query();

        if ($isTeacher && ! $isAdmin) {
            $quizQuery->where('created_by', $user->id);
        }

        // Exclude challenge/adaptive quizzes by default (student-generated)
        $excludeChallenges = $request->boolean('exclude_challenges', true);
        if ($excludeChallenges) {
            $quizQuery->where(function ($q) {
                $q->where('mode', '!=', 'adaptive')->orWhereNull('mode');
            });
        }

        $quizzes = $quizQuery->pluck('id');

        $attemptQuery = QuizAttempt::whereIn('quiz_id', $quizzes);

        // Date range filter (qualify created_at to avoid ambiguity with joined tables)
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        if ($dateFrom) {
            $attemptQuery->whereDate('quiz_attempts.created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $attemptQuery->whereDate('quiz_attempts.created_at', '<=', $dateTo);
        }

        // Student filter (teachers + admins)
        $studentId = $request->input('student_id');
        if ($studentId) {
            $attemptQuery->where('student_id', $studentId);
        }

        // Students who have attempted these quizzes (for dropdown)
        $studentIds = QuizAttempt::whereIn('quiz_id', $quizzes)->distinct()->pluck('student_id');
        $students = User::whereIn('id', $studentIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name]);

        // ==========================================
        // 📊 Average Score Per Quiz (as percentage)
        // ==========================================

        $quizAverages = (clone $attemptQuery)
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->select(
                'quiz_attempts.quiz_id',
                DB::raw('AVG(quiz_attempts.score / NULLIF(quizzes.total_questions, 0) * 100) as avg_score')
            )
            ->groupBy('quiz_attempts.quiz_id')
            ->with('quiz:id,title')
            ->get()
            ->map(fn ($item) => [
                'quiz' => $item->quiz?->title ?? 'Unknown',
                'avg_score' => min(100, round((float) $item->avg_score, 1)),
            ]);

        // ==========================================
        // 📈 Attempts Over Time
        // ==========================================

        $attemptsOverTime = (clone $attemptQuery)
            ->select(
                DB::raw('DATE(quiz_attempts.created_at) as date'),
                DB::raw('COUNT(*) as attempts')
            )
            ->groupBy(DB::raw('DATE(quiz_attempts.created_at)'))
            ->orderBy('date')
            ->get();

        // ==========================================
        // 📊 Attempts Per Quiz (count per quiz)
        // ==========================================

        $attemptsPerQuiz = (clone $attemptQuery)
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->select('quizzes.title as quiz', DB::raw('COUNT(*) as attempts'))
            ->groupBy('quiz_attempts.quiz_id', 'quizzes.title')
            ->get()
            ->map(fn ($item) => [
                'quiz' => $item->quiz ?? 'Unknown',
                'attempts' => (int) $item->attempts,
            ]);

        // ==========================================
        // 📊 Pass / Fail (exclude abandoned attempts with no answers)
        // ==========================================

        $completedAttemptsQuery = (clone $attemptQuery)
            ->whereRaw('(total_correct + total_incorrect) > 0');

        $pass = (clone $completedAttemptsQuery)
            ->whereRaw('total_correct >= (total_correct + total_incorrect) / 2')
            ->count();

        $fail = (clone $completedAttemptsQuery)
            ->whereRaw('total_correct < (total_correct + total_incorrect) / 2')
            ->count();

        // ==========================================
        // 📊 Performance by Subject (teacher-focused)
        // ==========================================

        $performanceBySubject = (clone $attemptQuery)
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->leftJoin('subjects', 'quizzes.subject_id', '=', 'subjects.id')
            ->select(
                DB::raw('COALESCE(subjects.name, \'No subject\') as subject'),
                DB::raw('AVG(quiz_attempts.score / NULLIF(quizzes.total_questions, 0) * 100) as avg_score')
            )
            ->groupBy(DB::raw('COALESCE(subjects.id, 0)'), DB::raw('COALESCE(subjects.name, \'No subject\')'))
            ->get()
            ->map(fn ($r) => ['subject' => $r->subject ?? 'Unknown', 'avg_score' => min(100, round((float) $r->avg_score, 1))]);

        // ==========================================
        // 📊 Top Students by Avg Score (when not filtering by student)
        // ==========================================

        $topStudents = collect();
        if (! $studentId) {
            $topStudents = (clone $attemptQuery)
                ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
                ->join('users', 'quiz_attempts.student_id', '=', 'users.id')
                ->select(
                    'users.id',
                    'users.name',
                    DB::raw('AVG(quiz_attempts.score / NULLIF(quizzes.total_questions, 0) * 100) as avg_score')
                )
                ->groupBy('users.id', 'users.name')
                ->orderByDesc('avg_score')
                ->limit(10)
                ->get()
                ->map(fn ($r) => ['student' => $r->name, 'avg_score' => min(100, round((float) $r->avg_score, 1))]);
        }

        // ==========================================
        // 📌 Stats
        // ==========================================

        $stats = [
            'students' => User::whereHas('roles', fn ($q) => $q->where('name', 'student')
            )->count(),

            'teachers' => User::whereHas('roles', fn ($q) => $q->where('name', 'teacher')
            )->count(),

            'quizzes' => (clone $attemptQuery)->count(DB::raw('DISTINCT quiz_id')),
            'attempts' => (clone $attemptQuery)->count(),

            'pass' => $pass,
            'fail' => $fail,
        ];

        return Inertia::render('admin/Charts/Index', [
            'quizAverages' => $quizAverages,
            'attemptsOverTime' => $attemptsOverTime,
            'attemptsPerQuiz' => $attemptsPerQuiz,
            'performanceBySubject' => $performanceBySubject,
            'topStudents' => $topStudents,
            'stats' => $stats,
            'students' => $students,
            'isAdmin' => $isAdmin,
            'isTeacher' => $isTeacher,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'student_id' => $studentId,
                'exclude_challenges' => $excludeChallenges,
            ],
        ]);
    }
}
