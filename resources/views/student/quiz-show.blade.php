@extends('student.layout')

@section('title', $quiz->title)

@section('content')
    <div class="row">
        <div class="col-md-8 mx-auto">
            <div class="card card-shadow mb-3">
                <div class="card-body">
                    <h3 class="mb-3">{{ $quiz->title }}</h3>

                    @if($quiz->subject)
                        <p class="text-muted mb-1">
                            Subject: <strong>{{ $quiz->subject->name }}</strong>
                        </p>
                    @endif

                    <p class="text-muted mb-1">
                        Mode: <strong>{{ ucfirst(str_replace('_', ' ', $quiz->mode)) }}</strong>
                    </p>

                    @if($quiz->time_limit_minutes)
                        <p class="text-muted mb-1">
                            Time limit: {{ $quiz->time_limit_minutes }} minutes
                        </p>
                    @endif

                    @if($quiz->questions->count())
                        <p class="text-muted mb-2">
                            Questions: {{ $quiz->questions->count() }}
                        </p>
                    @endif

                    <form action="{{ route('student.quizzes.start', $quiz->id) }}" method="POST" class="mt-3">
                        @csrf
                        <button type="submit" class="btn btn-primary">
                            Start Quiz
                        </button>
                    </form>

                    <a href="{{ route('student.dashboard') }}" class="btn btn-link mt-2">
                        Back to dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@endsection
