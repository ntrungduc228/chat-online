const {notification, contact, message} = require('../services');
const {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} = require('../helpers/client');
const request = require('request');

function getICETurnServer() {
    return new Promise(async (resolve, reject) => {
        // Node Get ICE STUN and TURN list
        let o = {
            format: "urls"
        };

        let bodyString = JSON.stringify(o);
        let options = {
            url: "https://global.xirsys.net/_turn/awesome-chat",
            // host: "global.xirsys.net",
            // path: "/_turn/awesome-chat",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("ntrungduc:eff04ce4-0465-11ec-8eef-0242ac130003").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };

        // Cal request to get ICE list of turn server
        request(options, (err, response, body) => {
            if(err) {
                console.log("Error getting ICE list", err);
                return reject(err);
            }

            let bodyJson = JSON.parse(body);
            resolve(bodyJson.v.iceServers);
        });

        
    });
}
class HomeController{

    
    
    async getHomePage(req, res, next) {
        // Only 10 items one time
        let notifications = await notification.getNotifications(req.user._id);
        // Get amount notification unread
        let countNotifUnRead = await notification.countNotifUnRead(req.user._id);

        // Get contacts friend-list (10 item one time)
        let contacts = await contact.getContacts(req.user._id);
        // Get contacts sent (10 item one time)
        let contactsSent = await contact.getContactsSent(req.user._id);
        // Get contacts received (10 item one time)
        let contactsReceived = await contact.getContactsReceived(req.user._id);
        
        // Count Contacts
        let countAllContacts = await contact.countAllGetContacts(req.user._id);
        let countAllContactsSent = await contact.countAllGetContactsSent(req.user._id);
        let countAllContactsReceived = await contact.countAllGetContactsReceived(req.user._id);


        let getAllConversationItems = await message.getAllConversationItems(req.user._id);
        // All message with conversation max 30 items
        let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

        // get ICE list from xlrsys turn server 
        let iceServerList = await getICETurnServer();
        
        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            notifications: notifications,
            countNotifUnRead: countNotifUnRead,
            contacts: contacts,
            contactsSent: contactsSent,
            contactsReceived: contactsReceived,
            countAllContacts: countAllContacts,
            countAllContactsSent: countAllContactsSent,
            countAllContactsReceived: countAllContactsReceived,
            allConversationWithMessages: allConversationWithMessages,
            bufferToBase64: bufferToBase64,
            lastItemOfArray: lastItemOfArray,
            convertTimestampToHumanTime: convertTimestampToHumanTime,
            iceServerList: JSON.stringify(iceServerList),
        });
    }
}

module.exports = new HomeController();