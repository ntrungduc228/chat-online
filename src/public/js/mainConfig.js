/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */

const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat_${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // Gán giá trị thay đổi vào thẻ input đã bị ẩn
        $(`#write-chat_${divId}`).val(this.getText());
      },
      click: function() {
        // Bật lắng nghe DOM cho việc chat text và emoji 
        textAndEmojiChat(divId);

        // Bật chức năng người dùng đang gõ trò chuyện
        typingOn(divId);
      },
      blur: function(){
        // Tắt chức năng người dùng đang gõ trò chuyện
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function(){
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#", "");

    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`#${modalImagesId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImagesId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });

    // Bắt sự kiện đóng modal
    $(`#${modalImagesId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage);
    });
  });

}


function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if(notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("click", function(){
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    }else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat(){
  $(".room-chat").unbind("click").on("click", function(){
    let divId = $(this).find("li").data("chat");

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    // Cau hinh thanh cuon ben box chat rightSide.ejs moi khi click chuot vao 1 cuoc tro chuyen cu the
    nineScrollRight(divId);

    
    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);

    // Bật lắng nghe DOM cho việc chat tin nhắn hình ảnh
    imageChat(divId);

    // Bật lắng nghe DOM cho tệp tin đính kèm
    attachmentChat(divId);

    // Bật lắng nghe DOM cho cuộc goi video
    videoChat(divId);
  });
}

function convertEmoji(){
  $(".convert-emoji").each(function() {
        var original = $(this).html();
        var converted = emojione.toImage(original);
        $(this).html(converted);
    });
}

function bufferToBase64(buffer) {
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

// Zoom hình ảnh
function zoomImageChat() {
  $("show-image-chat").unbind("click").on("click", function() {
    $("#img-chat-modal").css("display", "block");
    $("#img-chat-modal-content").attr("src", $(this)[0].src);

    $("#img-chat-modal").on("click", function() {
      $(this).css("display", "none");
    });
  });
}

// Click trò chuyện với user
function userTalk() {
  $(".user-talk").unbind("click").on("click", function() {
    let dataChat = $(this).data("uid");
    $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest("div.modal").modal("hide");
  });
}

// Kiểm tra người dùng có bạn hay chưa?
function notYetConversations() {
  if(!$("ul.people").find("a").length) {
    Swal.fire({
      title: `Bạn chưa có bạn bè? Hãy tìm kiếm bạn bè để trò chuyện!`,
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "Xác nhận",
    }).then((result) => {
     $("#contactsModal").modal("show");
    });
  }
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn bên trái
  nineScrollLeft();


  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message o man hinh master
  flashMasterNotify();

  // Thay doi kieu tro chuyen
  changeTypeChat();

  // convert cac unicode thanh hinh anh cam xuc
  convertEmoji();

  // Thay doi man hinh chat
  changeScreenChat();

  // Click vào phần tử đầu tiên của cuộc trò chuyện khi load trang web
  if($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  }

  $("#video-chat-group").bind("click", function () {
    alertify.notify("Không khả dụng tính năng này với nhóm trò chuyện", "error", 7);
  });
});
