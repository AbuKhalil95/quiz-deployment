<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('mode', ['by_subject', 'mixed_bag', 'timed'])->default('by_subject');
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('time_limit_minutes')->nullable();
            $table->unsignedInteger('total_questions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
