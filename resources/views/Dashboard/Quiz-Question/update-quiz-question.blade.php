<div class="modal fade" id="updateQuizQuestionModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">

    <div class="modal-dialog" role="document">

        <form id="updateQuizQuestionForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Update QuizQuestion</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">

                        <div class="form-group my-2">
                            <label for="up_quiz_id">Quiz Title</label>
                            <select class="form-control border-2 border-bottom" id="up_quiz_id" name="quiz_id" required>
                                <option value=""> Select quiz </option>
                                @foreach ($quizzes as $quiz)
                                    <option value="{{ $quiz->id }}">{{ $quiz->title }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_question_id">Question</label>
                            <select class="form-control border-2 border-bottom" id="up_question_id" name="question_id"
                                required>
                                <option value=""> Select question </option>
                                @foreach ($questions as $question)
                                    <option value="{{ $question->id }}">{{ $question->question_text }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_order">Order Question</label>
                            <input type="number" class="form-control border-2 border-bottom" id="up_order" name="order"
                                min="1" required>
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