const { validationResult } = require('express-validator');
const { message } = require('../services');
const multer = require('multer');
const app = require('../config/app.config');
const {transErrors, transSuccess} = require("./../../lang/vi");
const fsExtra = require('fs-extra');
const ejs = require('ejs');
const { lastItemOfArray, convertTimestampToHumanTime, bufferToBase64 } = require('../helpers/client');
const { promisify } = require("util");

// Make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

// handle image
let storageImageChat = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.image_message_directory);
    },
    filename: (req, file, callback) => {
        let math = app.image_message_type;
        if(math.indexOf(file.mimetype) === -1) {
            return callback(transErrors.image_message_type, null);
        }

        let imageName = `${file.originalname}`;
        callback(null, imageName);
    }
});

let imageMessageUploadFile = multer({
    storage: storageImageChat,
    limits: {fileSize: app.image_message_limit_size}
}).single("my-image-chat");


// handle file attachment
let storageAttachmentChat = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.attachment_message_directory);
    },
        filename: (req, file, callback) => {
        let attachmentName = `${file.originalname}`;
        callback(null, attachmentName);
    }
});

let attachmentMessageUploadFile = multer({
    storage: storageAttachmentChat,
    limits: {fileSize: app.attachment_message_limit_size}
}).single("my-attachment-chat");
class MessageController {

    async addNewTextEmoji(req, res, next) {
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
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar,
            };

            let receiverId = req.body.uid;
            let messageVal = req.body.messageVal;
            let isChatGroup = req.body.isChatGroup;

            let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
            return res.status(200).send({message: newMessage});
       }
       catch(error){
            return res.status(500).send
       }
    }

    addNewImage(req, res, next) {
        
        imageMessageUploadFile(req, res, async(error) => {
            if(error) {
                if (error.message) {
                  return res.status(500).send(transErrors.image_message_size);
                } 
                return res.status(500).send(error);
            }
            try{
                let sender = {
                    id: req.user._id,
                    name: req.user.username,
                    avatar: req.user.avatar,
                };
    
                let receiverId = req.body.uid;
                let messageVal = req.file;
                let isChatGroup = req.body.isChatGroup;
    
                let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);

                // Remove image, because this is image is save to mongodb
                await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);

                return res.status(200).send({message: newMessage});
           }
           catch(error){
                return res.status(500).send(error);
           }
            
        });
    }

    addNewAttachment(req, res, next) {
        
        attachmentMessageUploadFile(req, res, async(error) => {
            if(error) {
                if (error.message) { 
                  console.log(error.message);
                  return res.status(500).send(transErrors.attachment_message_size);
                } 
                return res.status(500).send(error);
            }
            try{
                let sender = {
                    id: req.user._id,
                    name: req.user.username,
                    avatar: req.user.avatar,
                };
    
                let receiverId = req.body.uid;
                let messageVal = req.file;
                let isChatGroup = req.body.isChatGroup;
    
                let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);

                // Remove attachment, because this is attachment is save to mongodb
                await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);

                return res.status(200).send({message: newMessage});
           }
           catch(error){
                return res.status(500).send(error);
           }
            
        });
    }
    
    async readMoreAllChat(req, res, next) {
        try{
            // get skip number from query param
            let skipPersonal = +(req.query.skipPersonal); // convert string to number
            let skipGroup = +(req.query.skipGroup); // convert string to number

            // get new notifications
            let newAllConversations = await message.readMoreAllChat(req.user._id, skipPersonal, skipGroup);
            
            let dataToRender = {
                newAllConversations,
                lastItemOfArray,
                convertTimestampToHumanTime,
                bufferToBase64,
                user: req.user,
            };

            let leftSideData = await renderFile("src/views/main/components/utils/_leftSide.ejs", dataToRender);
            let rightSideData = await renderFile("src/views/main/components/utils/_rightSide.ejs", dataToRender);
            let imageModalData = await renderFile("src/views/main/components/utils/_imageModal.ejs", dataToRender);
            let attachmentModalData = await renderFile("src/views/main/components/utils/_attachmentModal.ejs", dataToRender);

            res.status(200).send({
                leftSideData,
                rightSideData,
                imageModalData,
                attachmentModalData
            });
        }
        catch(error){
            res.status(500).send(error);
        }
    }

    async readMore(req, res, next) {
        try{
            // get skip number from query param
            let skipMessage = +(req.query.skipMessage); // convert string to number
            let targetId = req.query.targetId;
            let chatInGroup = (req.query.chatInGroup === "true"); 
            
            // get new notifications
            let newMessages = await message.readMore(req.user._id, skipMessage, targetId, chatInGroup);
            let dataToRender = {
                newMessages,
                bufferToBase64,
                user: req.user,
            };

            let rightSideData = await renderFile("src/views/main/components/readMoreMessages/_rightSide.ejs", dataToRender);
            let imageModalData = await renderFile("src/views/main/components/readMoreMessages/_imageModal.ejs", dataToRender);
            let attachmentModalData = await renderFile("src/views/main/components/readMoreMessages/_attachmentModal.ejs", dataToRender);

            res.status(200).send({
                rightSideData,
                imageModalData,
                attachmentModalData
            });
        }
        catch(error){
            res.status(500).send(error);
        }
    }
}

module.exports = new MessageController();