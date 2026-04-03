<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class SubjectNote extends Model
{
    protected $fillable = [
        'subject_id',
        'uploaded_by',
        'original_name',
        'stored_path',
        'mime_type',
        'size_bytes',
    ];

    protected static function booted(): void
    {
        static::deleting(function (SubjectNote $note) {
            if ($note->stored_path) {
                Storage::disk('local')->delete($note->stored_path);
            }
        });
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function previewKind(): string
    {
        if ($this->isPdf()) {
            return 'pdf';
        }
        if ($this->isText()) {
            return 'text';
        }

        return 'office';
    }

    public function isPdf(): bool
    {
        if (str_contains($this->mime_type, 'pdf')) {
            return true;
        }

        return str_ends_with(strtolower($this->original_name), '.pdf');
    }

    public function isText(): bool
    {
        $mime = strtolower($this->mime_type);
        if (str_starts_with($mime, 'text/')) {
            return true;
        }

        return (bool) preg_match('/\.(txt|csv|md)$/i', $this->original_name);
    }
}
