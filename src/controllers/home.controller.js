

class HomeController{


    getHomePage(req, res, next) {
        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
        });
    }
}

module.exports = new HomeController();