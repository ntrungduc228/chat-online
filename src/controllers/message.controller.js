const { validationResult } = require('express-validator');
const { message } = require('../services');


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
}

module.exports = new MessageController();