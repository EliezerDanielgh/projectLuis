const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Model Category
const modelCategory = new Schema({
    description: {
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
})

const Category = mongoose.model('Category', modelCategory);

module.exports = {
    Category: Category
}