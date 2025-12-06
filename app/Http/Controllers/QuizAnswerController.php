<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Yajra\DataTables\DataTables;

class QuizAnswerController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            Log::info('QuizAnswerController@index AJAX branch entered');
            $data = QuizAnswer::with(['attempt.student', 'attempt.quiz', 'question', 'selectedOption']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('student_name', fn ($row) => $row->attempt->student->name ?? '-')
                ->addColumn('quiz_title', fn ($row) => $row->attempt->quiz->title ?? '-')
                ->addColumn('question_text', function ($row) {
                    return $row->question ? $row->question->question_text : '';
                })
                ->addColumn('selected_option', fn ($row) => $row->selectedOption->option_text ?? '-')
                ->addColumn('is_correct', fn ($row) => $row->is_correct ? 'Correct' : 'Incorrect')
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                        <a href="javascript:void(0)" class="btn btn-info view" data-id="'.$row->id.'" title="View">View</a>

                        <a href="javascript:void(0)" class="btn btn-primary edit-answer" data-id="'.$row->id.'" title="Edit">
                            <i class="fas fa-pencil-alt"></i>
                        </a>

                        <a href="javascript:void(0)" class="btn btn-danger delete-answer" data-id="'.$row->id.'" title="Delete">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        $quizAttempts = QuizAttempt::with('student', 'quiz')->get();
        $questions = Question::all();
        $options = QuestionOption::all();

        return view('Dashboard/Quiz-Answers/answers', compact('quizAttempts', 'questions', 'options'));
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
