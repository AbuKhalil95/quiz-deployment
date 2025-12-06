$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var RoleUserTable = $("#RoleUserTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/RoleUser",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'user_name', name: 'user_name' },
            { data: 'role_name', name: 'role_name' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#RoleUserTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/RoleUser/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewUserNameRoleUser').text(data.user ? data.user.name : '');
                $('#viewRoleNameRoleUser').text(data.role ? data.role.name : '');
                $('#viewRoleUserModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Role User details');
            }
        });
    });



    $("#addRoleUserForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/RoleUser",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addRoleUserModal").modal("hide");
                $("#addRoleUserForm")[0].reset();
                RoleUserTable.ajax.reload();
                toastr.success("Role User added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Role user"
                    );
                }
            },
        });
    });






    $(document).on("click", ".edit-role-user", function () {
        var id = $(this).data("id");
        $.get("/RoleUser/" + id + "/edit", function (data) {
            $("#updateRoleUserForm #up_user_id").val(data.user_id);
            $("#updateRoleUserForm #up_role_id").val(data.role_id);

            $("#updateRoleUserForm").data("id", data.id);
            $("#updateRoleUserModal").modal("show");
        });
    });

    $("#updateRoleUserForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/RoleUser/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateRoleUserModal").modal("hide");
                RoleUserTable.ajax.reload();
                toastr.success("Role User Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Role user"
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-role-user", function () {
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
                    url: "/RoleUser/" + id,
                    success: function (response) {
                        RoleUserTable.ajax.reload();
                        toastr.success("Role User deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Role User!");
                    },
                });
            }
        });
    });

})