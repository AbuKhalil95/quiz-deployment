<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return redirect()->route('admin.dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $role = Role::create([
            'name' => $request->name,

        ]);

        return response()->json(['success' => 'Role saved successfully']);
    }

    public function show(string $id)
    {
        $role = Role::find($id);
        if (! $role) {
            return response()->json(['error' => 'Role not found'], 404);
        }

        return response()->json($role);
    }

    public function edit($id)
    {
        $role = Role::find($id);

        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        $role->name = $request->name;

        $role->save();

        return response()->json(['success' => 'Role updated successfully']);
    }

    public function destroy($id)
    {
        Role::find($id)->delete();

        return response()->json(['success' => 'Role deleted successfully']);

    }
}
