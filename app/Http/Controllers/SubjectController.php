<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\SubjectNote;
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

        $subjects = $query
            ->withCount('notes')
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

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

        if ($request->inertia()) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', 'Subject created successfully');
        }

        return response()->json(['success' => 'Subject saved successfully']);
    }

    public function show(string $id)
    {
        $subject = Subject::with([
            'notes' => fn ($q) => $q->orderByDesc('created_at'),
        ])->find($id);
        if (! $subject) {
            return response()->json(['error' => 'Subject not found'], 404);
        }

        if (request()->inertia()) {
            return Inertia::render('admin/Subjects/Show', [
                'subject' => [
                    'id' => $subject->id,
                    'name' => $subject->name,
                ],
                'notes' => $subject->notes->map(fn (SubjectNote $n) => [
                    'id' => $n->id,
                    'original_name' => $n->original_name,
                    'mime_type' => $n->mime_type,
                    'size_bytes' => $n->size_bytes,
                    'preview_kind' => $n->previewKind(),
                    'created_at' => $n->created_at?->toIso8601String(),
                ]),
            ]);
        }

        return response()->json($subject->load('notes'));
    }

    public function edit($id)
    {
        $subject = Subject::find($id);
        if (request()->inertia()) {
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
        if ($request->inertia()) {
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

        if (request()->inertia()) {
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

        $subjects = Subject::whereIn('id', $ids)->get();
        $deleted = 0;
        foreach ($subjects as $subject) {
            $subject->delete();
            $deleted++;
        }

        if ($request->inertia()) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('success', "{$deleted} subject(s) deleted successfully");
        }

        return response()->json(['success' => "{$deleted} subject(s) deleted successfully"]);
    }
}
