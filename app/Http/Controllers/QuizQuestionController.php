<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class QuizQuestionController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = QuizQuestion::with(['quiz', 'question']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('quiz_title', function ($row) {
                    return $row->quiz ? $row->quiz->title : '';
                })
                ->addColumn('question_text', function ($row) {
                    $text = $row->question ? $row->question->question_text : '';
                    $shortText = strlen($text) > 100 ? substr($text, 0, 100).'...' : $text;

                    return '<span class="short-text">'.$shortText.'</span>
                <span class="full-text" style="display:none;">'.$text.'</span>
                '.(strlen($text) > 100 ? '<a href="javascript:void(0)" class="toggle-text">Show More</a>' : '');
                })

                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="'.$row->id.'" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-quiz-question btn btn-primary btn-action " data-id="'.$row->id.'" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-quiz-question btn btn-danger  " data-id="'.$row->id.'" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action', 'question_text'])
                ->make(true);
        }
        $quizzes = Quiz::select('id', 'title')->get();
        $questions = Question::select('id', 'question_text')->get();

        return view('Dashboard/Quiz-Question/quiz-question', compact('questions', 'quizzes'));
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
