const {notification} = require('../services');

class HomeController{
    
    async getHomePage(req, res, next) {
        // Only 10 items one time
        let notifications = await notification.getNotifications(req.user._id);
        // get amount notification unread
        let countNotifUnRead = await notification.countNotifUnRead(req.user._id);

        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            notifications: notifications,
            countNotifUnRead: countNotifUnRead,
        });
    }
}

module.exports = new HomeController();