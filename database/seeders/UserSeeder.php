<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@quizzes.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign admin role
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole && ! $admin->hasRole('admin')) {
            $admin->roles()->attach($adminRole->id);
            $this->command->info('Admin user created: admin@quizzes.com / password');
        }

        // Create a test teacher user
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@quizzes.com'],
            [
                'name' => 'Teacher User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign teacher role
        $teacherRole = Role::where('name', 'teacher')->first();
        if ($teacherRole && ! $teacher->hasRole('teacher')) {
            $teacher->roles()->attach($teacherRole->id);
            $this->command->info('Teacher user created: teacher@quizzes.com / password');
        }

        // Create a test student user
        $student = User::firstOrCreate(
            ['email' => 'student@quizzes.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign student role
        $studentRole = Role::where('name', 'student')->first();
        if ($studentRole && ! $student->hasRole('student')) {
            $student->roles()->attach($studentRole->id);
            $this->command->info('Student user created: student@quizzes.com / password');
        }
    }
}
