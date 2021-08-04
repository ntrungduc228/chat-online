const { validationResult } = require('express-validator');

const User = require('../models/user.model');
const config = require('../config/auth.config');
const {auth} = require('../services/');

const {transSuccess} = require("../../lang/vi");


class AuthController {


    getSignUp(req, res, next) {
        res.render('auth/master', {
            errors: req.flash("errors"),
            success: req.flash("success")
        });
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

   // token is sent by mail
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
       req.logout(); // Remove session passport user
       req.flash("success", transSuccess.logout_success);
       return res.redirect("/login");
   }

   checkLoggedIn(req, res, next){
    if(!req.isAuthenticated()) {
      return res.redirect("/login"); 
    }
    next();
  };
  
  checkLoggedOut(req, res, next){
    if(req.isAuthenticated()) {
      return res.redirect("/"); 
    }
    next();
  };
   
}

module.exports = new AuthController();