<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionTag extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionTagFactory> */
    use HasFactory;

    protected $fillable = ['question_id', 'tag_id'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
