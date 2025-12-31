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
        Schema::table('adaptive_quiz_assignments', function (Blueprint $table) {
            $table->boolean('is_public')->default(false);
            $table->index('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('adaptive_quiz_assignments', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
    }
};
