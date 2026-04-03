<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Subject;
use App\Models\SubjectNote;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $subjects = Subject::whereHas('quizzes.questions')
            ->withCount('notes')
            ->paginate(6);
        $mixedBagQuizzes = Quiz::where('mode', 'mixed_bag')
            ->whereHas('questions')
            ->with('subject')
            ->withCount('questions')
            ->get();
        $lastAttempts = QuizAttempt::with('quiz.questions')
            ->where('student_id', Auth::id())
            ->orderByDesc('created_at')
            ->take(3)
            ->get();

        $unfinishedAttempts = QuizAttempt::with('quiz.questions')
            ->where('student_id', Auth::id())
            ->whereNull('ended_at')
            ->whereNull('archived_at')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        return Inertia::render('student/Dashboard', [
            'subjects' => $subjects,
            'mixedBagQuizzes' => $mixedBagQuizzes,
            'lastAttempts' => $lastAttempts,
            'unfinishedAttempts' => $unfinishedAttempts,
            'user' => [
                'name' => Auth::user()->name,
            ],
        ]);
    }

    public function quizzesBySubject($subjectId)
    {
        $subject = Subject::query()
            ->whereKey($subjectId)
            ->whereHas('quizzes.questions')
            ->with([
                'notes' => fn ($q) => $q->orderByDesc('created_at'),
            ])
            ->firstOrFail();

        $quizzes = Quiz::where('subject_id', $subjectId)
            ->whereHas('questions')
            ->with('questions:id')
            ->paginate(6);

        return Inertia::render('student/QuizzesBySubject', [
            'subject' => [
                'id' => $subject->id,
                'name' => $subject->name,
            ],
            'notes' => $subject->notes->map(fn (SubjectNote $n) => [
                'id' => $n->id,
                'original_name' => $n->original_name,
                'mime_type' => $n->mime_type,
                'size_bytes' => $n->size_bytes,
                'preview_kind' => $n->previewKind(),
                'created_at' => $n->created_at?->toIso8601String(),
            ]),
            'quizzes' => $quizzes,
        ]);
    }
}
