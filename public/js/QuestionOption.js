$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var QuestionOptionTable = $("#QuestionOptionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/QuestionOption",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'question_text', name: 'question_text' },
            { data: 'option_text', name: 'option_text' },
            { data: 'is_correct', name: 'is_correct' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })


 $('#QuestionOptionTable').on('click', '.toggle-text', function () {
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


    $('#QuestionOptionTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/QuestionOption/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewQuestionQuestionOption').text(data.question ? data.question.question_text : '');
                $('#viewtextQuestionOption').text(data.option_text);
                $('#viewtis_correctQuestionOption').text(data.is_correct ? 'Correct' : 'InCorrect');
                $('#viewQuestionOptionModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Question Option details');
            }
        });
    });



    $("#addQuestionOptionForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/QuestionOption",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addQuestionOptionModal").modal("hide");
                $("#addQuestionOptionForm")[0].reset();
                QuestionOptionTable.ajax.reload();
                toastr.success("Question Option added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Question Option"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-question-option", function () {
        var id = $(this).data("id");
        $.get("/QuestionOption/" + id + "/edit", function (data) {
            $("#updateQuestionOptionForm #up_question_id").val(data.question_id);
            $("#updateQuestionOptionForm #up_option_text").val(data.option_text);
            $("#updateQuestionOptionForm #is_correct").val(data.is_correct ? 1 : 0);

            $("#updateQuestionOptionForm").data("id", data.id);
            $("#updateQuestionOptionModal").modal("show");
        });
    });

    $("#updateQuestionOptionForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/QuestionOption/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateQuestionOptionModal").modal("hide");
                QuestionOptionTable.ajax.reload();
                toastr.success("Question Option Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Question Option"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-question-option", function () {
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
                    url: "/QuestionOption/" + id,
                    success: function (response) {
                        QuestionOptionTable.ajax.reload();
                        toastr.success(" Question Option deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Question Option!");
                    },
                });
            }
        });
    });

})