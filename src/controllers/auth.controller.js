const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const config = require('../config/auth.config');
const {auth} = require('../services/');


class AuthController {

    getSignUp(req, res, next) {
        res.render('auth/master', {
            errors: req.flash("errors"),
            success: req.flash("success")
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

   async postSignUp(req, res, next) {
       let errorArray = [];
       let successArray = [];

       let validationErrors = validationResult(req);
       if(!validationErrors.isEmpty()){
            let errors = Object.values(validationErrors.mapped());

            errors.forEach(item => {
                errorArray.push(item.msg);
            });

            req.flash("errors", errorArray);
            return res.redirect("/signup");
       }

       try{
        let createUserSuccess =  await auth.register(req.body.email, req.body.password, req.body.gender, req.protocol, req.get("host"));

         successArray.push(createUserSuccess);
         req.flash("success", successArray);
         return res.redirect("/signup");
       }
       catch(error){
        errorArray.push(error); console.log(error);
        req.flash("errors", errorArray);
            return res.redirect("/signup"); 
       }

   }

   async verifyAccount(req, res, next){
    let errorArr = [];
    let successArr = [];
    try {
      let verifySuccess = await auth.verifyAccount(req.params.token);
      successArr.push(verifySuccess);
  
      req.flash("success", successArr);
      return res.redirect("/login"); 
    } catch (error) {
      errorArr.push(error);
      req.flash("errors", errorArr);
      return res.redirect("/signup"); 
    }
  };

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