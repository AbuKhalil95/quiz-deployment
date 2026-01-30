<?php

namespace App\Http\Controllers;

use App\Models\QuizAnswer;
use Illuminate\Http\Request;

class QuizAnswerController extends Controller
{
    public function index(Request $request)
    {
        return redirect()->route('admin.dashboard');
    }

    public function create(Request $request)
    {
        $answer = QuizAnswer::create([
            'quiz_attempt_id' => $request->quiz_attempt_id,
            'question_id' => $request->question_id,
            'selected_option_id' => $request->selected_option_id,
            'is_correct' => $request->is_correct ?? false,
        ]);

        return response()->json(['success' => 'Quiz Answer created successfully']);
    }

    public function show($id)
    {
        $answer = QuizAnswer::with(['attempt.student', 'attempt.quiz', 'question', 'selectedOption'])->find($id);
        if (! $answer) {
            return response()->json(['error' => 'Quiz Answer not found'], 404);
        }

        return response()->json($answer);
    }

    public function edit($id)
    {
        $answer = QuizAnswer::find($id);

        return response()->json($answer);
    }

    public function update(Request $request, $id)
    {
        $answer = QuizAnswer::find($id);
        $answer->update([
            'quiz_attempt_id' => $request->quiz_attempt_id,
            'question_id' => $request->question_id,
            'selected_option_id' => $request->selected_option_id,
            'is_correct' => $request->is_correct ?? false,
        ]);

        return response()->json(['success' => 'Quiz Answer updated successfully']);
    }

    public function destroy($id)
    {
        QuizAnswer::find($id)?->delete();

        return response()->json(['success' => 'Quiz Answer deleted successfully']);
    }
}
