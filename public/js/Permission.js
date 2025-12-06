$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var PermissionTable = $("#PermissionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Permission",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#PermissionTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Permission/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewNamePermission').text(data.name);
                $('#viewPermissionModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Permission details');
            }
        });
    });



    $("#addPermissionForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Permission",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addPermissionModal").modal("hide");
                $("#addPermissionForm")[0].reset();
                PermissionTable.ajax.reload();
                toastr.success("Permission added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Permission"
                    );
                }
            },
        });
    });




    

    $(document).on("click", ".edit-permission", function () {
        var id = $(this).data("id");
        $.get("/Permission/" + id + "/edit", function (data) {
            $("#updatePermissionForm #up_name").val(data.name);
            $("#updatePermissionForm").data("id", data.id);
            $("#updatePermissionModal").modal("show");
        });
    });

    $("#updatePermissionForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Permission/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updatePermissionModal").modal("hide");
                PermissionTable.ajax.reload();
                toastr.success("Permission Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Permission."
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-permission", function () {
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
                    url: "/Permission/" + id,
                    success: function (response) {
                        PermissionTable.ajax.reload();
                        toastr.success("Permission deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Permission!");
                    },
                });
            }
        });
    });

})