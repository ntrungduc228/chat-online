const multer = require('multer');
const app = require('../config/app.config');
const {transErrors, transSuccess} = require("./../../lang/vi");
const { v4: uuidv4 } = require('uuid');
const {user, contact} = require('../services');
const fsExtra = require('fs-extra');
const { validationResult } = require('express-validator');

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let math = app.avatar_type;
        if(math.indexOf(file.mimetype) === -1) {
            return callback(transErrors.avatar_type, null);
        }

        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
});

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: app.avatar_limit_size}
}).single("avatar");

class UserController {
    updateAvatar(req, res, next) {
        avatarUploadFile(req, res, async (error) => {
            if(error) {
              if (error.message) {
                return res.status(500).send(transErrors.avatar_size);
              } 
              return res.status(500).send(error);
            }
            try {
              let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
              };
              // update
              let userUpdate = await user.updateUser(req.user._id, updateUserItem);
        
              // Khong xoa avatar cu cua nguoi dung vi trong bang message can phai su dung
              //await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
        
              let result = {
                message: transSuccess.user_info_updated,
                imageSrc: `/images/users/${req.file.filename}`
              }
              return res.status(200).send(result);
            } catch (error) {
              console.log(error);
              return res.status(500).send(error);
        
            }
          });

        
    }

    async updateInfo(req, res, next) {

      let errorArray = [];
      let validationErrors = validationResult(req);

       if(!validationErrors.isEmpty()){
            let errors = Object.values(validationErrors.mapped());

            errors.forEach(item => {
                errorArray.push(item.msg);
            });

            return res.status(500).send(errorArray);
       }

      try{
        let updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);

        let result = {
            message: transSuccess.user_info_updated,
        };
        res.status(200).send(result);
      }
      catch(error){
        console.log(error);
        return res.status(500).send(error);
      }
    }

    async updatePassword(req, res, next) {

      let errorArray = [];

       let validationErrors = validationResult(req);
       if(!validationErrors.isEmpty()){
            let errors = Object.values(validationErrors.mapped());

            errors.forEach(item => {
                errorArray.push(item.msg);
            });

            return res.status(500).send(errorArray);
       }

      try{
        let updateUserItem = req.body;
        await user.updatePassword(req.user._id, updateUserItem);

        let result = {
          message: transSuccess.user_password_updated,
        }

        return res.status(200).send(result);
      }
      catch(error){
        return res.status(500).send(error);
      }
    }

}

module.exports = new UserController();