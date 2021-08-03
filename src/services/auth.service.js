const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {transErrors, transSuccess, transMail} = require("./../../lang/vi");
const sendMail = require('../config/mailer.config');

let saltRounds = 7;

const register = (email, password, gender, protocol, host) => {
    return new Promise( async (resolve, reject) => {
        let userByEmail = await UserModel.findByEmail(email);

        if(userByEmail) {
            if(userByEmail.deletedAt != null) {
                return reject(transErrors.account_removed);
            }
            if(!userByEmail.local.isActive) {
                return reject(transErrors.account_not_active);
            }
            return reject(transErrors.account_in_use);
        }

        let salt = bcrypt.genSaltSync(saltRounds);

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        };

        let user = await UserModel.createNew(userItem);
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`; 
        // Send email
        sendMail(email, transMail.subject, transMail.template(linkVerify))
        .then(success => {
            resolve(transSuccess.userCreated(user.local.email));
        })
        .catch(async (error) => {
            //remove user
            await UserModel.removeById(user._id);
            console.log(error);
            reject(transMail.send_failed);
        });
    })
    
}

let verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
        let userByToken = await UserModel.findByToken(token);
        if(!userByToken) {
            return reject(transErrors.token_undefine);
        }

        await UserModel.verify(token);
        resolve(transSuccess.account_actived);
    });
};


module.exports = {
    register,
    verifyAccount
}