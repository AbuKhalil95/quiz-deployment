<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionStateHistory extends Model
{
    use HasFactory;

    protected $table = 'question_state_history';

    protected $fillable = [
        'question_id',
        'from_state',
        'to_state',
        'changed_by',
        'notes',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
