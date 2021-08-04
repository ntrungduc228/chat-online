let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callUpdateUserAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result) {
            console.log(result);
             // Display success
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            // Update avatar at navbar
            $("#navbar-avatar").attr("src", result.imageSrc);

            // Update avatar origin src
            originAvatarSrc = result.imageSrc;

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error) {
            console.log('error', error);
            // Display errors
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
    });
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function(result) {
             // Display success
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            // Update Origin user info
            originUserInfo = Object.assign(originUserInfo, userInfo);

            // Update username at navbar
            $("#navbar-username").text(originUserInfo.username);

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error) {
            // Display errors
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
    });
}


function updateUserInfo() {
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; // byte = 1MB

        // if($.inArray(fileData.type, math) === -1) {
        //     alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận png, jpg hay jpeg", "error", 7);
        //     $(this).val(null);
        //     return false;
        // }
        // if(fileData.size > limit) {
        //     alertify.notify("Ảnh upload tối đa cho phép là 1MB", "error", 7);
        //     $(this).val(null);
        //     return false;
        // }

        if(typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);

            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader", "error", 7);
        }
        
    });

    $("#input-change-username").bind("change", function() {
        let username = $(this).val();
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
            alertify.notify("Username giới hạn trong khoảng 3-17 ký tự, và không được có ký tự đặc biệt.", "error", 7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = username;
    });

    $("#input-change-gender-male").bind("click", function() {
        let gender = $(this).val();
        if (gender !== "male") {
            alertify.notify("Có phải bạn là giới tính thứ 3?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });

    $("#input-change-gender-female").bind("click", function() {
       let gender = $(this).val();
        if (gender !== "female") {
            alertify.notify("Có phải bạn là giới tính thứ 3?", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }

        userInfo.gender = gender;
    });

    $("#input-change-address").bind("change", function() {
        let address = $(this).val();

        if (address.length < 3 || address.length > 30) {
            alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 ký tự.", "error", 7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }

        userInfo.address = address;
    });

    $("#input-change-phone").bind("change", function() {
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

        if (!regexPhone.test(phone)) {
            alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn từ 10-11 ký tự.", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = phone;
    });

    $("#input-change-current-password").bind("change", function() {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Mat khau phai gom 8 ky tu, bao gom chu hoa, chu thuong, chu so va ky tu dac biet.", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }

        userUpdatePassword.currentPassword = currentPassword;
    });

    $("#input-change-new-password").bind("change", function() {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(newPassword)) {
            alertify.notify("Mật khẩu phải gồm 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }

        userUpdatePassword.newPassword = newPassword;
    });

    $("#input-change-confirm-new-password").bind("change", function() {
        let confirmNewPassword = $(this).val();

        if (!userUpdatePassword.newPassword) {
            alertify.notify("Bạn chưa nhập mật khẩu mới!", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }
        if (confirmNewPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Nhập lại mật khẩu không chính xác!", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        userUpdatePassword.confirmNewPassword = confirmNewPassword;
    });
}

$(document).ready(function() {

    originAvatarSrc = $("#user-modal-avatar").attr("src");

    // Update userInfo after change value to update
    updateUserInfo();

    $("#input-btn-update-user").bind("click", function() {
        console.log(userInfo);
        if($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu", "error", 7);
            return false;
        }
        if(userAvatar) {
            callUpdateUserAvatar();
        }
        if(!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo();
        }
    });

    $("#input-btn-cancel-update-user").bind("click", function() {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    });
});