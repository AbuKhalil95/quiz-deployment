<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Student\AdaptiveQuizController;
use App\Http\Controllers\Student\AttemptController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\QuizController as StudentQuizController;
use Illuminate\Support\Facades\Route;

// -------------------- Guest (login / register) --------------------
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// -------------------- Student Area --------------------
Route::middleware(['auth'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('student.dashboard');
    Route::get('dashboard/subjects/{id}/quizzes', [DashboardController::class, 'quizzesBySubject'])->name('student.subject.quizzes');

    Route::prefix('student/quizzes/adaptive')->name('student.adaptive.')->group(function () {
        Route::get('/create', [AdaptiveQuizController::class, 'create'])
            ->name('create');
        Route::post('/generate', [AdaptiveQuizController::class, 'generate'])
            ->name('generate');
        Route::get('/', [AdaptiveQuizController::class, 'index'])
            ->name('index');
        Route::get('/my-challenges', [AdaptiveQuizController::class, 'myChallenges'])
            ->name('myChallenges');
        Route::patch('/{quiz}/toggle-visibility', [AdaptiveQuizController::class, 'toggleVisibility'])
            ->name('toggleVisibility');
    });

    // Tags by subject (accessible to students for adaptive quiz creation)
    Route::get('/student/questions/tags-by-subject/{subjectId?}', [\App\Http\Controllers\QuestionController::class, 'tagsBySubject'])
        ->name('student.questions.tagsBySubject');

    // Show quiz info + "Start quiz" button
    Route::get('/student/quizzes/{quiz}', [StudentQuizController::class, 'show'])
        ->name('student.quizzes.show');

    // Start quiz (create QuizAttempt + redirect to questions page)
    Route::post('/student/quizzes/{quiz}/start', [StudentQuizController::class, 'start'])
        ->name('student.quizzes.start');

    Route::get('/student/quizzes/{quiz}/leaderboard', [AdaptiveQuizController::class, 'leaderboard'])
        ->name('student.quizzes.leaderboard');

    // Take quiz (show questions)
    // Route::get('/student/attempts/{attempt}', [StudentQuizController::class, 'take'])
    //     ->name('student.attempts.take');

    Route::get('/student/attempts/{attempt}/question/{questionIndex}', [StudentQuizController::class, 'take'])
        ->name('student.attempts.take.single');

    Route::post('/student/attempts/{attempt}/question/{questionIndex}/submit', [StudentQuizController::class, 'submitSingle'])
        ->name('student.attempts.submit.single');
    // Submit quiz answers
    Route::post('/student/attempts/{attempt}/submit', [StudentQuizController::class, 'submit'])
        ->name('student.attempts.submit');

    // Student attempts history
    Route::get('/student/attempts', [AttemptController::class, 'index'])
        ->name('student.attempts.index');

    // View attempt details
    Route::get('/student/attempts/{attempt}/show', [AttemptController::class, 'show'])
        ->name('student.attempts.show');

    Route::get('attempts/{attempt}/resume', [AttemptController::class, 'resume'])
        ->name('student.attempts.resume');

    Route::post('attempts/{attempt}/complete', [AttemptController::class, 'complete'])
        ->name('student.attempts.complete');

    Route::post('attempts/{attempt}/archive', [AttemptController::class, 'archive'])
        ->name('student.attempts.archive');

    Route::post('attempts/{attempt}/unarchive', [AttemptController::class, 'unarchive'])
        ->name('student.attempts.unarchive');

    // Flagged Questions
    Route::get('/student/questions/flagged', [\App\Http\Controllers\Student\FlaggedQuestionsController::class, 'index'])
        ->name('student.questions.flagged');
    Route::post('/student/questions/{question}/flag', [\App\Http\Controllers\Student\FlaggedQuestionsController::class, 'store'])
        ->name('student.questions.flag');
    Route::delete('/student/questions/{question}/flag', [\App\Http\Controllers\Student\FlaggedQuestionsController::class, 'destroy'])
        ->name('student.questions.unflag');
});
