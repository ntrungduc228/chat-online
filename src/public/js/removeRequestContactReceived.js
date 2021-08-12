function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: {uid: targetId},
            success: function(data) {
                if(data.success) {    
                    // Chức năng chưa muốn làm  
                    // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //popup notification
                    // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); //modal notification              
                    // decreaseNumberNotification("noti_counter", 1); // js/calculateNotification.js
                    decreaseNumberNotification("noti_contact_counter", 1); // js/calculateNotification.js

                    decreaseNumberNotifContact("count-request-contact-received"); // js/calculateNotifiContact.js
                    
                    // Remove at the modal tab ask add friends
                    $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {contactId: targetId});
                }
            }
        });
    });
};


socket.on("response-remove-request-contact-received", function(user) {
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    // Remove at the modal tab waiting for confirm
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifContact("count-request-contact-sent");

    decreaseNumberNotification("noti_contact_counter", 1); // js/calculateNotification.js    
});

$(document).ready(function() {
    removeRequestContactReceived();
});