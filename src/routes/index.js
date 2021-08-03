const authController = require('../controllers/auth.controller');

const userRouter = require('./user.router');
const homeRouter = require('./home.router');

const {authValid} = require('../validation/');

function routes(app){
    
    app.use('/me', userRouter);
    app.use('/', homeRouter);

    app.post('/login', authController.login);
    app.get('/signup', authController.getSignUp);
    app.post('/signup', authValid.register, authController.postSignUp);
    app.get('/logout', authController.getLogOut);
    app.get('/forgot-password', authController.forgotPassword);
    app.get('/reset-password', authController.resetPassword);

    
    app.get('/login', authController.getSignUp);
    
}

module.exports = routes;