<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesInertiaRequests;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    use HandlesInertiaRequests;

    /**
     * Get the authenticated user with proper type hinting for Intelephense.
     */
    protected function user(): ?User
    {
        /** @var User|null */
        return Auth::user();
    }
}
