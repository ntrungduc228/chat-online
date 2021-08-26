const _ = require('lodash');
const ChatGroupModel = require("../models/chatGroup.model");

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async (resolve, reject) => {
        try{
            // Add current userId to array members
            arrayMemberIds.unshift({userId: `${currentUserId}`});

            arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

            let newGroupChatItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: `${currentUserId}`,
                members: arrayMemberIds,
            };

            let newGroup = await ChatGroupModel.createNew(newGroupChatItem);
            resolve(newGroup);
        }
        catch(error) {
            reject(error);
        }
    });
};

module.exports = {
    addNewGroup,
}