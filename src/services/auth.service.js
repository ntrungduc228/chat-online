const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {transErrors, transSuccess} = require("./../../lang/vi");

let saltRounds = 7;

const register = (email, password, gender) => {
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
        resolve(transSuccess.userCreated(user.local.email));
    })
    
}

module.exports = {
    register,
}