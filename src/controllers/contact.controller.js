
const {contact} = require("../services");
const { validationResult } = require('express-validator');

class ContactController {
    async findUsersContact(req, res, next) {

       let errorArray = [];
       let validationErrors = validationResult(req);

       if(!validationErrors.isEmpty()){
            let errors = Object.values(validationErrors.mapped());

            errors.forEach(item => {
                errorArray.push(item.msg);
            });

            // console.log(errorArray);
            //return res.status(500).send(errorArray);
            return res.render('main/components/utils/alert', {errorArray});
       }

        try{
            let currentUserId = req.user._id;
            let keyword = req.params.keyword;

            let users = await contact.findUsersContact(currentUserId, keyword);
            return res.render("main/components/sections/_findUsersContact", {users});
        }
        catch(error) {
            return res.status(500).send(error);
        }
    }
}

module.exports = new ContactController();