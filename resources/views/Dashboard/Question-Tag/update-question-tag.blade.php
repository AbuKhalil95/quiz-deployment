<div class="modal fade" id="updateQuestionTagModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">

    <div class="modal-dialog" role="document">

        <form id="updateQuestionTagForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Update Question Tag</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">


                        <div class="form-group my-2">
                            <label for="up_question_id">Question </label>
                            <select class="form-control border-2 border-bottom" id="up_question_id" name="question_id" required>
                                <option value=""> Select question </option>
                                @foreach ($questions as $question)
                                    <option value="{{ $question->id }}">{{ $question->question_text }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_tag_id">Tag </label>
                            <select class="form-control border-2 border-bottom" id="up_tag_id" name="tag_id" required>
                                <option value=""> Select tag </option>
                                @foreach ($tags as $tag)
                                    <option value="{{ $tag->id }}">{{ $tag->tag_text }}</option>
                                @endforeach
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