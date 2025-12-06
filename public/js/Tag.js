$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });


    var TagTable = $("#TagTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/Tag",
        columns: [
            { data: 'id', name: 'id' },
            { data: 'tag_text', name: 'tag_text' },
            { data: 'action', name: 'action', orderable: false, searchable: false },

        ]
    })

    $('#TagTable').on('click', '.view', function () {
        var id = $(this).data('id');

        $.ajax({
            url: '/Tag/' + id,
            type: 'GET',
            success: function (data) {
                $('#viewNameTag').text(data.tag_text);
                $('#viewTagModal').modal('show');
            },
            error: function () {
                toastr.error('Failed to fetch Tag details');
            }
        });
    });



    $("#addTagForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "/Tag",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                $("#addTagModal").modal("hide");
                $("#addTagForm")[0].reset();
                TagTable.ajax.reload();
                toastr.success("Tag added successfully");
            },
            error: function (res) {
                if (res.responseJSON && res.responseJSON.errors) {
                    var errors = res.responseJSON.errors;
                    $.each(errors, function (key, val) {
                        toastr.error(val[0]);
                    });
                } else {
                    toastr.error(
                        " An error occurred while Add the Tag"
                    );
                }
            },
        });
    });




    

    $(document).on("click", ".edit-Tag", function () {
        var id = $(this).data("id");
        $.get("/Tag/" + id + "/edit", function (data) {
            $("#updateTagForm #up_tag_text").val(data.tag_text);
            $("#updateTagForm").data("id", data.id);
            $("#updateTagModal").modal("show");
        });
    });

    $("#updateTagForm").on("submit", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        var formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "/Tag/" + id,
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#updateTagModal").modal("hide");
                TagTable.ajax.reload();
                toastr.success("Tag Updated Successfully!");
            },
            error: function (response) {
                if (response.responseJSON && response.responseJSON.errors) {
                    var errors = response.responseJSON.errors;
                    $.each(errors, function (key, value) {
                        toastr.error(value[0]);
                    });
                } else {
                    toastr.error(
                        "An error occurred while updating the Tag."
                    );
                }
            },
        });
    });

    $(document).on("click", ".delete-Tag", function () {
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
                    url: "/Tag/" + id,
                    success: function (response) {
                        TagTable.ajax.reload();
                        toastr.success("Tag deleted successfully!");
                    },
                    error: function (response) {
                        toastr.error("Failed to delete Tag!");
                    },
                });
            }
        });
    });

})