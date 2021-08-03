class UserController {
    
    getProfile(req, res, next){
        res.render('layouts/profile');
    }
}

module.exports = new UserController();