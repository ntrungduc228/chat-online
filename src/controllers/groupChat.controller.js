const { validationResult } = require('express-validator');
const { groupChat } = require('../services');

class GroupChatController {
    async addNewGroup(req, res, next) {
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
        let currentUserId = req.user._id;
        let arrayMemberIds = req.body.arrayIds;
        let groupChatName = req.body.groupChatName;

        let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
        return res.status(200).send({groupChat: newGroupChat});
       }
       catch(error){
           return res.status(500).send(error);
       }
    }
}   

module.exports = new GroupChatController();