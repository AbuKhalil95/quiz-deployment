<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function (): void {
            Route::middleware(['web', 'auth', 'role:admin,teacher'])
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => RoleMiddleware::class,   // 👈 our alias
            'can.access' => \App\Http\Middleware\EnsureUserCanAccess::class,
        ]);

        // // Trust proxies to detect HTTPS correctly behind Railway's load balancer
        // $middleware->trustProxies(at: '*');
        // $middleware->trustHosts(at: ['*']);

        // Apply Inertia middleware globally
        // It only activates when controllers return Inertia responses
        // Blade routes are unaffected
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle errors for both Blade and Inertia requests
        // Inertia requests get Inertia error pages, Blade requests get Blade error views
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            // Handle Inertia requests - render Inertia error pages
            if ($request->header('X-Inertia')) {
                // Handle validation errors
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return back()->withErrors($e->errors())->withInput();
                }

                // Handle 404 errors
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return \Inertia\Inertia::render('Error', [
                        'status' => 404,
                        'message' => $e->getMessage() ?: 'Page not found',
                    ])->toResponse($request)->setStatusCode(404);
                }

                // Handle 403 errors
                if (
                    $e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException ||
                    $e instanceof \Illuminate\Auth\Access\AuthorizationException
                ) {
                    return \Inertia\Inertia::render('Error', [
                        'status' => 403,
                        'message' => $e->getMessage() ?: 'You do not have permission to access this resource.',
                    ])->toResponse($request)->setStatusCode(403);
                }

                // Handle 500 errors
                if (
                    $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException &&
                    $e->getStatusCode() === 500
                ) {
                    return \Inertia\Inertia::render('Error', [
                        'status' => 500,
                        'message' => app()->environment('local') ? $e->getMessage() : 'Server Error',
                    ])->toResponse($request)->setStatusCode(500);
                }

                // Handle CSRF token mismatch (419)
                if ($e instanceof \Illuminate\Session\TokenMismatchException) {
                    return back()->with('error', 'Your session has expired. Please refresh the page.');
                }
            }
        });
    })->create();
