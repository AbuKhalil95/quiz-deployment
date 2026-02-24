<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionReportController extends Controller
{

    public function index(Request $request)
    {
        $reports = QuestionReport::with(['user', 'question'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas(
                        'user',
                        fn($u) =>
                        $u->where('name', 'like', "%{$search}%")
                    )->orWhereHas(
                            'question',
                            fn($q2) =>
                            $q2->where('question_text', 'like', "%{$search}%")
                        );
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['search', 'status']),
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
