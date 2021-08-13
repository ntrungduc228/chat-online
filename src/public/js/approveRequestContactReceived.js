function approveRequestContactReceived() {
    $(".user-approve-request-contact-received").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");

        $.ajax({
            url: "/contact/approve-request-contact-received",
            type: "put",
            data: {uid: targetId},
            success: function(data) {
                if(data.success) {    
                    
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
            
                    $(userInfo).find("div.contactPanel")
                    .append(`
                        <div class="user-talk" data-uid="${targetId}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${targetId}">
                            Xóa liên hệ
                        </div>
                    `);
            
                    let userInfoHTML = userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHTML);
                    $(userInfo).remove();
            
                    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotifiContacts.js
                    increaseNumberNotifContact("count-contacts");                // js/caculateNotifiContacts.js
                    decreaseNumberNotification("noti_contact_counter", 1);      // js/caculateNotification.js

                    removeContact();
                   // Sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat

                    socket.emit("approve-request-contact-received", {contactId: targetId});
                }
            }
        });
    });
};


socket.on("response-approve-request-contact-received", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
        <img class="avatar-small" src="images/users/${user.avatar} " alt=""> 
        <strong>${user.username} </strong> đã chấp nhận lời mời kết bạn của bạn!
    </div>`;

    $(".noti_content").prepend(notif);                        // popup notification
    $("ul.list-notifications").prepend(`<li>${notif}</li>`); // modal notification

    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
    increaseNumberNotification("noti_counter", 1); // js/caculateNotification.js

    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotifiContacts.js
    increaseNumberNotifContact("count-contacts");   // js/caculateNotifiContacts.js
    
    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();

    let userInfoHTML = `
        <li class="_contactList" data-uid="${user.id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${user.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                    ${user.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${user.address}</span>
                </div>
                <div class="user-talk" data-uid="${user.id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user.id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
    `;

    $("#contacts").find("ul").prepend(userInfoHTML);

    removeContact();
    // Sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat
    
});

$(document).ready(function() {
    approveRequestContactReceived();
});