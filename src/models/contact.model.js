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
    createNew(item) {
        return this.create(item);
    }
}

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
