<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $quizzes = Quiz::paginate(2); // Show 6 quizzes per page

        $lastAttempts = QuizAttempt::with('quiz')
            ->where('student_id', Auth::id())
            ->orderByDesc('created_at')
            ->take(3)
            ->get();

        return view('student.dashboard', compact('quizzes', 'lastAttempts'));
    }
}
