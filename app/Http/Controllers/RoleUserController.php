<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Role_User;
use App\Models\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class RoleUserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = Role_User::with(['user', 'role']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('user_name', function ($row) {
                    return $row->user ? $row->user->name : '';
                })
                ->addColumn('role_name', function ($row) {
                    return $row->role ? $row->role->name : '';
                })
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="' . $row->id . '" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-role-user btn btn-primary btn-action " data-id="' . $row->id . '" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-role-user btn btn-danger  " data-id="' . $row->id . '" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        $users = User::select('id', 'name')->get();
        $roles = Role::select('id', 'name')->get();

        return view('Dashboard/Role-User/role-user', compact('users', 'roles'));
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

        if (!$roleUser) {
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
