<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class QuestionOptionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = QuestionOption::with(['question']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('question_text', function ($row) {
                    $text = $row->question ? $row->question->question_text : '';
                    $shortText = strlen($text) > 100 ? substr($text, 0, 100) . '...' : $text;
                    return '<span class="short-text">' . $shortText . '</span>
                <span class="full-text" style="display:none;">' . $text . '</span>
                ' . (strlen($text) > 100 ? '<a href="javascript:void(0)" class="toggle-text">Show More</a>' : '');
                })
                ->editColumn('is_correct', function ($row) {
                    return $row->is_correct ? 'Correct' : 'InCorrect';
                })

                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="' . $row->id . '" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-question-option btn btn-primary btn-action " data-id="' . $row->id . '" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-question-option btn btn-danger  " data-id="' . $row->id . '" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action', 'question_text'])
                ->make(true);
        }
        $questions = Question::select('id', 'question_text')->get();


        return view('Dashboard/Question-Options/question-options', compact('questions'));
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

        if (!$questionOption) {
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
