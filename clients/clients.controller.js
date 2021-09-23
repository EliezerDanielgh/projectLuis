const express = require('express');
const router = express.Router();
const clientService = require('./clients.service');

const getAllClients = (req, res, next) => {
    clientService.getAllClients()
        .then(clients => res.json(clients))
        .catch(err => next(err));
};

const getClientById = (req, res, next) => {
    clientService.getClientById(req.params.id)
        .then(clients => res.json(clients))
        .catch(err => next(err));
};

const addClient = (req, res, next) => {
    clientService.addClient(req.body)
        .then(clients => res.json(clients))
        .catch(err => next(err));
};

const updateClient = (req, res, next) => {
    clientService.updateClient(req.params.id, req.body)
        .then(clients => res.json(clients))
        .catch(err => next(err));
};

const deleteClient = (req, res, next) => {
    clientService.deleteClient(req.params.id)
        .then(clients => res.json(clients))
        .catch(err => next(err));
};

router.get('/', getAllClients);
router.get('/:id', getClientById);
router.post('/', addClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;