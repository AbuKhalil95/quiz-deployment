<?php

namespace App\Http\Controllers;

use App\Models\Permission_Role;
use Illuminate\Http\Request;

class PermissionRoleController extends Controller
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
        $permissionRole = Permission_Role::create([
            'permission_id' => $request->permission_id,
            'role_id' => $request->role_id,

        ]);

        return response()->json(['success' => 'permissionRole saved successfully']);
    }

    public function show(string $id)
    {
        $permissionRole = Permission_Role::with(['permission', 'role'])->find($id);

        if (! $permissionRole) {
            return response()->json(['error' => 'permissionRole not found'], 404);
        }

        return response()->json([
            'id' => $permissionRole->id,
            'permission_id' => $permissionRole->permission_id,
            'role_id' => $permissionRole->role_id,
            'permission' => [
                'id' => $permissionRole->permission?->id,
                'name' => $permissionRole->permission?->name,
            ],
            'role' => [
                'id' => $permissionRole->role?->id,
                'name' => $permissionRole->role?->name,
            ],
        ]);
    }

    public function edit($id)
    {
        $permissionRole = Permission_Role::find($id);

        return response()->json($permissionRole);
    }

    public function update(Request $request, $id)
    {
        $permissionRole = Permission_Role::find($id);
        $permissionRole->permission_id = $request->permission_id;
        $permissionRole->role_id = $request->role_id;

        $permissionRole->save();

        return response()->json(['success' => 'permissionRole updated successfully']);
    }

    public function destroy($id)
    {
        Permission_Role::find($id)->delete();

        return response()->json(['success' => 'permissionRole deleted successfully']);

    }
}
