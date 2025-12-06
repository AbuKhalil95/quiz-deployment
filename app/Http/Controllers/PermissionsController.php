<?php

namespace App\Http\Controllers;

use App\Models\permissions;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class PermissionsController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = permissions::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="'.$row->id.'" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-permission btn btn-primary btn-action " data-id="'.$row->id.'" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-permission btn btn-danger  " data-id="'.$row->id.'" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return view('Dashboard/Permission/permission');
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
