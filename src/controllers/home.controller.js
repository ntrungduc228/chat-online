

class HomeController{


    getHomePage(req, res, next) {
        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success")
        });
    }
}

module.exports = new HomeController();