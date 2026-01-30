<?php

namespace App\Http\Controllers;

use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class QuizQuestionController extends Controller
{
    public function index(Request $request)
    {
        return redirect()->route('admin.dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $quizQuestion = QuizQuestion::create([
            'quiz_id' => $request->quiz_id,
            'question_id' => $request->question_id,
            'order' => $request->order,

        ]);

        return response()->json(['success' => 'Quiz Question saved successfully']);
    }

    public function show(string $id)
    {
        $quizQuestion = QuizQuestion::with(['quiz', 'question.options'])->find($id);

        if (! $quizQuestion) {
            return response()->json(['error' => 'Quiz Question not found'], 404);
        }

        return response()->json([
            'id' => $quizQuestion->id,
            'quiz_id' => $quizQuestion->quiz_id,
            'question_id' => $quizQuestion->question_id,
            'order' => $quizQuestion->order,
            'quiz' => [
                'id' => $quizQuestion->quiz?->id,
                'title' => $quizQuestion->quiz?->title,
            ],
            'question' => [
                'id' => $quizQuestion->question?->id,
                'question_text' => $quizQuestion->question?->question_text,
                'options' => $quizQuestion->question->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                        'is_correct' => $option->is_correct,
                    ];
                }),
            ],
        ]);
    }

    public function edit($id)
    {
        $quizQuestion = QuizQuestion::find($id);

        return response()->json($quizQuestion);
    }

    public function update(Request $request, $id)
    {
        $quizQuestion = QuizQuestion::find($id);
        $quizQuestion->quiz_id = $request->quiz_id;
        $quizQuestion->question_id = $request->question_id;
        $quizQuestion->order = $request->order;

        $quizQuestion->save();

        return response()->json(['success' => 'Quiz Question updated successfully']);
    }

    public function destroy($id)
    {
        QuizQuestion::find($id)->delete();

        return response()->json(['success' => 'Quiz Question deleted successfully']);

    }
}
