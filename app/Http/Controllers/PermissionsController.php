<?php

namespace App\Http\Controllers;

use App\Models\permissions;
use Illuminate\Http\Request;

class PermissionsController extends Controller
{
    public function index(Request $request)
    {
        return redirect()->route('admin.dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $permission = permissions::create([
            'name' => $request->name,

        ]);

        return response()->json(['success' => 'Permission saved successfully']);
    }

    public function show(string $id)
    {
        $permission = permissions::find($id);
        if (! $permission) {
            return response()->json(['error' => 'Permission not found'], 404);
        }

        return response()->json($permission);
    }

    public function edit($id)
    {
        $permission = permissions::find($id);

        return response()->json($permission);
    }

    public function update(Request $request, $id)
    {
        $permission = permissions::find($id);
        $permission->name = $request->name;

        $permission->save();

        return response()->json(['success' => 'Permission updated successfully']);
    }

    public function destroy($id)
    {
        permissions::find($id)->delete();

        return response()->json(['success' => 'Permission deleted successfully']);

    }
}
