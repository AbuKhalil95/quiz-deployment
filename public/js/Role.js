$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var RoleTable = $("#RoleTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Role",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#RoleTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Role/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewNameRole').text(data.name);
                $('#viewRoleModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Role details');
            }
        });
    });



    $("#addRoleForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Role",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addRoleModal").modal("hide");
                $("#addRoleForm")[0].reset();
                RoleTable.ajax.reload();
                toastr.success("Role added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Role"
                    );
                }
            },
        });
    });




    

    $(document).on("click", ".edit-role", function () {
        var id = $(this).data("id");
        $.get("/Role/" + id + "/edit", function (data) {
            $("#updateRoleForm #up_name").val(data.name);
            $("#updateRoleForm").data("id", data.id);
            $("#updateRoleModal").modal("show");
        });
    });

    $("#updateRoleForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Role/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateRoleModal").modal("hide");
                RoleTable.ajax.reload();
                toastr.success("Role Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Role."
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-role", function () {
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
                    url: "/Role/" + id,
                    success: function (response) {
                        RoleTable.ajax.reload();
                        toastr.success("Role deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Role!");
                    },
                });
            }
        });
    });

})