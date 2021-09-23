const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Model Client
const modelClient = new Schema({
    document: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Client = mongoose.model('Client', modelClient);

module.exports = {
    Client: Client
}