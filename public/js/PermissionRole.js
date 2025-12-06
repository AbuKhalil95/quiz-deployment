$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var PermissionRoleTable = $("#PermissionRoleTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/PermissionRole",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'permission_name', name: 'permission_name' },
            { data: 'role_name', name: 'role_name' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#PermissionRoleTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/PermissionRole/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewPermissionNamePermissionRole').text(data.permission ? data.permission.name : '');
                $('#viewRoleNamePermissionRole').text(data.role ? data.role.name : '');
                $('#viewPermissionRoleModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Role User details');
            }
        });
    });



    $("#addPermissionRoleForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/PermissionRole",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addPermissionRoleModal").modal("hide");
                $("#addPermissionRoleForm")[0].reset();
                PermissionRoleTable.ajax.reload();
                toastr.success("Permission Role added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Permission Role"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-permission-role", function () {
        var id = $(this).data("id");
        $.get("/PermissionRole/" + id + "/edit", function (data) {
            $("#updatePermissionRoleForm #up_permission_id").val(data.permission_id);
            $("#updatePermissionRoleForm #up_role_id").val(data.role_id);

            $("#updatePermissionRoleForm").data("id", data.id);
            $("#updatePermissionRoleModal").modal("show");
        });
    });

    $("#updatePermissionRoleForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/PermissionRole/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updatePermissionRoleModal").modal("hide");
                PermissionRoleTable.ajax.reload();
                toastr.success("Permission Role Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Permission Role"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-permission-role", function () {
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
                    url: "/PermissionRole/" + id,
                    success: function (response) {
                        PermissionRoleTable.ajax.reload();
                        toastr.success("Permission Role deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Permission Role!");
                    },
                });
            }
        });
    });

})