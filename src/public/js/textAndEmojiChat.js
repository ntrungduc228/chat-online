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

                let dataToEmit = {
                    message: data.message,
                };

                // console.log(data);
                // handle message data to show
                let messageOfMe = $(`<div class="bubble me " data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                // convert emoji to img to show
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());

                if(dataTextEmojiForSend.isChatGroup){
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else {
                    
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" />`;
                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

                    dataToEmit.contactId = targetId;

                    //messageOfMe.html(convertEmojiMessage); 
                }

                $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // clear data at input tags
                $(`#write-chat_${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                // Update data preview & time on leftSide
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-realtime ").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // Move conversation to the top
                $(`.person[data-chat = ${divId}]`).on("ducnguyen.moveConversationToTheTop", function() {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("ducnguyen.moveConversationToTheTop");
                });
                $(`.person[data-chat = ${divId}]`).trigger("ducnguyen.moveConversationToTheTop");

                // Edit real time
                socket.emit('chat-text-emoji', dataToEmit);

            }).fail(function(response) {
                // error
                console.log(response);
                alertify.notify(response.responseText, "error", 7);
            });
        }
    });
}

$(document).ready(function() {
    socket.on('response-chat-text-emoji', function(response) {
        // console.log(response);
        let divId = "";

        let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        // convert emoji to img to show
        let convertEmojiMessage = emojione.toImage(messageOfYou.html());

        if(response.currentGroupId){
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

            divId = response.currentGroupId;

            if(response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")){
                increaseNumberMessageGroup(divId);
            }
        }else {
            
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" />`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

            divId = response.currentUserId;

        }

        if(response.currentUserId !== $(`#dropdown-navbar-user`).data("uid")){
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-realtime");
        }


        // clear data at input tags --> nothing to do at receiver message

        // Update data preview & time on leftSide
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        // Move conversation to the top
        $(`.person[data-chat = ${divId}]`).on("ducnguyen.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("ducnguyen.moveConversationToTheTop");
        });
        $(`.person[data-chat = ${divId}]`).trigger("ducnguyen.moveConversationToTheTop");
        // Edit real time - nothing to do here
    });
});