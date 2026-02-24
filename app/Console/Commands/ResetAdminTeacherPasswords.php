<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResetAdminTeacherPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:reset-admin-teacher-passwords';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate new passwords for admin and teacher users and update them in the database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $adminPass = Str::password(16, letters: true, numbers: true, symbols: true, spaces: false);
        $teacherPass = Str::password(16, letters: true, numbers: true, symbols: true, spaces: false);

        $admin = User::where('email', 'admin@quizzes.com')->first();
        $teacher = User::where('email', 'teacher@quizzes.com')->first();

        if ($admin) {
            $admin->update(['password' => Hash::make($adminPass)]);
            $this->info('Admin password updated.');
        } else {
            $this->warn('Admin user (admin@quizzes.com) not found.');
        }

        if ($teacher) {
            $teacher->update(['password' => Hash::make($teacherPass)]);
            $this->info('Teacher password updated.');
        } else {
            $this->warn('Teacher user (teacher@quizzes.com) not found.');
        }

        $this->newLine();
        $this->line('Save these passwords securely (they will not be shown again):');
        $this->newLine();
        $this->table(
            ['User', 'Email', 'New password'],
            [
                ['Admin', 'admin@quizzes.com', $admin ? $adminPass : '—'],
                ['Teacher', 'teacher@quizzes.com', $teacher ? $teacherPass : '—'],
            ]
        );

        return self::SUCCESS;
    }
}
