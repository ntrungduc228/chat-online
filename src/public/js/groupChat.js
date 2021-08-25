function addFriendsToGroup() {
    $('ul#group-chat-friends').find('div.add-user').bind('click', function() {
      let uid = $(this).data('uid');
      $(this).remove();
      let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();
  
      let promise = new Promise(function(resolve, reject) {
        $('ul#friends-added').append(html);
        $('#groupChatModal .list-user-added').show();
        resolve(true);
      });
      promise.then(function(success) {
        $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
      });
    });
  }
  
  function cancelCreateGroup() {
    $('#btn-cancel-group-chat').bind('click', function() {
      $('#groupChatModal .list-user-added').hide();
      if ($('ul#friends-added>li').length) {
        $('ul#friends-added>li').each(function(index) {
          $(this).remove();
        });
      }
    });
  }

function callSearchFriends(e) {
    if (e.which === 13 || e.type === "click") {
        let keyword = $("#input-search-friends-to-add-group-chat").val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
        if(!keyword.length){
            alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 7);
            return false;
        }

        if(!regexKeyword.test(keyword)){
            alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép chữ cái, số hay khoảng trống.", "error", 7);
            return false; 
        }
        
        $.get(`/contact/search-friends/${keyword}`, function(data) {
            $("ul#group-chat-friends").html(data);

            // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
            addFriendsToGroup();

            // Action hủy việc tạo nhóm trò chuyện
            cancelCreateGroup();
        });

    }
}

function callCreateGroupChat() {
    $("#btn-create-group-chat").unbind("click").on("click", function() {
      let countUsers = $("ul#friends-added").find("li");
      if(countUsers.length < 2){
        alertify.notify("Cần chọn tối thiểu 2 người để tạo nhóm", "error", 7);
        return false;
      }

      let groupChatName = $("#input-name-group-chat").val();
      if(groupChatName.length < 5 && groupChatName.length > 40){
        alertify.notify("Nhập tên cuộc trò chuyện, giới hạn từ 5 tới 30 kí tự", "error", 7);
        return false;
      }

      let arrayIds = [];
      $("ul#friends-added").find("li").each((index, item) => {
        arrayIds.push({"userId": $(item).data("uid")});
      });

      Swal.fire({
        title: `Bạn có chắc chắn muốn tạo nhóm &nbsp; ${groupChatName}`,
        text: "Bạn không thể hoàn tác quá trình này!",
        type: "info",
        width: "45rem",
        showCancelButton: true,
        confirmButtonColor: "#2ECC71",
        cancelButtonColor: "#ff7675",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy"
      }).then((result) => {
       if(!result.value) {
        return false;
       }
        $.post('/group-chat/add-new', {
          arrayIds,
          groupChatName,
        }, function(data) {
          console.log(data.groupChat);
        }).fail(function(response){
          alertify.notify(response.responseText, "error", 7);
        });
      });
    });
}

$(document).ready(function() {
    $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
    $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
    callCreateGroupChat();
});