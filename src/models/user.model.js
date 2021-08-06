const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const roles = ["user", "admin"];

// const UserSchema = new Schema({
//     // username:{
//     //     type: String,
//     //     required: true,
//     //     lowercase: true,
//     //     unique: true,
//     //     trim: true,
//     //     minLength: 6
//     // },
//     email: {
//         type: String,
//         required: [true, "Email is required"],
//         unique: true,
//         trim: true,
//         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 6
//     },
//     firstName: {
//         type: String,
//         required: true,
//         trim: true,
//         minLength: 2,
//     },
//     lastName: {
//         type: String,
//         required: true,
//         trim: true,
//         minLength: 2,
//     },
//     avatar:{
//         type: String,
//         default: '/css/default-avatar.png',
//         trim: true,
//     },
//     role: {
//         type: String,
//         enum: roles,
//         default: 'user',
//     },
//     state: {
//         online: {
//             type: Boolean,
//             default: false,
//         },
//         available: {
//             type: Boolean,
//             default: true,
//         },
//     },
//     contacts: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     }],
//     // dob: {
//     //     type: Date,
//     // },
//     // gender:{
//     //     type: Number,
//     //     default: 1,
//     // }
//     // phone:{
//     //     type: String,
//     // },
//     // last_login: {
//     //     type: Date,
//     // },
    
// },{
//     timestamps: true,
//     collection: "users",
// }
// );

const UserSchema = new Schema({
    username: { 
        type: String,
    },
    gender: { 
        type: String,
        default: "male",
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: "avatar-default.jpg"
    },
    role: {
        type: String,
        default: "user",
    },
    local: {
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        verifyToken: {
            type: String,
        }
    },
    facebook: {
        uid: String,
        token: String,
        email: {
            type: String,
            trim: true,
        },
    },
    google: {
        uid: String,
        token: String,
        email: {
            type: String,
            trim: true,
        },
    },
    deletedAt: { type: Date, default: Date.now() },

},{
    timestamps: true
});

UserSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    findByEmail(email) {
        return this.findOne({"local.email": email}).exec();
    },

    removeById(id) {
        return this.findByIdAndRemove(id).exec();
    },

    findByToken(token) {
        return this.findOne({"local.verifyToken": token}).exec();
    },

    verify(token) {
        return this.findOneAndUpdate(
          {"local.verifyToken": token},
          {"local.isActive": true, "local.verifyToken": null}
        ).exec();
    },

    findUserById(id) {
        return this.findById(id).exec();
    },
    
    findUserByIdForSessionToUse(id) {
        return this.findById(id, {"local.password": 0}).exec();
    },

    findByFacebookUid(uid) {
        return this.findOne({"facebook.uid": uid}).exec();
    },

    findByGoogleUid(uid) {
        return this.findOne({"google.uid": uid}).exec();
    },
    
    updateUser(id, item) {
        return this.findByIdAndUpdate(id, item).exec(); // Return old item after updated
    },

    updatePassword(id, hashedPassword){
        return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
    },
}

UserSchema.methods = {
    comparePassword(password) {
        // return a promise has result is true or false
        return bcrypt.compare(password, this.local.password); 
    }
}
const User = mongoose.model('User', UserSchema);

module.exports = User;
