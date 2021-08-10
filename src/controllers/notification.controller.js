const {notification} = require('../services');

class NotificationController {
    async readMore(req, res, next){
        try{
            // get skip number from query param
            let skipNumber = +(req.query.skipNumber); // convert string to number

            // get new notifications
            let newNotifications = await notification.readMore(req.user._id, skipNumber);
            return res.status(200).send(newNotifications);
        }
        catch(error){
            res.status(500).send(error);
        }
    }


}

module.exports = new NotificationController();