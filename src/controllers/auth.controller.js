const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const config = require('../config/auth.config');


class AuthController {

    getSignUp(req, res, next) {
        res.render('auth/master', {
            errors: req.flash("errors"),
        });
    }


    async login(req, res, next) {
        try{
            const user = await User.findOne({
                email: req.body.email,
                password: req.body.password,
            });
    
            if(user) {
                res.json({
                    message: 'dang nhap thanh cong'
                })
            }else {
                res.status(404).json({
                    message: 'user khong ton tai'
                })
            }
        }
        catch(err){
            res.json({
                err,
                message: 'co loi ben server'
            })
        }

    }

   postSignUp(req, res, next) {
       let errorArray = [];

       let validationErrors = validationResult(req);
       if(!validationErrors.isEmpty()){
            let errors = Object.values(validationErrors.mapped());

            errors.forEach(item => {
                errorArray.push(item.msg);
            });

            req.flash("errors", errorArray);
            return res.redirect("/signup");
       }
   }

   getLogOut(req, res, next){
       res.redirect('/');
   }

    forgotPassword(req, res, next) {
        res.render('auth/forgot-password');
    }

    resetPassword(req, res, next){
        res.render('auth/reset-password');
    }
}

module.exports = new AuthController();