<?php

namespace App\Http\Controllers;

use App\Models\QuestionOption;
use Illuminate\Http\Request;

class QuestionOptionController extends Controller
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
        $questionOption = QuestionOption::create([
            'question_id' => $request->question_id,
            'option_text' => $request->option_text,
            'is_correct' => $request->is_correct,

        ]);

        return response()->json(['success' => 'Question Option saved successfully']);
    }

    public function show(string $id)
    {
        $questionOption = QuestionOption::with(['question'])->find($id);

        if (! $questionOption) {
            return response()->json(['error' => 'Question Option not found'], 404);
        }

        return response()->json([
            'id' => $questionOption->id,
            'question_id' => $questionOption->question_id,
            'option_text' => $questionOption->option_text,
            'is_correct' => $questionOption->is_correct,

            'question' => [
                'id' => $questionOption->question?->id,
                'question_text' => $questionOption->question?->question_text,
            ],
        ]);
    }

    public function edit($id)
    {
        $questionOption = QuestionOption::find($id);

        return response()->json($questionOption);
    }

    public function update(Request $request, $id)
    {
        $questionOption = QuestionOption::find($id);
        $questionOption->question_id = $request->question_id;
        $questionOption->option_text = $request->option_text;
        $questionOption->is_correct = $request->is_correct;

        $questionOption->save();

        return response()->json(['success' => 'Question Option updated successfully']);
    }

    public function destroy($id)
    {
        QuestionOption::find($id)->delete();

        return response()->json(['success' => 'Question Option deleted successfully']);

    }
}
