<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Apply search filter if exists
        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");

            });
        }

        $users = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return \Inertia\Inertia::render('admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:teacher,student',
        ]);

        $role = Role::where('name', $request->role)->firstOrFail();

        $user->roles()->sync([$role->id]);

        return back()->with('success', 'Role updated successfully.');
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // For Inertia requests
        if ($request->header('X-Inertia')) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'User created successfully');
        }

        // Legacy JSON response
        return response()->json(['success' => 'User saved successfully']);
    }

    public function show(string $id)
    {
        $user = User::with('roles')->find($id);

        if (! $user) {
            abort(404, 'User not found');
        }

        // For Inertia requests
        if (request()->header('X-Inertia')) {
            return \Inertia\Inertia::render('admin/Users/Show', [
                'user' => $user,
            ]);
        }

        // Legacy JSON response
        return response()->json($user);
    }

    // public function edit($id)
    // {
    //     $user = User::find($id);
    //     return response()->json($user);
    // }

    // public function update(Request $request, $id)
    // {
    //     $user = User::find($id);
    //     $user->name = $request->name;
    //     $user->email = $request->email;
    //     if ($request->filled('password')) {
    //         $user->password = Hash::make($request->password);
    //     }

    //     $user->save();
    //     return response()->json(['success' => 'User updated successfully']);
    // }

    public function destroy($id)
    {
        $user = User::with('roles')->find($id);

        if (! $user) {
            abort(404, 'User not found');
        }

        // Prevent deletion of admin accounts
        if ($user->hasRole('admin')) {
            $message = 'Cannot delete admin accounts. This operation is restricted.';

            // For Inertia requests
            if (request()->header('X-Inertia')) {
                return redirect()
                    ->route('admin.users.index')
                    ->with('error', $message);
            }

            // Legacy JSON response
            return response()->json(['error' => $message], 403);
        }

        $user->delete();

        // For Inertia requests
        if (request()->header('X-Inertia')) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'User deleted successfully');
        }

        // Legacy JSON response
        return response()->json(['success' => 'User deleted successfully']);
    }
}
