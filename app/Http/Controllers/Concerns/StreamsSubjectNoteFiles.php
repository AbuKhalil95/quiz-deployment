<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Subject;
use App\Models\SubjectNote;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

trait StreamsSubjectNoteFiles
{
    private const SUBJECT_NOTE_MAX_TEXT_PREVIEW_BYTES = 524288;

    protected function subjectNoteAssertBelongs(Subject $subject, SubjectNote $note): void
    {
        abort_unless((int) $note->subject_id === (int) $subject->id, 404);
    }

    protected function subjectNoteAsciiFilename(string $name): string
    {
        $fallback = preg_replace('/[^\x20-\x7E]/', '_', $name);

        return $fallback !== '' ? $fallback : 'file';
    }

    protected function subjectNoteDownload(SubjectNote $note)
    {
        abort_unless(Storage::disk('local')->exists($note->stored_path), 404);

        return Storage::disk('local')->download($note->stored_path, $note->original_name, [
            'Content-Type' => $note->mime_type,
        ]);
    }

    protected function subjectNotePreview(SubjectNote $note)
    {
        abort_unless(Storage::disk('local')->exists($note->stored_path), 404);

        if ($note->isPdf()) {
            return Storage::disk('local')->response($note->stored_path, $note->original_name, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="'.$this->subjectNoteAsciiFilename($note->original_name).'"',
            ]);
        }

        if ($note->isText()) {
            $size = Storage::disk('local')->size($note->stored_path);
            abort_if($size > self::SUBJECT_NOTE_MAX_TEXT_PREVIEW_BYTES, 413, 'File too large to preview');

            $content = Storage::disk('local')->get($note->stored_path);

            return response($content, 200)->header('Content-Type', 'text/plain; charset=UTF-8');
        }

        abort(404);
    }

    protected function subjectNoteOfficeFrame(Subject $subject, SubjectNote $note, string $embedRouteName)
    {
        abort_unless($note->previewKind() === 'office', 404);
        abort_unless(Storage::disk('local')->exists($note->stored_path), 404);

        $embedUrl = URL::temporarySignedRoute(
            $embedRouteName,
            now()->addHours(2),
            ['subject' => $subject->id, 'note' => $note->id]
        );

        $src = 'https://view.officeapps.live.com/op/embed.aspx?src='.urlencode($embedUrl);
        $safeSrc = htmlspecialchars($src, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title></head>
<body style="margin:0;height:100vh">
<iframe src="{$safeSrc}" style="border:0;width:100%;height:100%" title="Document preview"></iframe>
</body>
</html>
HTML;

        return response($html)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    protected function subjectNoteEmbed(SubjectNote $note)
    {
        abort_unless(Storage::disk('local')->exists($note->stored_path), 404);

        return Storage::disk('local')->response($note->stored_path, $note->original_name, [
            'Content-Type' => $note->mime_type,
            'Content-Disposition' => 'inline; filename="'.$this->subjectNoteAsciiFilename($note->original_name).'"',
        ]);
    }
}
