<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration is no longer needed - we use adaptive_quiz_assignments table instead
     * Keeping it empty to maintain migration order
     */
    public function up(): void
    {
        // No longer adding student_id to quizzes table
        // Using adaptive_quiz_assignments table instead for better design
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};
