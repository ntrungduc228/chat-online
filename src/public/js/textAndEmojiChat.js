function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("click").on("keyup", function(element) {
        if(element.which == 13) {
            let targetId = $(`#write-chat_${divId}`).data("chat");
            let messageVal =  $(`#write-chat_${divId}`).val();

            if(!targetId.length || !messageVal.length){
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal,
            };

            if($(`#write-chat_${divId}`).hasClass('chat-in-group')){
                dataTextEmojiForSend.isChatGroup = true;
            }

            // Call api send message
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
                // success

            }).fail(function(response) {
                // error
            });
        }
    });
} 