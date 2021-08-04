const authController = require('../controllers/auth.controller');
const homeController = require('../controllers/home.controller');


const passport = require('passport');
const initPassportLocal = require('../controllers/passport/local');
const initPassportFacebook = require('../controllers/passport/facebook');

const {authValid} = require('../validation/');

// Init all passport
initPassportLocal();
initPassportFacebook();

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
    
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ["email"]}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: "/",
        failureRedirect: "/login",
    }));

    app.get('/', authController.checkLoggedIn, homeController.getHomePage);
    app.get('/logout', authController.checkLoggedIn, authController.getLogOut);


    
}

module.exports = routes;