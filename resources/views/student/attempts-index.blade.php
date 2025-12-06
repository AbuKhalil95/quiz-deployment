@extends('student.layout')

@section('title', 'My Attempts')

@section('content')
    <div class="row mb-3">
        <div class="col">
            <h3 class="mb-1">My Attempts</h3>
            <p class="text-muted mb-0">View your quiz history and results.</p>
        </div>
    </div>

   

    <div class="card card-shadow">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Quiz</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Correct</th>
                            <th>Incorrect</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($attempts as $attempt)
                            <tr>
                                <td>{{ $attempt->quiz->title ?? 'N/A' }}</td>
                                <td>{{ $attempt->created_at->format('Y-m-d H:i') }}</td>
                                <td>{{ $attempt->score }}</td>
                                <td>{{ $attempt->total_correct }}</td>
                                <td>{{ $attempt->total_incorrect }}</td>
                                <td>
                                    <a href="{{ route('student.attempts.show', $attempt->id) }}" class="btn btn-sm btn-primary">
                                        View Details
                                    </a>
                                    @if(!$attempt->ended_at)
                                        <a href="{{ route('student.attempts.resume', $attempt->id) }}"
                                            class="btn btn-warning btn-sm">
                                            Resume Quiz
                                        </a>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-3">
                                    No attempts yet.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection