<div class="modal fade" id="addQuizModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="addQuizForm" enctype="multipart/form-data">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel">Add Quiz</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="form-group my-2">
                        <label for="title">Title</label>
                        <input type="text" class="form-control border-2 border-bottom" id="title" name="title" required>
                    </div>

                    <div class="form-group my-2">
                        <label for="mode">Mode</label>
                        <select class="form-control border-2 border-bottom" id="mode" name="mode" required>
                            <option value="by_subject">By Subject</option>
                            <option value="mixed_bag">Mixed Bag</option>
                            <option value="timed">Timed</option>
                        </select>
                    </div>

                    <div class="form-group my-2">
                        <label for="subject_id">Subject (required for By Subject)</label>
                        <select class="form-control border-2 border-bottom" id="subject_id" name="subject_id">
                            <option value="">-- Select Subject --</option>
                            @foreach ($subjects as $subject)
                                <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group my-2">
                        <label for="time_limit_minutes">Time Limit (minutes, only for Timed)</label>
                        <input type="number" min="1" class="form-control border-2 border-bottom" id="time_limit_minutes"
                            name="time_limit_minutes">
                    </div>

                    <div class="form-group my-2">
                        <label for="total_questions">Total Questions</label>
                        <input type="number" min="1" class="form-control border-2 border-bottom" id="total_questions"
                            name="total_questions">
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