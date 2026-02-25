<?php

namespace Database\Seeders;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\Role;
use App\Models\Subject;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PersonaSeeder extends Seeder
{
    /** Max percent improvement per week for upward trend (random factor within range) */
    private const WEEKLY_IMPROVEMENT_MIN = 1;

    private const WEEKLY_IMPROVEMENT_MAX = 3;

    /**
     * Persona config: email => [name, attempts_per_day, schedule filter, strength subjects, weakness subjects]
     * Schedule: 'daily' | 'every_other_day' | 'two_per_week'
     */
    private const PERSONAS = [
        'good.student@quizzes.com' => [
            'name' => 'Good Student',
            'attempts_per_day' => 10,
            'schedule' => 'daily',
            'strength_subjects' => ['Medicine', 'Surgery', 'Pediatrics'],
            'weakness_subjects' => ['Ethics and Community Health'],
            'performance' => ['strength' => [95, 100], 'weakness' => [70, 80], 'baseline' => [90, 95]],
        ],
        'soso.student@quizzes.com' => [
            'name' => 'So-so Student',
            'attempts_per_day' => 5,
            'schedule' => 'every_other_day',
            'strength_subjects' => ['Obstetrics & Gynecology', 'Orthopedics'],
            'weakness_subjects' => ['Psychiatry', 'Surgery'],
            'performance' => ['strength' => [75, 85], 'weakness' => [30, 45], 'baseline' => [55, 65]],
        ],
        'bad.student@quizzes.com' => [
            'name' => 'Bad Student',
            'attempts_per_day' => 2,
            'schedule' => 'two_per_week',
            'strength_subjects' => ['Orthopedics'],
            'weakness_subjects' => ['Medicine', 'Surgery', 'Pediatrics', 'Ethics and Community Health'],
            'performance' => ['strength' => [40, 55], 'weakness' => [15, 25], 'baseline' => [25, 35]],
        ],
    ];

    public function run(): void
    {
        $quizzes = Quiz::with(['questions.options', 'subject'])
            ->whereHas('questions')
            ->whereNotNull('subject_id')
            ->get();

        if ($quizzes->isEmpty()) {
            $this->command->warn('No quiz with questions found (or all have null subject_id). Skipping PersonaSeeder.');

            return;
        }

        $quizzesBySubject = $quizzes->groupBy('subject_id');
        $subjectIds = $quizzesBySubject->keys()->filter()->values();
        $subjectsByName = Subject::whereIn('id', $subjectIds)->get()->keyBy('name');

        $studentRole = Role::where('name', 'student')->first();
        if (! $studentRole) {
            $this->command->warn('Student role not found. Run RoleSeeder first.');

            return;
        }

        $personaUsers = [];
        foreach (self::PERSONAS as $email => $config) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $config['name'],
                    'password' => Hash::make('password'),
                ]
            );
            if (! $user->hasRole('student')) {
                $user->roles()->attach($studentRole->id);
            }
            $personaUsers[$email] = $user;
        }

        $quizList = $quizzes->values()->all();
        $quizIndex = 0;

        $endDate = Carbon::now()->endOfDay();
        $startDate = Carbon::now()->subMonths(2)->startOfDay();

        foreach (self::PERSONAS as $email => $config) {
            $user = $personaUsers[$email];
            $subjectMap = $this->buildSubjectMap($config, $subjectsByName);
            $activeDays = $this->getActiveDays($startDate, $endDate, $config['schedule']);

            foreach ($activeDays as $day) {
                for ($i = 0; $i < $config['attempts_per_day']; $i++) {
                    $quiz = $this->pickQuizRoundRobin($quizList, $quizIndex);
                    if (! $quiz) {
                        continue;
                    }

                    $band = $subjectMap[$quiz->subject_id] ?? 'baseline';
                    $pctRange = $config['performance'][$band];
                    $targetPct = rand($pctRange[0], $pctRange[1]) / 100;

                    $weekIndex = (int) $startDate->diffInWeeks($day);
                    $weeklyImprovement = rand(self::WEEKLY_IMPROVEMENT_MIN, self::WEEKLY_IMPROVEMENT_MAX) / 100;
                    $targetPct = min(1.0, $targetPct + ($weekIndex * $weeklyImprovement));

                    $questions = $quiz->questions;
                    if ($questions->isEmpty()) {
                        continue;
                    }

                    $totalQuestions = $questions->count();
                    $totalCorrect = (int) floor($totalQuestions * $targetPct);
                    $totalCorrect = min(max($totalCorrect, 0), $totalQuestions);
                    $totalIncorrect = $totalQuestions - $totalCorrect;

                    $startedAt = $day->copy()->setTime(8, 0)->addMinutes(rand(0, 12 * 60));
                    $endedAt = $startedAt->copy()->addMinutes(rand(2, 15));

                    $attempt = QuizAttempt::create([
                        'quiz_id' => $quiz->id,
                        'student_id' => $user->id,
                        'started_at' => $startedAt,
                        'ended_at' => $endedAt,
                        'score' => $totalCorrect,
                        'total_correct' => $totalCorrect,
                        'total_incorrect' => $totalIncorrect,
                    ]);

                    DB::table('quiz_attempts')
                        ->where('id', $attempt->id)
                        ->update([
                            'created_at' => $startedAt->format('Y-m-d H:i:s'),
                            'updated_at' => $endedAt->format('Y-m-d H:i:s'),
                        ]);

                    $this->createAnswers($attempt, $questions, $totalCorrect);
                }
            }

            $this->command->info("Seeded attempts for {$config['name']} ({$email})");
        }
    }

    /**
     * Build [subject_id => 'strength'|'weakness'|'baseline'] for persona
     */
    private function buildSubjectMap(array $config, Collection $subjectsByName): array
    {
        $map = [];
        foreach ($config['strength_subjects'] as $name) {
            $subject = $subjectsByName->get($name);
            if ($subject) {
                $map[$subject->id] = 'strength';
            }
        }
        foreach ($config['weakness_subjects'] as $name) {
            $subject = $subjectsByName->get($name);
            if ($subject) {
                $map[$subject->id] = 'weakness';
            }
        }

        return $map;
    }

    /**
     * @return Carbon[]
     */
    private function getActiveDays(Carbon $start, Carbon $end, string $schedule): array
    {
        $days = [];

        switch ($schedule) {
            case 'daily':
                $current = $start->copy();
                while ($current->lte($end)) {
                    $days[] = $current->copy();
                    $current->addDay();
                }
                break;
            case 'every_other_day':
                $current = $start->copy();
                while ($current->lte($end)) {
                    if ($current->dayOfYear % 2 === 0) {
                        $days[] = $current->copy();
                    }
                    $current->addDay();
                }
                break;
            case 'two_per_week':
                $current = $start->copy()->startOfWeek();
                while ($current->lte($end)) {
                    $weekEnd = $current->copy()->endOfWeek();
                    if ($weekEnd->lt($start)) {
                        $current->addWeek();

                        continue;
                    }
                    $weekDays = [];
                    $d = $current->copy()->max($start);
                    $limit = $weekEnd->min($end);
                    while ($d->lte($limit)) {
                        $weekDays[] = $d->copy();
                        $d->addDay();
                    }
                    $picked = min(2, count($weekDays));
                    if ($picked > 0) {
                        $chosen = collect($weekDays)->random($picked)->values()->all();
                        $days = array_merge($days, $chosen);
                    }
                    $current->addWeek();
                }
                usort($days, fn (Carbon $a, Carbon $b) => $a->timestamp <=> $b->timestamp);
                break;
        }

        return $days;
    }

    private function pickQuizRoundRobin(array $quizList, int &$index): ?Quiz
    {
        if (empty($quizList)) {
            return null;
        }
        $quiz = $quizList[$index % count($quizList)];
        $index++;

        return $quiz;
    }

    private function createAnswers(QuizAttempt $attempt, $questions, int $totalCorrect): void
    {
        $questions = $questions->shuffle();
        $correctCount = 0;

        foreach ($questions as $question) {
            $options = $question->options;
            $correctOption = $options->firstWhere('is_correct', true);
            $incorrectOptions = $options->where('is_correct', false)->values();

            if (! $correctOption || $incorrectOptions->isEmpty()) {
                continue;
            }

            $wantCorrect = $correctCount < $totalCorrect;
            if ($wantCorrect) {
                $selectedOption = $correctOption;
                $isCorrect = true;
                $correctCount++;
            } else {
                $selectedOption = $incorrectOptions->random();
                $isCorrect = false;
            }

            QuizAnswer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'selected_option_id' => $selectedOption->id,
                'is_correct' => $isCorrect,
            ]);
        }
    }
}
