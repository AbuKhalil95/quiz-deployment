<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdaptiveQuizAssignment extends Model
{
    /** @use HasFactory<\Database\Factories\AdaptiveQuizAssignmentFactory> */
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'target_student_id',
        'strategy',
        'subject_ids',
    ];

    protected $casts = [
        'subject_ids' => 'array',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function targetStudent()
    {
        return $this->belongsTo(User::class, 'target_student_id');
    }
}
