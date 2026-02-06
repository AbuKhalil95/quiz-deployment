<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionReportController extends Controller
{

    public function index()
    {
        $reports = QuestionReport::with(['user', 'question'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved',
        ]);

        $report = QuestionReport::findOrFail($id);
        $report->status = $request->status;
        $report->save();

        return back()->with('success', 'Report status updated successfully.');
    }


    public function show($id)
    {
        $report = QuestionReport::with(['user', 'question'])->findOrFail($id);
        return Inertia::render('admin/reports/Show', [
            'report' => $report,
        ]);
    }

    public function store(Request $request, Question $question)
    {
        $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();

        $user->reportedQuestions()->syncWithoutDetaching([
            $question->id => ['reason' => $request->reason]
        ]);

        return back()->with('success', 'Question reported successfully.');
    }


    public function destroy(Question $question)
    {
        auth()->user()
            ->reportedQuestions()
            ->detach($question->id);

        return back();
    }
}
