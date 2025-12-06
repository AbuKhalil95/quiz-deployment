<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesInertiaRequests;

abstract class Controller
{
    use HandlesInertiaRequests;
}
