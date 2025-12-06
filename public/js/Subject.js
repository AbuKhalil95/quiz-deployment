$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var SubjectTable = $("#SubjectTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Subject",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#SubjectTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Subject/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewNameSubject').text(data.name);
                $('#viewSubjectModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Subject details');
            }
        });
    });



    $("#addSubjectForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Subject",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addSubjectModal").modal("hide");
                $("#addSubjectForm")[0].reset();
                SubjectTable.ajax.reload();
                toastr.success("Subject added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Subject"
                    );
                }
            },
        });
    });




    

    $(document).on("click", ".edit-subject", function () {
        var id = $(this).data("id");
        $.get("/Subject/" + id + "/edit", function (data) {
            $("#updateSubjectForm #up_name").val(data.name);
            $("#updateSubjectForm").data("id", data.id);
            $("#updateSubjectModal").modal("show");
        });
    });

    $("#updateSubjectForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Subject/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateSubjectModal").modal("hide");
                SubjectTable.ajax.reload();
                toastr.success("Subject Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Subject."
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-subject", function () {
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
                    url: "/Subject/" + id,
                    success: function (response) {
                        SubjectTable.ajax.reload();
                        toastr.success("Subject deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Subject!");
                    },
                });
            }
        });
    });

})