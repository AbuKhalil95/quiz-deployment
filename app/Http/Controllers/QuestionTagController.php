<?php

namespace App\Http\Controllers;

use App\Models\QuestionTag;
use Illuminate\Http\Request;

class QuestionTagController extends Controller
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
        $questionTag = QuestionTag::create([
            'question_id' => $request->question_id,
            'tag_id' => $request->tag_id,

        ]);

        return response()->json(['success' => 'Question Tag saved successfully']);
    }

    public function show(string $id)
    {
        $questionTag = QuestionTag::with(['question', 'tag'])->find($id);

        if (! $questionTag) {
            return response()->json(['error' => 'Question Tag not found'], 404);
        }

        return response()->json([
            'id' => $questionTag->id,
            'question_id' => $questionTag->question_id,
            'tag_id' => $questionTag->tag_id,
            'question' => [
                'id' => $questionTag->question?->id,
                'question_text' => $questionTag->question?->question_text,
            ],
            'tag' => [
                'id' => $questionTag->tag?->id,
                'tag_text' => $questionTag->tag?->tag_text,
            ],
        ]);
    }

    public function edit($id)
    {
        $questionTag = QuestionTag::find($id);

        return response()->json($questionTag);
    }

    public function update(Request $request, $id)
    {
        $questionTag = QuestionTag::find($id);
        $questionTag->question_id = $request->question_id;
        $questionTag->tag_id = $request->tag_id;

        $questionTag->save();

        return response()->json(['success' => 'Question Tag updated successfully']);
    }

    public function destroy($id)
    {
        QuestionTag::find($id)->delete();

        return response()->json(['success' => 'Question Tag deleted successfully']);

    }
}
