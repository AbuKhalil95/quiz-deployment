<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChartsController extends Controller
{
    public function index()
    {
        $studentId = auth()->id();

        // =====================================
        // 📈 Progress Over Time
        // =====================================

        $progress = QuizAttempt::where('student_id', $studentId)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(score) as avg_score')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // =====================================
        // 📊 Quiz Performance
        // =====================================

        $quizPerformance = QuizAttempt::where('student_id', $studentId)
            ->with('quiz:id,title')
            ->select(
                'quiz_id',
                DB::raw('AVG(score) as avg_score')
            )
            ->groupBy('quiz_id')
            ->get()
            ->map(fn($item) => [
                'quiz' => $item->quiz?->title,
                'avg_score' => round($item->avg_score, 2)
            ]);

        // =====================================
        // 🔥 Pass vs Fail
        // =====================================

        $pass = QuizAttempt::where('student_id', $studentId)
            ->whereRaw('total_correct >= (total_correct + total_incorrect)/2')
            ->count();

        $fail = QuizAttempt::where('student_id', $studentId)
            ->whereRaw('total_correct < (total_correct + total_incorrect)/2')
            ->count();

        return Inertia::render('student/Charts/Index', [
            'progress' => $progress,
            'quizPerformance' => $quizPerformance,
            'pass' => $pass,
            'fail' => $fail,
           
        ]);
    }
}