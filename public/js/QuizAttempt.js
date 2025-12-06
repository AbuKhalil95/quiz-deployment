
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var AttemptTable = $("#AttemptTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Attempt",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'quiz_title', name: 'quiz_title' },
            { data: 'student_name', name: 'student_name' },
            { data: 'started_at', name: 'started_at' },
            { data: 'ended_at', name: 'ended_at' },
            { data: 'score', name: 'score' },
            { data: 'total_correct', name: 'total_correct' },
            { data: 'total_incorrect', name: 'total_incorrect' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#AttemptTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Attempt/' + id,
            type: 'GET',
            success: function (data) {
                $("#viewQuizTitleAttempt").text(data.quiz?.title);
                $("#viewStudentNameAttempt").text(data.student?.name);
                $("#viewStartedAtAttempt").text(data.started_at);
                $("#viewEndedAtAttempt").text(data.ended_at);
                $("#viewScoreAttempt").text(data.score);
                $("#viewTotalCorrectAttempt").text(data.total_correct);
                $("#viewTotalIncorrectAttempt").text(data.total_incorrect);

                $('#viewAttemptModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Attempt details');
            }
        });
    });



    $("#addAttemptForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Attempt",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addAttemptModal").modal("hide");
                $("#addAttemptForm")[0].reset();
                AttemptTable.ajax.reload();
                toastr.success("Attempt added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Attempt"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-attempt", function () {
        var id = $(this).data("id");
        $.get("/Attempt/" + id + "/edit", function (data) {
            $("#updateAttemptForm #up_quiz_id").val(data.quiz_id);
            $("#updateAttemptForm #up_student_id").val(data.student_id);
            if (data.started_at) {
                let start = new Date(data.started_at);
                let formattedStart = start.toISOString().slice(0, 16); 
                $("#updateAttemptForm #up_started_at").val(formattedStart);
            }
            if (data.ended_at) {
                let end = new Date(data.ended_at);
                let formattedEnd = end.toISOString().slice(0, 16);
                $("#updateAttemptForm #up_ended_at").val(formattedEnd);
            }
            $("#updateAttemptForm #up_score").val(data.score);
            $("#updateAttemptForm #up_total_correct").val(data.total_correct);
            $("#updateAttemptForm #up_total_incorrect").val(data.total_incorrect);
            $("#updateAttemptForm").data("id", data.id);
            $("#updateAttemptModal").modal("show");
        });
    });

    $("#updateAttemptForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Attempt/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateAttemptModal").modal("hide");
                AttemptTable.ajax.reload();
                toastr.success("Attempt Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Attempt"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-attempt", function () {
        var id = $(this).data("id");
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "DELETE",
                    url: "/Attempt/" + id,
                    success: function (response) {
                        AttemptTable.ajax.reload();
                        toastr.success("Attempt deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Attempt!");
                    },
                });
            }
        });
    });

})