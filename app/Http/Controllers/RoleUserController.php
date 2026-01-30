<?php

namespace App\Http\Controllers;

use App\Models\Role_User;
use Illuminate\Http\Request;

class RoleUserController extends Controller
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
        $roleUser = Role_User::create([
            'user_id' => $request->user_id,
            'role_id' => $request->role_id,

        ]);

        return response()->json(['success' => 'RoleUser saved successfully']);
    }

    public function show(string $id)
    {
        $roleUser = Role_User::with(['user', 'role'])->find($id);

        if (! $roleUser) {
            return response()->json(['error' => 'RoleUser not found'], 404);
        }

        return response()->json([
            'id' => $roleUser->id,
            'user_id' => $roleUser->user_id,
            'role_id' => $roleUser->role_id,
            'user' => [
                'id' => $roleUser->user?->id,
                'name' => $roleUser->user?->name,
            ],
            'role' => [
                'id' => $roleUser->role?->id,
                'name' => $roleUser->role?->name,
            ],
        ]);
    }

    public function edit($id)
    {
        $roleUser = Role_User::find($id);

        return response()->json($roleUser);
    }

    public function update(Request $request, $id)
    {
        $roleUser = Role_User::find($id);
        $roleUser->user_id = $request->user_id;
        $roleUser->role_id = $request->role_id;

        $roleUser->save();

        return response()->json(['success' => 'RoleUser updated successfully']);
    }

    public function destroy($id)
    {
        Role_User::find($id)->delete();

        return response()->json(['success' => 'RoleUser deleted successfully']);

    }
}
