<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = Role::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="'.$row->id.'" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-role btn btn-primary btn-action " data-id="'.$row->id.'" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-role btn btn-danger  " data-id="'.$row->id.'" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return view('Dashboard/Role/role');
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
