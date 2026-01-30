<?php

use App\Http\Controllers\Admin\TagSubjectController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Admin Dashboard (Inertia React)
Route::get('/admin', function () {
    return \Inertia\Inertia::render('admin/Dashboard');
})->name('admin.dashboard');

// Admin-only routes - Users management
Route::middleware(['auth', 'can.access'])->group(function () {
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole'])
        ->name('admin.users.role');
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
    Route::post('/admin/users', [UserController::class, 'create'])->name('admin.users.create');
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});

// Admin/Teacher routes - These will use Inertia React
Route::middleware(['auth', 'role:admin,teacher'])->group(function () {

    // Subject
    Route::get('/admin/subjects', [SubjectController::class, 'index'])->name('admin.subjects.index');
    Route::post('/admin/subjects', [SubjectController::class, 'create'])->name('admin.subjects.create');
    Route::delete('/admin/subjects/bulk', [SubjectController::class, 'bulkDestroy'])->name('admin.subjects.bulkDestroy');
    Route::get('/admin/subjects/{id}', [SubjectController::class, 'show'])->name('admin.subjects.show');
    Route::get('/admin/subjects/{id}/edit', [SubjectController::class, 'edit'])->name('admin.subjects.edit');
    Route::post('/admin/subjects/{id}', [SubjectController::class, 'update'])->name('admin.subjects.update');
    Route::delete('/admin/subjects/{id}', [SubjectController::class, 'destroy'])->name('admin.subjects.destroy');

    // Question
    Route::post('/admin/questions/import', [QuestionController::class, 'import'])
        ->name('admin.questions.import');
    Route::get('/admin/questions', [QuestionController::class, 'index'])->name('admin.questions.index');
    Route::get('/admin/questions/ids', [QuestionController::class, 'getIds'])->name('admin.questions.ids');
    Route::get('/admin/questions/create', [QuestionController::class, 'createForm'])->name('admin.questions.createForm');
    Route::post('/admin/questions', [QuestionController::class, 'create'])->name('admin.questions.create');
    Route::get('/admin/questions/review', [QuestionController::class, 'reviewIndex'])->name('admin.questions.review.index');
    Route::get('/admin/questions/my-review', [QuestionController::class, 'myReviewIndex'])->name('admin.questions.myReview.index');

    // Question bulk operations
    Route::post('/admin/questions/bulk/assign', [QuestionController::class, 'bulkAssign'])->name('admin.questions.bulkAssign');
    Route::post('/admin/questions/bulk/change-state', [QuestionController::class, 'bulkChangeState'])->name('admin.questions.bulkChangeState');
    Route::delete('/admin/questions/bulk', [QuestionController::class, 'bulkDestroy'])->name('admin.questions.bulkDestroy');

    // Question fetching routes (for quiz creation) - must come before parameterized routes
    Route::get('/admin/questions/tags-by-subject/{subjectId?}', [QuestionController::class, 'tagsBySubject'])->name('admin.questions.tagsBySubject');
    Route::get('/admin/questions/by-subject/{subjectId}', [QuestionController::class, 'bySubject'])->name('admin.questions.bySubject');
    Route::get('/admin/questions/by-subjects', [QuestionController::class, 'bySubjects'])->name('admin.questions.bySubjects');
    Route::post('/admin/questions/adaptive', [\App\Http\Controllers\Student\AdaptiveQuizController::class, 'generate'])->name('admin.questions.adaptive');

    // Question actions
    Route::post('/admin/questions/{id}/assign', [QuestionController::class, 'assign'])->name('admin.questions.assign');
    Route::post('/admin/questions/{id}/unassign', [QuestionController::class, 'unassign'])->name('admin.questions.unassign');
    Route::post('/admin/questions/{id}/change-state', [QuestionController::class, 'changeState'])->name('admin.questions.changeState');
    Route::post('/admin/questions/{id}/reset-to-initial', [QuestionController::class, 'resetToInitial'])->name('admin.questions.resetToInitial');
    Route::middleware('can.access:question')->group(function () {
        Route::get('/admin/questions/{id}', [QuestionController::class, 'show'])->name('admin.questions.show');
        Route::get('/admin/questions/{id}/edit', [QuestionController::class, 'edit'])->name('admin.questions.edit');
        Route::post('/admin/questions/{id}', [QuestionController::class, 'update'])->name('admin.questions.update');
        Route::delete('/admin/questions/{id}', [QuestionController::class, 'destroy'])->name('admin.questions.destroy');

    });

    // Quiz (admin/teacher)
    Route::get('/admin/quizzes', [QuizController::class, 'index'])->name('admin.quizzes.index');
    Route::get('/admin/quizzes/create', [QuizController::class, 'createForm'])->name('admin.quizzes.createForm');
    Route::post('/admin/quizzes', [QuizController::class, 'create'])->name('admin.quizzes.create');
    Route::delete('/admin/quizzes/bulk', [QuizController::class, 'bulkDestroy'])->name('admin.quizzes.bulkDestroy');
    Route::get('/admin/quizzes/adaptive', [QuizController::class, 'adaptiveQuizzes'])->name('admin.quizzes.adaptive');

    Route::middleware('can.access:quiz')->group(function () {
        Route::get('/admin/quizzes/{id}', [QuizController::class, 'show'])->name('admin.quizzes.show');
        Route::get('/admin/quizzes/{id}/edit', [QuizController::class, 'edit'])->name('admin.quizzes.edit');
        Route::post('/admin/quizzes/{id}', [QuizController::class, 'update'])->name('admin.quizzes.update');
        Route::delete('/admin/quizzes/{id}', [QuizController::class, 'destroy'])->name('admin.quizzes.destroy');
        Route::delete('/admin/quizzes/{quiz}/questions/{question}', [QuizController::class, 'destroyQuestion'])->name('admin.quizzes.questions.destroy');
        Route::put('/admin/quizzes/{quiz}/questions/{question}', [QuizController::class, 'updateQuestion']);
        Route::post('/admin/quizzes/{quiz}/questions', [QuizController::class, 'storeQuestion']);
        Route::put('/admin/quizzes/{quiz}/questions/{quizQuestion}/order', [QuizController::class, 'updateOrder'])
            ->name('quizzes.questions.updateOrder');

    });

    // Attempt (for teachers/admin to view - index + show only, linked from nav)
    Route::get('/admin/attempts', [QuizAttemptController::class, 'index'])->name('admin.attempts.index');
    Route::get('/admin/attempts/{id}', [QuizAttemptController::class, 'show'])->name('admin.attempts.show');

    // Tag
    Route::get('/admin/tags', [TagController::class, 'index'])->name('admin.tags.index');
    Route::get('/admin/tags/ids', [TagController::class, 'getIds'])->name('admin.tags.ids');
    Route::post('/admin/tags', [TagController::class, 'create'])->name('admin.tags.create');
    Route::delete('/admin/tags/bulk', [TagController::class, 'bulkDestroy'])->name('admin.tags.bulkDestroy');
    Route::get('/admin/tags/{id}', [TagController::class, 'show'])->name('admin.tags.show');
    Route::get('/admin/tags/{id}/edit', [TagController::class, 'edit'])->name('admin.tags.edit');
    Route::post('/admin/tags/{id}', [TagController::class, 'update'])->name('admin.tags.update');
    Route::delete('/admin/tags/{id}', [TagController::class, 'destroy'])->name('admin.tags.destroy');

    // Tag-Subject Pivot Relationships
    Route::get('/admin/tag-subjects', [TagSubjectController::class, 'index'])->name('admin.tagSubjects.index');
});
