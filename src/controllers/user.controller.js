const multer = require('multer');
const app = require('../config/app.config');
const {transErrors, transSuccess} = require("./../../lang/vi");
const { v4: uuidv4 } = require('uuid');
const {user} = require('../services');
const fsExtra = require('fs-extra');

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
                if(error.message) {
                    return res.status(500).send(transErrors.avatar_size);
                }
                return res.status(500).send(error);
            }
            try {
                let updateUserItem = {
                    avatar: req.file.filename,
                    updatedAt: Date.now()
                };
                // Update user
                let userUpdate = await user.updateUser(req.user._id, updateUserItem);
    
                // Không xóa avatar cũ của người dùng vì còn cần để sử dụng cho bảng messages
                await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
    
                let result = {
                    message: transSuccess.user_info_updated,
                    imageSrc: `/images/users/${req.file.filename}`
                };
                res.status(200).send(result);
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });

        
    }
}

module.exports = new UserController();