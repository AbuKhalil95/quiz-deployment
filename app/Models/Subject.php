<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    protected static function booted(): void
    {
        static::deleting(function (Subject $subject) {
            $subject->notes->each->delete();
        });
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'subject_id', 'id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'subject_tag')
            ->withTimestamps();
    }

    public function notes()
    {
        return $this->hasMany(SubjectNote::class);
    }
}
