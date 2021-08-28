function readMoreMessages() {
    $(".right .chat").unbind("scroll").on("scroll", function() {

        // get the first message
        let firstMessage = $(this).find(".bubble:first");
        // get position of first message
        let currentOffset = firstMessage.offset().top - $(this).scrollTop();

        if($(this).scrollTop() === 0) {
            let messageLoading = '<img src="images/chat/message-loading.gif" class="message-loading"/>';
            $(this).prepend(messageLoading);

            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;
            
            let thisDom = $(this); 

            $.get(`message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
                if(data.rightSideData.trim() === '') {
                    alertify.notify("Đã xem hết toàn bộ tin nhắn", "error", 7);
                    thisDom.find("img.message-loading").remove();
                    return false;
                 }

                 // Step 1: handle rightSide
                 $(`.right .chat[data-chat = ${targetId}]`).prepend(data.rightSideData);

                 // Step 2: prevent scroll
                 $(`.right .chat[data-chat = ${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);

                 // Step 3: convert emoji
                 convertEmoji();
                 
                 // Step 4: handle image modal
                 $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                 // Step 5: call gridPhotos 
                 gridPhotos(5);

                 // Step 6: handle attachmentsModal
                 $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

                 // Step 7: remove message-loading
                 thisDom.find("img.message-loading").remove();
            });
        }
    });
}

$(document).ready(function () {
    readMoreMessages();
});