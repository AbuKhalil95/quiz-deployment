@extends('student.layout')

@section('title', 'Student Dashboard')

@section('content')
    <div class="row mb-4">
        <div class="col">
            <h3 class="mb-1">Welcome, {{ auth()->user()->name }}</h3>
            <p class="text-muted mb-0">Choose a quiz to start.</p>
        </div>
    </div>



    <div class="row">
        @forelse ($quizzes as $quiz)
            <div class="col-md-4 mb-3">
                <div class="card card-shadow h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ $quiz->title }}</h5>
                        <p class="card-text text-muted mb-1">
                            Mode: <strong>{{ ucfirst(str_replace('_', ' ', $quiz->mode)) }}</strong>
                        </p>
                        @if($quiz->subject)
                            <p class="card-text text-muted mb-1">
                                Subject: <strong>{{ $quiz->subject->name }}</strong>
                            </p>
                        @endif
                        @if($quiz->time_limit_minutes)
                            <p class="card-text text-muted mb-2">
                                Time limit: {{ $quiz->time_limit_minutes }} min
                            </p>
                        @endif

                        <div class="mt-auto">
                            <a href="{{ route('student.quizzes.show', $quiz->id) }}" class="btn btn-primary w-100">
                                View & Start
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <p>No quizzes available yet.</p>
        @endforelse

    </div>
    {{-- Pagination links --}}
    <div class="d-flex justify-content-center">
        {{ $quizzes->links('pagination::bootstrap-5 ') }}
    </div>

    <hr class="my-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Your Attempts</h4>
        <a href="{{ route('student.attempts.index') }}" class="btn btn-outline-secondary btn-sm">
            View all attempts
        </a>
    </div>
    <div class="row mb-4">
        @forelse ($lastAttempts as $attempt)
            <div class="col-md-4 mb-3">
                <div class="card card-shadow h-100">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">{{ $attempt->quiz->title }}</h6>
                        <p class="card-text text-muted mb-1">
                            Score: {{ $attempt->score ?? 0 }} / {{ $attempt->quiz->questions->count() }}
                        </p>
                        <p class="card-text text-muted mb-2">
                            Attempted: {{ $attempt->created_at->format('d M Y, H:i') }}
                        </p>
                        <div class="mt-auto">
                            <a href="{{ route('student.attempts.show', $attempt->id) }}" class="btn btn-primary btn-sm w-100">
                                View Attempt
                            </a>

                            @if(!$attempt->ended_at)
                                <a href="{{ route('student.attempts.resume', $attempt->id) }}"
                                    class="btn btn-warning btn-sm mt-1 w-100">
                                    Resume Quiz
                                </a>
                            @endif

                        </div>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">You have no recent attempts.</p>
        @endforelse
    </div>

@endsection