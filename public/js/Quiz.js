$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    var QuizTable = $("#QuizTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Quiz",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'title', name: 'title' },
            { data: 'mode', name: 'mode' },
            { data: 'subject_name', name: 'subject_name' },
            { data: 'time_limit_minutes', name: 'time_limit_minutes' },
            { data: 'total_questions', name: 'total_questions' },
            { data: 'action', name: 'action', orderable: false, searchable: false },
        ]
    });

    
    $('#QuizTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Quiz/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewQuizTitle').text(data.title);
                $('#viewQuizMode').text(
                    data.mode === 'by_subject' ? 'By Subject' :
                        data.mode === 'mixed_bag' ? 'Mixed Bag' :
                            data.mode === 'timed' ? 'Timed' :
                                data.mode
                );
                $('#viewQuizSubject').text(data.subject ? data.subject.name : '-');
                $('#viewQuizTimeLimit').text(data.time_limit_minutes ?? '-');
                $('#viewQuizTotalQuestions').text(data.total_questions ?? '-');


                $('#viewQuizModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch quiz details');
            }
        });
    });

    
    $("#addQuizForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Quiz",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addQuizModal").modal("hide");
                $("#addQuizForm")[0].reset();
                QuizTable.ajax.reload();
                toastr.success("Quiz added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error("An error occurred while adding the quiz");
                }
            },
        });
    });

    
    $(document).on("click", ".edit-quiz", function () {
        var id = $(this).data("id");

        $.get("/Quiz/" + id + "/edit", function (data) {
            $("#updateQuizForm #up_title").val(data.title);
            $("#updateQuizForm #up_mode").val(data.mode);
            $("#updateQuizForm #up_subject_id").val(data.subject_id);
            $("#updateQuizForm #up_time_limit_minutes").val(data.time_limit_minutes);
            $("#updateQuizForm #up_total_questions").val(data.total_questions);

            $("#updateQuizForm").data("id", data.id);
            $("#updateQuizModal").modal("show");
        }).fail(function () {
            toastr.error("Failed to load quiz data");
        });
    });

    
    $("#updateQuizForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Quiz/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateQuizModal").modal("hide");
                QuizTable.ajax.reload();
                toastr.success("Quiz updated successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error("An error occurred while updating the quiz.");
                }
            },
        });
    });

    
    $(document).on("click", ".delete-quiz", function () {
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
                    url: "/Quiz/" + id,
                    success: function (response) {
                        QuizTable.ajax.reload();
                        toastr.success("Quiz deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete quiz!");
                    },
                });
            }
        });
    });

});
