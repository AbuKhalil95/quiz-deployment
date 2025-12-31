@extends('student.layout')

@section('title', 'Take Quiz')

@section('content')
<div class="row">
    
    <div class="col-md-8 mx-auto">
                  <p class="text-center fw-bold">Question {{ $questionIndex + 1 }}/{{ count($questions) }}</p>

    
        <div class="card-shadow mb-3">
            <div class="card-body">

            <div class="card mb-3 p-2">
                @if($question->subject)
                    <span class="badge bg-secondary mb-2">{{ $question->subject->name }}</span>
                @endif
                <h5 class="mb-3">
                    {{ $question->question_text }}
                </h5>
            </div>

                <form action="{{ route('student.attempts.submit.single', [$attempt->id, $questionIndex]) }}"
                      method="POST">
                    @csrf

                    @foreach ($question->options as $option)
                        <div class="d-flex flex-row card gap-2 p-3 m-2" style="cursor: pointer;">
                            <input class="form-check-input" type="radio" name="answer"
                                   id="option{{ $option->id }}" value="{{ $option->id }}" required>
                            <label class="form-check-label w-100" for="option{{ $option->id }}">
                                {{ $option->option_text }}
                            </label>
                        </div>
                    @endforeach

                    <div class="d-flex flex-column flex-md-row justify-content-between mt-3 gap-2">
                        <a href="{{ route('student.dashboard') }}"
                           class="btn btn-secondary w-100 w-md-50 py-2">
                            Exit Practice
                        </a>

                        <button type="submit" class="btn btn-sm btn-primary w-100 w-md-50 py-2">
                            @if($questionIndex + 1 < count($questions))
                                Submit Answer
                            @else
                                Finish Quiz
                            @endif
                        </button>
                    </div>

                   
                </form>
            </div>
        </div>

    </div>
</div>

@endsection
