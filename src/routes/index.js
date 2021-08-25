const authController = require('../controllers/auth.controller');
const homeController = require('../controllers/home.controller');
const userController = require('../controllers/user.controller');
const contactController = require('../controllers/contact.controller');
const notificationController = require('../controllers/notification.controller');
const messageController = require('../controllers/message.controller');


const passport = require('passport');
const initPassportLocal = require('../controllers/passport/local');
const initPassportFacebook = require('../controllers/passport/facebook');
const initPassportGoogle = require('../controllers/passport/google');

const {authValid, userValid, contactValid, messageValid} = require('../validation/');

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
    
    app.get('/contact/find-users/:keyword', 
        authController.checkLoggedIn, 
        contactValid.findUsersContact, 
        contactController.findUsersContact);
    app.post('/contact/add-new', authController.checkLoggedIn, contactController.addNew);
    app.delete('/contact/remove-contact', authController.checkLoggedIn, contactController.removeContact);
    
    app.delete('/contact/remove-request-contact-sent', 
        authController.checkLoggedIn, 
        contactController.removeRequestContactSent);
    app.delete("/contact/remove-request-contact-received", 
        authController.checkLoggedIn, 
        contactController.removeRequestContactReceived);
    app.put('/contact/approve-request-contact-received', 
        authController.checkLoggedIn, 
        contactController.approveRequestContactReceived);
    app.get('/contact/read-more-contacts', authController.checkLoggedIn, contactController.readMoreContacts);
    app.get('/contact/read-more-contacts-sent', authController.checkLoggedIn, contactController.readMoreContactsSent);
    app.get('/contact/read-more-contacts-received', authController.checkLoggedIn, contactController.readMoreContactsReceived);
    app.get('/contact/search-friends/:keyword', 
        authController.checkLoggedIn, 
        contactValid.searchFriends, 
        contactController.searchFriends);

    app.get('/notification/read-more', authController.checkLoggedIn, notificationController.readMore);
    app.put('/notification/mark-all-as-read', authController.checkLoggedIn, notificationController.markAllAsRead);

    app.post('/message/add-new-text-emoji', authController.checkLoggedIn, messageValid.checkMessageLength, messageController.addNewTextEmoji);
    app.post('/message/add-new-image', authController.checkLoggedIn, messageController.addNewImage);
    app.post('/message/add-new-attachment', authController.checkLoggedIn, messageController.addNewAttachment);
}

module.exports = routes;