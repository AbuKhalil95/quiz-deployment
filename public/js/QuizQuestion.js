
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var QuizQuestionTable = $("#QuizQuestionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/QuizQuestion",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'quiz_title', name: 'quiz_title' },
            { data: 'question_text', name: 'question_text' },
            { data: 'order', name: 'order' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })


    $('#QuizQuestionTable').on('click', '.toggle-text', function () {
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

    $('#QuizQuestionTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/QuizQuestion/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewQuizQuizQuestion').text(data.quiz ? data.quiz.title : '');
                $('#viewQuestionQuizQuestion').text(data.question ? data.question.question_text : '');
                $('#viewOrderQuizQuestion').text(data.order);

                // Show options
                var optionsHtml = '';
                if (data.question.options && data.question.options.length > 0) {
                    data.question.options.forEach(function (opt) {
                        optionsHtml += `<li>${opt.option_text} ${opt.is_correct ? '(Correct)' : ''}</li>`;
                    });
                } else {
                    optionsHtml = '<li>No options found</li>';
                }
                $('#viewOptionsQuizQuestion').html(optionsHtml);

                $('#viewQuizQuestionModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Quiz Question details');
            }
        });
    });



    $("#addQuizQuestionForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/QuizQuestion",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addQuizQuestionModal").modal("hide");
                $("#addQuizQuestionForm")[0].reset();
                QuizQuestionTable.ajax.reload();
                toastr.success("Quiz Question added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Quiz Question"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-quiz-question", function () {
        var id = $(this).data("id");
        $.get("/QuizQuestion/" + id + "/edit", function (data) {
            $("#updateQuizQuestionForm #up_quiz_id").val(data.quiz_id);
            $("#updateQuizQuestionForm #up_question_id").val(data.question_id);
            $("#updateQuizQuestionForm #up_order").val(data.order);

            $("#updateQuizQuestionForm").data("id", data.id);
            $("#updateQuizQuestionModal").modal("show");
        });
    });

    $("#updateQuizQuestionForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/QuizQuestion/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateQuizQuestionModal").modal("hide");
                QuizQuestionTable.ajax.reload();
                toastr.success("Quiz Question Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Quiz Question"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-quiz-question", function () {
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
                    url: "/QuizQuestion/" + id,
                    success: function (response) {
                        QuizQuestionTable.ajax.reload();
                        toastr.success("Quiz Question deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Quiz Question!");
                    },
                });
            }
        });
    });

})