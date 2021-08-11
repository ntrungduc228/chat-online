
function callFindUsers(e){
    if (e.which === 13 || e.type === "click") {
        let keyword = $("#input-find-users-contact").val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
        if(!keyword.length){
            alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 7);
            return false;
        }

        if(!regexKeyword.test(keyword)){
            alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép chữ cái, số hay khoảng trống.", "error", 7);
            return false; 
        }
        
        $.get(`/contact/find-users/${keyword}`, function(data) {
            // console.log('data', data);

            $("#find-user ul").html(data);
            addContact(); // js/addContact.js
            removeRequestContactSent(); //js/removeRequestContactSent.js

        });

    }
}

$(document).ready(function() {
    $("#input-find-users-contact").bind("keypress", callFindUsers);
    $("#btn-find-users-contact").bind("click", callFindUsers);
});