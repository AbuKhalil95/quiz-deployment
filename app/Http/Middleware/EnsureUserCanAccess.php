<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanAccess
{
    /**
     * Handle an incoming request.
     *
     * Checks if the user can access the resource or route:
     * - If no model is provided: Only admins can access (route-level protection)
     * - If model is provided: Admins can access everything, teachers can only access resources they created
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|null  $model  Optional model name (e.g., 'question', 'quiz'). If null, only admins can access.
     */
    public function handle(Request $request, Closure $next, ?string $model = null): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        // If no model specified, this is a route-level check - only admins allowed
        if ($model === null) {
            if (! $user->hasRole('admin')) {
                abort(403, 'Only administrators can access this resource.');
            }

            return $next($request);
        }

        // Admins can access everything
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        // For teachers, check if they own the resource or can edit it
        if ($user->hasRole('teacher')) {
            // Get the ID from route parameters
            $id = $request->route('id');

            if ($id) {
                $modelClass = $this->getModelClass($model);
                $resource = $modelClass::find($id);

                if (! $resource) {
                    abort(404, ucfirst($model).' not found.');
                }

                // For questions, use the Policy instead of duplicating logic here
                // The controller will handle authorization via Policy
                if ($model === 'question') {
                    // Just check basic access - detailed authorization is in Policy
                    // Teachers can access question routes, but specific actions are checked in Policy
                    // No need to duplicate the complex logic here
                } else {
                    // For other resources, check if the resource belongs to the teacher
                    if ($resource->created_by !== $user->id) {
                        abort(403, 'You can only access '.$model.'s you created.');
                    }
                }
            }
        }

        return $next($request);
    }

    /**
     * Get the model class name from the model string
     */
    private function getModelClass(string $model): string
    {
        $models = [
            'question' => \App\Models\Question::class,
            'quiz' => \App\Models\Quiz::class,
        ];

        if (! isset($models[$model])) {
            abort(500, "Unknown model: {$model}");
        }

        return $models[$model];
    }
}
