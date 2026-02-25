<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\QuizAttempt;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChartsController extends Controller
{
    public function index(Request $request)
    {
        $studentId = auth()->id();

        $attemptQuery = QuizAttempt::where('student_id', $studentId);

        // Date range filter
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        if ($dateFrom) {
            $attemptQuery->whereDate('quiz_attempts.created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $attemptQuery->whereDate('quiz_attempts.created_at', '<=', $dateTo);
        }

        // Subject filter
        $subjectId = $request->input('subject_id');
        if ($subjectId) {
            $attemptQuery->whereHas('quiz', fn ($q) => $q->where('subject_id', $subjectId));
        }

        // Exclude challenge/adaptive quizzes
        $excludeChallenges = $request->boolean('exclude_challenges', true);
        if ($excludeChallenges) {
            $attemptQuery->whereHas('quiz', fn ($q) => $q->where(function ($q2) {
                $q2->where('mode', '!=', 'adaptive')->orWhereNull('mode');
            })
            );
        }

        // Subjects the student has attempted (for filter dropdown)
        $subjects = Subject::whereHas('quizzes', fn ($q) => $q->whereHas('attempts', fn ($q2) => $q2->where('student_id', $studentId))
        )
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]);

        // =====================================
        // 📈 Attempts Over Time (count per date)
        // =====================================

        $attemptsOverTime = (clone $attemptQuery)
            ->select(
                DB::raw('DATE(quiz_attempts.created_at) as date'),
                DB::raw('COUNT(*) as attempts')
            )
            ->groupBy(DB::raw('DATE(quiz_attempts.created_at)'))
            ->orderBy('date')
            ->get();

        // =====================================
        // 📊 Attempts Per Quiz (count per quiz)
        // =====================================

        $attemptsPerQuiz = (clone $attemptQuery)
            ->select('quiz_id', DB::raw('COUNT(*) as attempts'))
            ->groupBy('quiz_id')
            ->with('quiz:id,title')
            ->get()
            ->map(fn ($item) => [
                'quiz' => $item->quiz?->title ?? 'Unknown',
                'attempts' => (int) $item->attempts,
            ]);

        // =====================================
        // 📈 Progress Over Time (avg % per day)
        // =====================================

        $progress = (clone $attemptQuery)
            ->join('quizzes', 'quiz_attempts.quiz_id', '=', 'quizzes.id')
            ->select(
                DB::raw('DATE(quiz_attempts.created_at) as date'),
                DB::raw('AVG(quiz_attempts.score / NULLIF(quizzes.total_questions, 0) * 100) as avg_score')
            )
            ->groupBy(DB::raw('DATE(quiz_attempts.created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn ($r) => [
                'date' => $r->date,
                'avg_score' => min(100, round((float) $r->avg_score, 1)),
            ]);

        // =====================================
        // 📊 Quiz Performance (avg % per quiz)
        // =====================================

        $quizPerformance = (clone $attemptQuery)
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

        // =====================================
        // 🔥 Pass vs Fail (exclude abandoned attempts with no answers)
        // =====================================

        $completedAttempts = (clone $attemptQuery)
            ->whereRaw('(total_correct + total_incorrect) > 0');

        $pass = (clone $completedAttempts)
            ->whereRaw('total_correct >= (total_correct + total_incorrect)/2')
            ->count();

        $fail = (clone $completedAttempts)
            ->whereRaw('total_correct < (total_correct + total_incorrect)/2')
            ->count();

        return Inertia::render('student/Charts/Index', [
            'progress' => $progress,
            'attemptsOverTime' => $attemptsOverTime,
            'attemptsPerQuiz' => $attemptsPerQuiz,
            'quizPerformance' => $quizPerformance,
            'pass' => $pass,
            'fail' => $fail,
            'subjects' => $subjects,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'subject_id' => $subjectId,
                'exclude_challenges' => $excludeChallenges,
            ],
        ]);
    }
}
