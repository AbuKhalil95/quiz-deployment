@extends('student.layout')

@section('title', 'Student Dashboard')

@section('content')
    <div class="row mb-4">
        <div class="col">
            <h3 class="mb-1">Welcome, {{ auth()->user()->name }}</h3>
            <p class="text-muted mb-0">Choose a subject to see quizzes.</p>
        </div>
    </div>

    <div class="row">
        @forelse ($subjects as $subject)
            <div class="col-md-4 mb-3">
                <div class="card card-shadow h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ $subject->name }}</h5>
                        <div class="mt-auto">
                            <a href="{{ route('student.subject.quizzes', $subject->id) }}" class="btn btn-primary w-100">
                                View Quizzes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">No subjects available yet.</p>
        @endforelse
    </div>


    {{-- Pagination --}}
    <div class="p-3">
        @if ($subjects->lastPage() > 1)
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item {{ $subjects->currentPage() == 1 ? 'disabled' : '' }}">
                        <a class="page-link" href="{{ $subjects->url(1) }}">1</a>
                    </li>

                    @php
                        $start = max(2, $subjects->currentPage() - 2);
                        $end = min($subjects->lastPage() - 1, $subjects->currentPage() + 2);
                    @endphp

                    @for ($i = $start; $i <= $end; $i++)
                        <li class="page-item {{ $subjects->currentPage() == $i ? 'active' : '' }}">
                            <a class="page-link" href="{{ $subjects->url($i) }}">{{ $i }}</a>
                        </li>
                    @endfor

                    <li class="page-item {{ $subjects->currentPage() == $subjects->lastPage() ? 'disabled' : '' }}">
                        <a class="page-link" href="{{ $subjects->url($subjects->lastPage()) }}">
                            {{ $subjects->lastPage() }}
                        </a>
                    </li>
                </ul>
            </nav>
        @endif
    </div>

    <hr class="my-4">

    {{-- Mixed Bag Quizzes Section --}}
    @if($mixedBagQuizzes->count() > 0)
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>Mixed Bag Quizzes</h4>
        </div>
        <p class="text-muted mb-3">Take randomized quizzes with questions from multiple subjects to test your knowledge across different topics.</p>

        <div class="row mb-4">
            @foreach ($mixedBagQuizzes as $quiz)
                @if($quiz->questions->count() > 0)
                    <div class="col-md-4 mb-3">
                        <div class="card card-shadow h-100">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">{{ $quiz->title }}</h5>
                                <p class="card-text text-muted mb-1">
                                    Mode: <strong>{{ ucfirst(str_replace('_', ' ', $quiz->mode)) }}</strong>
                                </p>
                                @if($quiz->time_limit_minutes)
                                    <p class="card-text text-muted mb-1">
                                        Time limit: {{ $quiz->time_limit_minutes }} min
                                    </p>
                                @endif
                                @if($quiz->total_questions)
                                    <p class="card-text text-muted mb-2">
                                        Questions: {{ $quiz->total_questions }}
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
                @endif
            @endforeach
        </div>

        <hr class="my-4">
    @endif

    {{-- Adaptive Quiz Section --}}
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Adaptive Quizzes</h4>
    </div>

    <div class="row mb-4">
        <div class="col-md-4 mb-3">
            <div class="card card-shadow h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">Create Challenge</h5>
                    <p class="card-text text-muted mb-3">
                        Generate a personalized adaptive quiz based on your performance
                    </p>
                    <div class="mt-auto">
                        <a href="{{ route('student.adaptive.create') }}" class="btn btn-primary w-100">
                            Create Challenge
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card card-shadow h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">Browse Challenges</h5>
                    <p class="card-text text-muted mb-3">
                        Take adaptive quizzes created by other students
                    </p>
                    <div class="mt-auto">
                        <a href="{{ route('student.adaptive.index') }}" class="btn btn-primary w-100">
                            Browse Challenges
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card card-shadow h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">My Challenges</h5>
                    <p class="card-text text-muted mb-3">
                        View and manage your created adaptive quizzes
                    </p>
                    <div class="mt-auto">
                        <a href="{{ route('student.adaptive.myChallenges') }}" class="btn btn-primary w-100">
                            My Challenges
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <hr class="my-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Your Recent Attempts</h4>
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