const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    deletedAt: { type: Date, default: Date.now() },

},{
    timestamps: true
});

ContactSchema.statics = {
    createNew(item){
      return this.create(item);
    },
  
    /**
     * Find all items that related with user.
     * @param {string} userId 
     */
    findAllByUser(userId) {
      return this.find({
        $or: [
          {"userId": userId},
          {"contactId": userId},
        ]
      }).exec();
    },


    /**
     * Check exists relationship between both user 
     * @param {string} userId 
     * @param {string} contactId
     */
    checkExists(userId, contactId) {
      return this.findOne({
        $or: [
          {$and: [
            {"userId": userId},
            {"contactId": contactId},
          ]},
          {$and: [
            {"userId": contactId},
            {"contactId": userId},
          ]},
        ]
      }).exec();
    },

    /**
     * Remove request contact
     * @param {string} userId 
     * @param {string} contactId 
     */
    removeRequestContact(userId, contactId) {
      return this.deleteOne({
        $and: [
          {"userId": userId},
          {"contactId": contactId}
        ]
      }).exec();
    },

    /**
     * Get contacts by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
    getContacts(userId, limit) {
     return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true},
      ]
     }).sort({"createdAt": -1}).limit(limit).exec();
    },

    /**
     * Get contacts sent by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
     getContactsSent(userId, limit) {
      return this.find({
       $and: [
         {"userId": userId},
         {"status": false},
       ]
      }).sort({"createdAt": -1}).limit(limit).exec();
     },
 

    /**
     * Get contacts received by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */
     getContactsReceived(userId, limit) {
      return this.find({
       $and: [
         {"contactId": userId},
         {"status": false},
       ]
      }).sort({"createdAt": -1}).limit(limit).exec();
     },

     /**
     * Count all contacts by userId and limit
     * @param {string} userId 
     * @returns 
     */
    countAllGetContacts(userId) {
      return this.countDocuments({
       $and: [
         {$or: [
           {"userId": userId},
           {"contactId": userId}
         ]},
         {"status": true},
       ]
      }).exec();
     },
 
     /**
      * Count all contacts sent by userId and limit
      * @param {string} userId 
      * @returns 
      */
      countAllGetContactsSent(userId) {
       return this.countDocuments({
        $and: [
          {"userId": userId},
          {"status": false},
        ]
       }).exec();
      },
  
 
     /**
      * Count all contacts received by userId and limit
      * @param {string} userId 
      * @returns 
      */
      countAllGetContactsReceived(userId) {
       return this.countDocuments({
        $and: [
          {"contactId": userId},
          {"status": false},
        ]
       }).exec();
      },

       /**
       * Read more contacts by userId, skip, limit
       * @param {string} userId 
       * @param {number} skip 
       * @param {number} limit 
       */
      readMoreContacts(userId, skip, limit){
        return this.find({
          $and: [
            {$or: [
              {"userId": userId},
              {"contactId": userId}
            ]},
            {"status": true},
          ]
         }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
      },

      /**
       * Read more contacts receive by userId, skip, limit
       * @param {string} userId 
       * @param {number} skip 
       * @param {number} limit 
       */

      readMoreContactsSent(userId, skip, limit){
        return this.find({
          $and: [
            {"userId": userId},
            {"status": false}
          ]
         }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
      },
      
      /**
       * Read more contacts sent by userId, skip, limit
       * @param {string} userId 
       * @param {number} skip 
       * @param {number} limit 
       */
      readMoreContactsReceived(userId, skip, limit) {
        return this.find({
          $and: [
            {"contactId": userId},
            {"status": false}
          ]
        }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
      },
  };

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
