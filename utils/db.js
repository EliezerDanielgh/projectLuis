const config = require('config.json');
const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    });
    mongoose.Promise = global.Promise;
} catch (err) {
    console.error(err);
}

//TODO: Define Models for Database
module.exports = {
    User: require('../users/users.model').User,
    Role: require('../users/users.model').Role,
    Category: require('../categories/categories.model').Category,
    Client: require('../clients/clients.model').Client,
    Task: require('../tasks/tasks.model').Task

}
