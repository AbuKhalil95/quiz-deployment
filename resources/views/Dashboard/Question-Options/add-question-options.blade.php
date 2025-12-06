<div class="modal fade" id="addQuestionOptionModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="addQuestionOptionForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Add Question Option</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
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

                    <div class="form-group my-2">
                        <label for="option_text">Options Text</label>
                        <textarea class="form-control border-2 border-bottom" id="option_text" name="option_text"
                            required> </textarea>
                    </div>
                    <div class="form-group my-2">
                        <label for="is_correct">Is Correct ?</label>
                        <select class="form-control border-2 border-bottom" id="is_correct" name="is_correct" required>
                            <option value="0">InCorrect</option>
                            <option value="1">Correct</option>
                        </select>
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