function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function(element) {
        let currentEmojioneArea = $(this);
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
                // console.log(data);
                // handle message data to show
                let messageOfMe = $(` <div class="bubble me class="avatar-small" id="${data.message._id}"> </div>`);
                if(dataTextEmojiForSend.isChatGroup){
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}`);
                    messageOfMe.text(data.message.text);
                    increaseNumberMessageGroup(divId);
                }else {
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}`);
                    messageOfMe.text(data.message.text);
                }

                // convert emoji to img to show
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());
                messageOfMe.html(convertEmojiMessage); 

                $(`.chat[data-chat = ${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // clear data at input tags
                $(`#write-chat_${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                // Update data preview & time on leftSide
                $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // Move conversation to the top
                $(`.person[data-chat = ${divId}]`).on("click.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTheTop");
                });

                $(`.person[data-chat = ${divId}]`).click();

                // Edit real time

            }).fail(function(response) {
                // error
                console.log(response);
                alertify.notify(response.responseText, "error", 7);
            });
        }
    });
} 