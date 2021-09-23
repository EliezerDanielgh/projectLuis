const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelTask = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    fields: [{
        type: String,
        name: String,
        value: Schema.Types.Mixed
    }],
    approved: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    answeredFor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    codeValidator: {
        type: String
    },
    qr: {
        type: String
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

const Task = mongoose.model('Task', modelTask);

module.exports = {
    Task
}