const UserModel = require('../models/user.model');

/**
 * Update userInfo
 * @param {userId} id 
 * @param {data update} item 
 */

 let updateUser = (id, item) => {
    return UserModel.updateUser(id, item);
};

module.exports = {
    updateUser: updateUser
};
