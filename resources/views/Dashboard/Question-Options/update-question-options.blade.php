<div class="modal fade" id="updateQuestionOptionModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">

    <div class="modal-dialog" role="document">

        <form id="updateQuestionOptionForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Update Question Option</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group my-2">
                            <label for="up_question_id">question </label>
                            <select class="form-control border-2 border-bottom" id="up_question_id" name="question_id"
                                required>
                                <option value=""> Select Question </option>
                                @foreach ($questions as $question)
                                    <option value="{{ $question->id }}">{{ $question->question_text }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_option_text">Option text</label>
                            <textarea class="form-control border-2 border-bottom" id="up_option_text" name="option_text"
                                required></textarea>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_is_correct">Is Correct?</label>
                            <select class="form-control border-2 border-bottom" id="up_is_correct" name="is_correct"
                                required>
                                <option value="0">InCorrect</option>
                                <option value="1">Correct</option>
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