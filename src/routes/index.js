const authController = require('../controllers/auth.controller');
const homeController = require('../controllers/home.controller');
const userController = require('../controllers/user.controller');
const contactController = require('../controllers/contact.controller');
const notificationController = require('../controllers/notification.controller');



const passport = require('passport');
const initPassportLocal = require('../controllers/passport/local');
const initPassportFacebook = require('../controllers/passport/facebook');
const initPassportGoogle = require('../controllers/passport/google');

const {authValid, userValid, contactValid} = require('../validation/');

// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

function routes(app){
    

    app.post('/login',  authController.checkLoggedOut, passport.authenticate('local', { 
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));
    app.get('/login', authController.checkLoggedOut, authController.getSignUp);
    app.get('/signup',  authController.checkLoggedOut, authController.getSignUp);
    app.post('/signup', authValid.register, authController.postSignUp);
    app.get('/verify/:token',  authController.checkLoggedOut, authController.verifyAccount)
    
    app.get('/auth/facebook', authController.checkLoggedOut, passport.authenticate('facebook', {scope: ["email"]}));
    app.get('/auth/facebook/callback', authController.checkLoggedOut, passport.authenticate('facebook', {
        successRedirect: "/",
        failureRedirect: "/login",
    }));

    app.get('/auth/google', authController.checkLoggedOut, passport.authenticate('google', {scope: ["email"]}));
    app.get('/auth/google/callback', authController.checkLoggedOut, passport.authenticate('google', {
        successRedirect: "/",
        failureRedirect: "/login",
    }));

    app.get('/', authController.checkLoggedIn, homeController.getHomePage);
    app.get('/logout', authController.checkLoggedIn, authController.getLogOut);

    app.put('/user/update-avatar', authController.checkLoggedIn, userController.updateAvatar);
    app.put('/user/update-info', authController.checkLoggedIn, userValid.updateInfo, userController.updateInfo);
    app.put('/user/update-password', authController.checkLoggedIn, userValid.updatePassword, userController.updatePassword);
    
    app.get('/contact/find-users/:keyword', authController.checkLoggedIn, contactValid.findUsersContact, contactController.findUsersContact);
    app.post('/contact/add-new', authController.checkLoggedIn, contactController.addNew);
    app.delete('/contact/remove-request-contact', authController.checkLoggedIn, contactController.removeRequestContact);

    app.get('/notification/read-more', authController.checkLoggedIn, notificationController.readMore);
    app.put('/notification/mark-all-as-read', authController.checkLoggedIn, notificationController.markAllAsRead);

}

module.exports = routes;