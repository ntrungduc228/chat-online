const {check} = require('express-validator');
const {transValidation} = require('../../lang/vi');

let addNewGroup = [
    check("arrayIds", transValidation.add_new_group_users_incorrect)
     .custom((value) => {
        if(!Array.isArray(value)) {
            return false;
        }

        if(value.length < 2) {
            return false;
        }
        return true;
     }),
     
     check("groupChatName", transValidation.add_new_group_name_incorrect)
     .isLength({min: 5, max: 40})
     .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

];


module.exports = {
    addNewGroup,
};