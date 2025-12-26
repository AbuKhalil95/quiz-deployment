<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stores adaptive quiz metadata - allows multiple students to take the same adaptive quiz
     */
    public function up(): void
    {
        Schema::create('adaptive_quiz_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->foreignId('target_student_id')
                ->constrained('users')
                ->comment('The student this quiz was originally generated for');
            $table->string('strategy')->comment('worst_performing, never_attempted, recently_incorrect, weak_subjects, mixed');
            $table->json('subject_ids')->nullable()->comment('Subject IDs used for filtering');
            $table->timestamps();

            // Index for querying adaptive quizzes by target student
            $table->index('target_student_id');
            $table->index('quiz_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adaptive_quiz_assignments');
    }
};
