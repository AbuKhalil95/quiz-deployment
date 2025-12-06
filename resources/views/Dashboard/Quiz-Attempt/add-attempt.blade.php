<div class="modal fade" id="addAttemptModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="addAttemptForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Add Attempt</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="form-group my-2">
                        <label for="add_quiz_id">Quiz</label>
                        <select class="form-control border-2 border-bottom " id="add_quiz_id" name="quiz_id" required>
                            <option value="">Select Quiz</option>
                            @foreach($quizzes as $quiz)
                                <option value="{{ $quiz->id }}">{{ $quiz->title }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group my-2">
                        <label for="add_student_id">Student</label>
                        <select class="form-control border-2 border-bottom" id="add_student_id" name="student_id" required>
                            <option value="">Select Student</option>
                            @foreach($students as $student)
                                <option value="{{ $student->id }}">{{ $student->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group my-2">
                        <label for="add_started_at">Start Time</label>
                        <input type="datetime-local" class="form-control border-2 border-bottom" id="add_started_at" name="started_at"
                            required>
                    </div>

                    <div class="form-group my-2">
                        <label for="add_ended_at">End Time</label>
                        <input type="datetime-local" class="form-control border-2 border-bottom" id="add_ended_at" name="ended_at">
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