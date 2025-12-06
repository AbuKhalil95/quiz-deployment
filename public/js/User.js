$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var UserTable = $("#UserTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/User",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'email', name: 'email' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#UserTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/User/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewNameUser').text(data.name);
                $('#viewEmailUser').text(data.email);
                $('#viewUserModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch User details');
            }
        });
    });



    $("#addUserForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/User",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addUserModal").modal("hide");
                $("#addUserForm")[0].reset();
                UserTable.ajax.reload();
                toastr.success("User added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the User"
                    );
                }
            },
        });
    });




   

    // $(document).on("click", ".edit-user", function () {
    //     var id = $(this).data("id");
    //     $.get("/User/" + id + "/edit", function (data) {
    //         $("#updateUserForm #up_name").val(data.name);
    //         $("#updateUserForm #up_email").val(data.email);
    //         $("#updateUserForm #up_password").val(data.password);
    //         $("#updateUserForm").data("id", data.id);
    //         $("#updateUserModal").modal("show");
    //     });
    // });

    // $("#updateUserForm").on("submit", function (e) {
    //     e.preventDefault();
    //     var id = $(this).data("id");
    //     var formData = new FormData(this);

    //     $.ajax({
    //         type: "POST",
    //         url: "/User/" + id,
    //         data: formData,
    //         contentType: false,
    //         processData: false,
    //         success: function (response) {
    //             $("#updateUserModal").modal("hide");
    //             UserTable.ajax.reload();
    //             toastr.success("User Updated Successfully!");
    //         },
    //         error: function (response) {
    //             if (response.responseJSON && response.responseJSON.errors) {
    //                 var errors = response.responseJSON.errors;
    //                 $.each(errors, function (key, value) {
    //                     toastr.error(value[0]);
    //                 });
    //             } else {
    //                 toastr.error(
    //                     "An error occurred while updating the User."
    //                 );
    //             }
    //         },
    //     });
    // });

    $(document).on("click", ".delete-user", function () {
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
                    url: "/User/" + id,
                    success: function (response) {
                        UserTable.ajax.reload();
                        toastr.success("User deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete User!");
                    },
                });
            }
        });
    });

})