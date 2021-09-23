const express = require('express');
const router = express.Router();
const taskService = require('./tasks.service');
const routeImages = '/images/tasks/';

const getAllTasks = (req, res, next) => {
    taskService.getAllTasks(req.query, req.currentUser)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const getTaskById = (req, res, next) => {
    taskService.getTaskById(req.params.id)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const getTaskByUser = (req, res, next) => {
    taskService.getTaskByUser({
        id: req.params.id,
        role: {
            canSuper: false
        }
    }, req.query)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const imageTask = (req, res, next) => {
    const route = process.cwd() + routeImages + req.params.image
    res.sendFile(route);
}

const addTask = (req, res, next) => {
    taskService.addTask(req.body, req.currentUser)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const approvedTask = (req, res, next) => {
    taskService.approvedTask(req.params.id, req.currentUser, true)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const rejectTask = (req, res, next) => {
    taskService.approvedTask(req.params.id, req.currentUser, false)
        .then(task => res.json(task))
        .catch(err => next(err));
}

const testTask = (req, res, next) => {
    taskService.testQr(req.body.message)
        .then(task => res.json(task))
        .catch(err => next(err));
}

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.get('/user/:id', getTaskByUser);
router.get('/image/:image', imageTask);
router.post('/', addTask);
router.post('/approved/:id', approvedTask);
router.post('/reject/:id', rejectTask);




module.exports = router;