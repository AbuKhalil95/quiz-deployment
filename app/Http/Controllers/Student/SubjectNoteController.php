<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Concerns\StreamsSubjectNoteFiles;
use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\SubjectNote;

class SubjectNoteController extends Controller
{
    use StreamsSubjectNoteFiles;

    public function download(Subject $subject, SubjectNote $note)
    {
        $this->authorizeSubjectNotes($subject);
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNoteDownload($note);
    }

    public function preview(Subject $subject, SubjectNote $note)
    {
        $this->authorizeSubjectNotes($subject);
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNotePreview($note);
    }

    public function officeFrame(Subject $subject, SubjectNote $note)
    {
        $this->authorizeSubjectNotes($subject);
        $this->subjectNoteAssertBelongs($subject, $note);

        return $this->subjectNoteOfficeFrame($subject, $note, 'student.subjects.notes.embed');
    }

    /**
     * Signed URL target for Office Online (no session). Tighten with subject visibility.
     */
    public function embed(Subject $subject, SubjectNote $note)
    {
        $this->subjectNoteAssertBelongs($subject, $note);
        $this->authorizeSubjectNotes($subject);

        return $this->subjectNoteEmbed($note);
    }

    private function authorizeSubjectNotes(Subject $subject): void
    {
        $ok = Subject::query()
            ->whereKey($subject->id)
            ->whereHas('quizzes.questions')
            ->exists();

        abort_unless($ok, 403);
    }
}
