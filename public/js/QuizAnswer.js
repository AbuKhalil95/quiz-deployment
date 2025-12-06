
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var AnswersTable = $("#AnswersTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Answers",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'student_name', name: 'student_name' },
            { data: 'quiz_title', name: 'quiz_title' },
            { data: 'question_text', name: 'question_text' },
            { data: 'selected_option', name: 'selected_option' },
            { data: 'is_correct', name: 'is_correct' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#AnswersTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Answers/' + id,
            type: 'GET',
            success: function (data) {
                $("#viewStudentNameAnswers").text(data.attempt?.student?.name ?? '');
                $("#viewQuizTitleAnswers").text(data.attempt?.quiz?.title ?? '');
                $("#viewQuestionAnswers").text(data.question?.question_text ?? '');
                $("#viewOptionAtAnswers").text(data.selected_option?.option_text ?? data.selectedOption?.option_text ?? '');
                $('#viewtIsCorrectAnswers').text(data.is_correct ? 'Correct' : 'InCorrect');
                $('#viewAnswersModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Answers details');
            }
        });
    });


    $(document).on("click", ".delete-answers", function () {
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
                    url: "/Answers/" + id,
                    success: function (response) {
                        AnswersTable.ajax.reload();
                        toastr.success("Answers deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Answers!");
                    },
                });
            }
        });
    });



})