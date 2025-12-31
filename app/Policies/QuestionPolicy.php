<?php

namespace App\Policies;

use App\Models\Question;
use App\Models\User;

class QuestionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admins and teachers can view all questions
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Question $question): bool
    {
        // Admins and teachers can view all questions
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admins and teachers can create questions
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Question $question): bool
    {
        // Admins can update any question
        if ($user->hasRole('admin')) {
            return true;
        }

        // Teachers can update if:
        // 1. They created it and it's unassigned (initial state)
        // 2. They are assigned to it and it's not done
        $isAssignedToSelf = $question->assigned_to === $user->id;
        $isDone = $question->state === Question::STATE_DONE;
        $isUnassigned = ! $question->assigned_to;
        $isInitial = $question->state === Question::STATE_INITIAL;
        $isCreator = $question->created_by === $user->id;

        // Can edit if assigned to self and not done
        if ($isAssignedToSelf && ! $isDone) {
            return true;
        }

        // Can edit if created by self and unassigned in initial state
        if ($isCreator && $isUnassigned && $isInitial) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Question $question): bool
    {
        // Admins can delete any question
        if ($user->hasRole('admin')) {
            return true;
        }

        // Teachers can only delete questions they created
        return $question->created_by === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Question $question): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Question $question): bool
    {
        return $this->delete($user, $question);
    }
}
