<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::query();

        // Search
        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $subjects = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('admin/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:subjects,name',
        ]);
        $subject = Subject::create([
            'name' => $request->name,

        ]);

        if ($request->header('X-Inertia')) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', 'Subject created successfully');
        }

        return response()->json(['success' => 'Subject saved successfully']);
    }

    public function show(string $id)
    {
        $subject = Subject::find($id);
        if (! $subject) {
            return response()->json(['error' => 'Subject not found'], 404);
        }

        if (request()->header('X-Inertia')) {
            return Inertia::render('admin/Subjects/Show', [
                'subject' => $subject,
            ]);
        }

        return response()->json($subject);
    }

    public function edit($id)
    {
        $subject = Subject::find($id);
        if (request()->header('X-Inertia')) {
            return Inertia::render('admin/Subjects/Edit', [
                'subject' => $subject,
            ]);
        }

        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|unique:subjects,name',
        ]);
        $subject = Subject::find($id);
        $subject->name = $request->name;

        $subject->save();
        if ($request->header('X-Inertia')) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', 'Subject updated successfully');
        }

        return response()->json(['success' => 'Subject updated successfully']);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (! $subject) {
            abort(404, 'Subject not found');
        }

        $subject->delete();

        if (request()->header('X-Inertia')) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', 'Subject deleted successfully');
        }

        return response()->json(['success' => 'Subject deleted successfully']);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:subjects,id',
        ]);

        $ids = $request->ids;
        $deleted = Subject::whereIn('id', $ids)->delete();

        if ($request->inertia($request)) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', "{$deleted} subject(s) deleted successfully");
        }

        return response()->json(['success' => "{$deleted} subject(s) deleted successfully"]);
    }
}
