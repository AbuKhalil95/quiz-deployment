<div class="modal fade" id="updateAnswersModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">

    <div class="modal-dialog" role="document">

        <form id="updateAnswersForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Update Answers</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group my-2">

                            <select id="up_quiz_attempt_id" name="quiz_attempt_id"
                                class="form-control border-2 border-bottom">
                                @foreach($quizAttempts as $attempt)
                                    <option value="{{ $attempt->id }}">{{ $attempt->student->name }} -
                                        {{ $attempt->quiz->title }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group my-2">

                            <select id="up_question_id" name="question_id" class="form-control border-2 border-bottom">
                                @foreach($questions as $question)
                                    <option value="{{ $question->id }}">{{ $question->question_text }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group my-2">

                            <select id="up_selected_option_id" name="selected_option_id"
                                class="form-control border-2 border-bottom">
                                @foreach($options as $option)
                                    <option value="{{ $option->id }}">{{ $option->option_text }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group my-2">

                            <select id="up_is_correct" name="is_correct" class="form-control border-2 border-bottom">
                                <option value="1">Correct</option>
                                <option value="0">Incorrect</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </form>

    </div>

</div>