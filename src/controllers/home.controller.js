const {notification} = require('../services');

class HomeController{
    
    async getHomePage(req, res, next) {
        let notifications = await notification.getNotifications(req.user._id);

        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            notifications: notifications,
        });
    }
}

module.exports = new HomeController();