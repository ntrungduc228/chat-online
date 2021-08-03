

class HomeController{


    getHomePage(req, res, next) {
        res.render('main/components/home');
    }
}

module.exports = new HomeController();