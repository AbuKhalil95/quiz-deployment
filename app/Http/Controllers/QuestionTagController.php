<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class QuestionTagController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = QuestionTag::with(['question', 'tag']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('question_text', function ($row) {
                    return $row->question ? $row->question->question_text : '';
                })
                ->addColumn('tag_text', function ($row) {
                    return $row->tag ? $row->tag->tag_text : '';
                })
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="'.$row->id.'" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-question-tag btn btn-primary btn-action " data-id="'.$row->id.'" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-question-tag btn btn-danger  " data-id="'.$row->id.'" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        $questions = Question::select('id', 'question_text')->get();
        $tags = Tag::select('id', 'tag_text')->get();

        return view('Dashboard/Question-Tag/question-tag', compact('questions', 'tags'));
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
