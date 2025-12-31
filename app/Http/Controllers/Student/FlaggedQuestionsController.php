<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlaggedQuestionsController extends Controller
{
    /**
     * Display all flagged questions for the current student.
     */
    public function index()
    {
        $user = $this->user();

        $flaggedQuestions = $user->flaggedQuestions()
            ->with(['subject:id,name', 'options'])
            ->orderByDesc('question_flags.created_at')
            ->paginate(10);

        return Inertia::render('student/Questions/Flagged', [
            'questions' => $flaggedQuestions,
        ]);
    }

    /**
     * Flag a question for the current student.
     */
    public function store(Request $request, Question $question)
    {
        $user = $this->user();

        // Check if already flagged
        if ($user->flaggedQuestions()->where('question_id', $question->id)->exists()) {
            if ($this->wantsInertiaResponse($request)) {
                return redirect()->back()->with('info', 'Question is already flagged.');
            }

            return response()->json(['message' => 'Question is already flagged.'], 200);
        }

        $user->flaggedQuestions()->attach($question->id);

        if ($this->wantsInertiaResponse($request)) {
            return redirect()->back()->with('success', 'Question flagged successfully.');
        }

        return response()->json(['success' => true, 'message' => 'Question flagged successfully.']);
    }

    /**
     * Unflag a question for the current student.
     */
    public function destroy(Request $request, Question $question)
    {
        $user = $this->user();

        $user->flaggedQuestions()->detach($question->id);

        if ($this->wantsInertiaResponse($request)) {
            return redirect()->back()->with('success', 'Question unflagged successfully.');
        }

        return response()->json(['success' => true, 'message' => 'Question unflagged successfully.']);
    }
}
