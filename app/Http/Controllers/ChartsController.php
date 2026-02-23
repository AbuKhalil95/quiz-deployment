<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use App\Models\User;
use App\Models\Quiz;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChartsController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $isTeacher = $user->hasRole('teacher');
        $isAdmin   = $user->hasRole('admin');


        $quizQuery = Quiz::query();

        if ($isTeacher && !$isAdmin) {
            $quizQuery->where('created_by', $user->id);
        }

        $quizzes = $quizQuery->pluck('id');

        // ==========================================
        // 📊 Average Score Per Quiz
        // ==========================================

        $quizAverages = QuizAttempt::whereIn('quiz_id', $quizzes)
            ->select('quiz_id',
                DB::raw('AVG(score) as avg_score')
            )
            ->groupBy('quiz_id')
            ->with('quiz:id,title')
            ->get()
            ->map(fn($item) => [
                'quiz' => $item->quiz?->title ?? 'Unknown',
                'avg_score' => round($item->avg_score, 2),
            ]);

        // ==========================================
        // 📈 Attempts Over Time
        // ==========================================

        $attemptsOverTime = QuizAttempt::whereIn('quiz_id', $quizzes)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as attempts')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();


        // ==========================================
        // 📊 Pass / Fail
        // ==========================================

        $pass = QuizAttempt::whereIn('quiz_id', $quizzes)
            ->whereRaw('total_correct >= (total_correct + total_incorrect) / 2')
            ->count();

        $fail = QuizAttempt::whereIn('quiz_id', $quizzes)
            ->whereRaw('total_correct < (total_correct + total_incorrect) / 2')
            ->count();

        // ==========================================
        // 📌 Stats
        // ==========================================

        $stats = [
            'students' => User::whereHas('roles', fn($q) =>
                $q->where('name', 'student')
            )->count(),

            'teachers' => User::whereHas('roles', fn($q) =>
                $q->where('name', 'teacher')
            )->count(),

            'quizzes' => $quizQuery->count(),
            'attempts' => QuizAttempt::whereIn('quiz_id', $quizzes)->count(),

            'pass' => $pass,
            'fail' => $fail,
        ];

        return Inertia::render('admin/Charts/Index', [
            'quizAverages' => $quizAverages,
            'attemptsOverTime' => $attemptsOverTime,
           
            'stats' => $stats,
            'isAdmin' => $isAdmin,
            'isTeacher' => $isTeacher,
        ]);
    }
}