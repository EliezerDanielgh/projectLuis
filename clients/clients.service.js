const db = require('../utils/db');
const Client = db.Client;
const { ObjectId } = require('bson');

const getAllClients = async () => {
    return await Client.find({});
}

const getClientById = async (id) => {
    const client = await Client.findOne({ _id: ObjectId(id) });
    if (!client) {
        throw 'Client not found';
    }
    return await Client.findOne({ _id: ObjectId(id) });
}

const addClient = async (client) => {
    if (!('document' in client)) {
        throw 'Field document not defined';
    }
    if (!('shortName' in client)) {
        throw 'Field shortName not defined';
    }
    if (!('name' in client)) {
        throw 'Field name not defined';
    }
    if (!('phoneNumber' in client)) {
        throw 'Field phoneNumber not defined';
    }
    if (!('email' in client)) {
        throw 'Field email not defined';
    }

    const documentCode = client.document.trim().toLowerCase();
    if (
        await Client.findOne({ document: documentCode })
    ) {
        throw 'Client ' + documentCode + ' is already exist';
    }

    if (client?.document) {
        client.document = client.document.trim();
    }

    const newClient = new Client(client);

    await newClient.save((err) => {
        if (err) {
            throw err;
        }
    });

    return newClient;
}

const updateClient = async (id, client) => {
    const currentClient = await Client.findOne({ _id: ObjectId(id) });
    if (
        !(currentClient)
    ) {
        throw 'Client not found';
    }
    if (client.document) {
        client.document = client.document.trim().toLowerCase();
    }

    client.updatedDate = Date.now();

    Object.assign(currentClient, client);

    await currentClient.save((err) => {
        if (err) {
            throw err;
        }
    });
    return currentClient;
}

const deleteClient = async (id) => {
    const currentClient = await Client.findOne({ _id: ObjectId(id) });
    if (
        !(currentClient)
    ) {
        throw 'Client not found';
    }
    const response = await Client.deleteOne({ _id: ObjectId(id) });
    return response;

}

module.exports = {
    getAllClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient
}