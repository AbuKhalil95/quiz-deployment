<div class="modal fade" id="updateAttemptModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">

    <div class="modal-dialog" role="document">

        <form id="updateAttemptForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addModalLabel">Update Attempt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group my-2">
                            <label for="up_quiz_id">Quiz</label>
                            <select class="form-control border-2 border-bottom" id="up_quiz_id" name="quiz_id" required>
                                <option value="">Select Quiz</option>
                                @foreach($quizzes as $quiz)
                                    <option value="{{ $quiz->id }}">{{ $quiz->title }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_student_id">Student</label>
                            <select class="form-control border-2 border-bottom" id="up_student_id" name="student_id"
                                required>
                                <option value="">Select Student</option>
                                @foreach($students as $student)
                                    <option value="{{ $student->id }}">{{ $student->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_started_at">Start Time</label>
                            <input type="datetime-local" class="form-control border-2 border-bottom" id="up_started_at"
                                name="started_at" required>
                        </div>

                        <div class="form-group my-2">
                            <label for="up_ended_at">End Time</label>
                            <input type="datetime-local" class="form-control border-2 border-bottom" id="up_ended_at"
                                name="ended_at">
                        </div>

                        <div class="form-group my-2">
                            <label for="up_score">Score</label>
                            <input type="number" class="form-control border-2 border-bottom" id="up_score" name="score"
                                min="0">
                        </div>

                        <div class="form-group my-2">
                            <label for="up_total_correct">Total Correct</label>
                            <input type="number" class="form-control border-2 border-bottom" id="up_total_correct"
                                name="total_correct" min="0">
                        </div>

                        <div class="form-group my-2">
                            <label for="up_total_incorrect">Total Incorrect</label>
                            <input type="number" class=" form-control border-2 border-bottom" id="up_total_incorrect"
                                name="total_incorrect" min="0">
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