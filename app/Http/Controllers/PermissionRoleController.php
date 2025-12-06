<?php

namespace App\Http\Controllers;

use App\Models\Permission_Role;

use App\Models\permissions;
use App\Models\Role;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class PermissionRoleController extends Controller
{
   public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = Permission_Role::with(['permission', 'role']);

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('permission_name', function ($row) {
                    return $row->permission ? $row->permission->name : '';
                })
                ->addColumn('role_name', function ($row) {
                    return $row->role ? $row->role->name : '';
                })
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="' . $row->id . '" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-permission-role btn btn-primary btn-action " data-id="' . $row->id . '" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-permission-role btn btn-danger  " data-id="' . $row->id . '" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        $permissions = permissions::select('id', 'name')->get();
        $roles = Role::select('id', 'name')->get();

        return view('Dashboard/Permission-Role/permission-role', compact('permissions', 'roles'));
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

        if (!$permissionRole) {
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
