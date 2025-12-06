<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $data = Subject::query();

            return DataTables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    return '
                    <div class="d-grid gap-2 d-md-block">
                    <a href="javascript:void(0)" class="btn btn-info  view" data-id="'.$row->id.'" data-toggle="tooltip" title="View">View</a>

                     <a href="javascript:void(0)" class="edit-subject btn btn-primary btn-action " data-id="'.$row->id.'" data-toggle="tooltip" title="Edit">
                      <i class="fas fa-pencil-alt"></i>
                     </a>

                    <a href="javascript:void(0)" class="delete-subject btn btn-danger  " data-id="'.$row->id.'" data-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                      </a>
                     </div>';
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return view('Dashboard/Subject/subject');
    }

    public function create(Request $request)
    {
        $subject = Subject::create([
            'name' => $request->name,

        ]);

        return response()->json(['success' => 'Subject saved successfully']);
    }

    public function show(string $id)
    {
        $subject = Subject::find($id);
        if (! $subject) {
            return response()->json(['error' => 'Subject not found'], 404);
        }

        return response()->json($subject);
    }

    public function edit($id)
    {
        $subject = Subject::find($id);

        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);
        $subject->name = $request->name;

        $subject->save();

        return response()->json(['success' => 'Subject updated successfully']);
    }

    public function destroy($id)
    {
        Subject::find($id)->delete();

        return response()->json(['success' => 'Subject deleted successfully']);

    }
}
