@extends('Dashboard/Layout')

@section('title', 'Attempt')
@section('content')


    <div class="row">
        <div class="col-12">
            <div class="card my-4">
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                        <h6 class="text-white text-capitalize ps-3">Attempt</h6>
                    </div>
                </div>

                @include("Dashboard.Quiz-Attempt.add-attempt")
                @include("Dashboard.Quiz-Attempt.show-attempt")
                @include("Dashboard.Quiz-Attempt.update-attempt")



                <div class="mx-3">
                    <a href="" class="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#addAttemptModal">
                        <i class="fas fa-solid fa-plus"></i> Add New Attempt</a>
                </div>

                <div class="card-body px-2 pb-2">
                    <div class="table-responsive p-0">
                        <table class="table align-items-center mb-0" id="AttemptTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <td>Quiz Title </td>
                                    <td>Student Name </td>
                                    <td>Started At </td>
                                    <td>Ended At </td>
                                    <td>Score </td>
                                    <td>Total Correct </td>
                                    <td>Total Incorrect </td>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection