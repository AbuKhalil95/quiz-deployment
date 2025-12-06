$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var QuestionTable = $("#QuestionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Question",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'subject_name', name: 'subject_name' },
            { data: 'question_text', name: 'question_text' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })



    $('#QuestionTable').on('click', '.toggle-text', function () {
        var $link = $(this);
        var $shortText = $link.siblings('.short-text');
        var $fullText = $link.siblings('.full-text');

        if ($fullText.is(':visible')) {
            $fullText.hide();
            $shortText.show();
            $link.text('Show More');
        } else {
            $shortText.hide();
            $fullText.show();
            $link.text('Show Less');
        }
    });

    $('#QuestionTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Question/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewSubjectQuestion').text(data.subject ? data.subject.name : '');
                $('#viewtextQuestion').text(data.question_text);
                $('#viewQuestionModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Question details');
            }
        });
    });



    $("#addQuestionForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Question",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addQuestionModal").modal("hide");
                $("#addQuestionForm")[0].reset();
                QuestionTable.ajax.reload();
                toastr.success("Question added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Question"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-question", function () {
        var id = $(this).data("id");
        $.get("/Question/" + id + "/edit", function (data) {
            $("#updateQuestionForm #up_subject_id").val(data.subject_id);
            $("#updateQuestionForm #up_question_text").val(data.question_text);

            $("#updateQuestionForm").data("id", data.id);
            $("#updateQuestionModal").modal("show");
        });
    });

    $("#updateQuestionForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Question/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateQuestionModal").modal("hide");
                QuestionTable.ajax.reload();
                toastr.success("Question Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Question"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-question", function () {
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
                    url: "/Question/" + id,
                    success: function (response) {
                        QuestionTable.ajax.reload();
                        toastr.success("Question deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Question!");
                    },
                });
            }
        });
    });

})