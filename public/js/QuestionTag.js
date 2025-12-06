$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var QuestionTagTable = $("#QuestionTagTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/QuestionTag",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'question_text', name: 'question_text' },
            { data: 'tag_text', name: 'tag_text' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#QuestionTagTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/QuestionTag/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewQuestionQuestionTag').text(data.question ? data.question.question_text : '');
                $('#viewTagQuestionTag').text(data.tag ? data.tag.tag_text : '');
                $('#viewQuestionTagModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Question Tag details');
            }
        });
    });



    $("#addQuestionTagForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/QuestionTag",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addQuestionTagModal").modal("hide");
                $("#addQuestionTagForm")[0].reset();
                QuestionTagTable.ajax.reload();
                toastr.success("Question Tag added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Question Tag"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-question-tag", function () {
        var id = $(this).data("id");
        $.get("/QuestionTag/" + id + "/edit", function (data) {
            $("#updateQuestionTagForm #up_question_id").val(data.question_id);
            $("#updateQuestionTagForm #up_tag_id").val(data.tag_id);

            $("#updateQuestionTagForm").data("id", data.id);
            $("#updateQuestionTagModal").modal("show");
        });
    });

    $("#updateQuestionTagForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/QuestionTag/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateQuestionTagModal").modal("hide");
                QuestionTagTable.ajax.reload();
                toastr.success("Question Tag Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Question Tag"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-question-tag", function () {
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
                    url: "/QuestionTag/" + id,
                    success: function (response) {
                        QuestionTagTable.ajax.reload();
                        toastr.success("Question Tag deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Question Tag!");
                    },
                });
            }
        });
    });

})