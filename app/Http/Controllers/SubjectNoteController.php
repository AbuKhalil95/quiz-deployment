<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\StreamsSubjectNoteFiles;
use App\Models\Subject;
use App\Models\SubjectNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubjectNoteController extends Controller
{
    use StreamsSubjectNoteFiles;

    private const ALLOWED_EXTENSIONS = [
        'pdf', 'txt', 'csv', 'md', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    ];

    public function store(Request $request, Subject $subject)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:20480'],
        ]);

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());
        if (! in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            return back()->withErrors([
                'file' => 'Allowed types: PDF, text, Word, Excel, PowerPoint.',
            ]);
        }

        $path = $file->store("subject_notes/{$subject->id}", 'local');

        SubjectNote::create([
            'subject_id' => $subject->id,
            'uploaded_by' => Auth::id(),
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $path,
            'mime_type' => $file->getClientMimeType() ?: 'application/octet-stream',
            'size_bytes' => $file->getSize() ?: 0,
        ]);

        if ($request->inertia()) {
            return redirect()
                ->route('admin.subjects.show', $subject->id)
                ->with('success', 'Note uploaded successfully.');
        }

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);
        $note->delete();

        if ($request->inertia()) {
            return redirect()
                ->route('admin.subjects.show', $subject->id)
                ->with('success', 'Note removed.');
        }

        return response()->json(['success' => true]);
    }

    public function download(Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNoteDownload($note);
    }

    public function preview(Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNotePreview($note);
    }

    public function officeFrame(Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNoteOfficeFrame($subject, $note, 'admin.subjects.notes.embed');
    }

    public function embed(Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNoteEmbed($note);
    }
}
