<div class="modal fade" id="addQuizQuestionModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="addQuizQuestionForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Add Quiz question</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="form-group my-2">
                        <label for="quiz_id">Quiz</label>
                        <select class="form-control border-2 border-bottom" id="quiz_id" name="quiz_id" required>
                            <option value=""> Select quiz </option>
                            @foreach ($quizzes as $quiz)
                                <option value="{{ $quiz->id }}">{{ $quiz->title }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group my-2">
                        <label for="question_id">Question </label>
                        <select class="form-control border-2 border-bottom" id="question_id" name="question_id"
                            required>
                            <option value=""> Select Question </option>
                            @foreach ($questions as $question)
                                <option value="{{ $question->id }}">{{ $question->question_text }}</option>
                            @endforeach
                        </select>
                    </div>


                    <div class="modal-body">
                        <div class="form-group my-2">
                            <label for="order">Order</label>
                            <input type="number" class="form-control border-2 border-bottom" id="order" name="order"
                                min="1" required>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </div>
        </form>
    </div>
</div>