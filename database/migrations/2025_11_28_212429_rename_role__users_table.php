<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('role__users', 'role_user');
        Schema::rename('permission__roles', 'permission_role'); // if needed
    }

    public function down(): void
    {
        Schema::rename('role_user', 'role__users');
        Schema::rename('permission_role', 'permission__roles'); // if needed
    }
};
