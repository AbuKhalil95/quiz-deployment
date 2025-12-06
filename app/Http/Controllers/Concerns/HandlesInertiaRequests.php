<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait HandlesInertiaRequests
{
    /**
     * Determine if the request should return an Inertia response.
     * 
     * @param Request $request
     * @return bool
     */
    protected function wantsInertiaResponse(Request $request): bool
    {
        // Check for X-Inertia header (case-insensitive)
        $hasInertiaHeader = $request->header('X-Inertia') || $request->header('x-inertia');
        
        if ($hasInertiaHeader) {
            return true;
        }
        
        // If this is an admin route (/admin/*), prefer Inertia unless it's a DataTables request
        $isAdminRoute = str_starts_with($request->path(), 'admin');
        $isDataTablesRequest = $request->ajax() && $request->has('draw');
        
        return $isAdminRoute && !$isDataTablesRequest;
    }
    
    /**
     * Determine if the request is a DataTables AJAX request.
     * 
     * @param Request $request
     * @return bool
     */
    protected function isDataTablesRequest(Request $request): bool
    {
        return $request->ajax() && $request->has('draw') && !$this->wantsInertiaResponse($request);
    }
}

