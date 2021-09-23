const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const jwt = require("jsonwebtoken");
const config = require("config.json");

//TODO: Routes for Role
const getAllRoles = (req, res, next) => {
    userService.getAllRoles()
        .then(roles => res.json(roles))
        .catch(err => next(err));
}

const getRoleById = (req, res, next) => {
    userService.getRoleById(req.params.id)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const addRole = (req, res, next) => {
    userService.addRole(req.body)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const updateRole = (req, res, next) => {
    userService.updateRole(req.params.id, req.body)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const deleteRole = (req, res, next) => {
    userService.deleteRole(req.params.id)
        .then(role => res.json(role))
        .catch(err => next(err));
}

const assingRoleAproven = (req, res, next) => {
    console.log('hello')
    userService.assingRoleAproven(req.params.id, req.body)
        .then(role => res.json(role))
        .catch(err => next(err));
}


const getAssignmentRoleAproven = (req, res, next) => {
    userService.getAssignmentRoleAproven(req.params.id)
        .then(permits => res.json(permits))
        .catch(err => next(err));
}

//TODO: Routes for User
const getCurrentUser = (req, res, next) => {
    res.json(req.currentUser)
}

const getAllUsers = (req, res, next) => {
    userService.getAllUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}

const getUserById = (req, res, next) => {
    userService.getUserById(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const getUserByUsername = (req, res, next) => {
    userService.getUserByUsername(req.params.user)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const getAssignmentUserAproven = (req, res, next) => {
    userService.getAssignmentUserAproven(req.params.id)
        .then(permits => res.json(permits))
        .catch(err => next(err));
}

const addUser = (req, res, next) => {
    userService.addUser(req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const updateUser = (req, res, next) => {
    userService.updateUser(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const deleteUser = (req, res, next) => {
    userService.deleteUser(req.params.id)
        .then(user => res.json(user))
        .catch(err => next(err));
}

const assingUserAproven = (req, res, next) => {
    console.log('hello')
    userService.assingUserAproven(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

//TODO: Routes for Use Token Service

const authenticate = (req, res, next) => {
    userService.isLoggedIn(req.body)
        .then((loggedIn) => {
            if (loggedIn) {
                res.status(400).json({
                    message: 'Este Usuario ya posee sesion activa'
                });
            } else {
                userService.authenticate(req.body)
                    .then((user) => user ? res.json(user) : res.status(400).json({
                        message: 'Username or password is incorrect'
                    }))
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
}

const isTokenExpired = (req, res, next) => {
    try {
        const isValid = jwt.verify(req.body.token, config.secret);
        res.json({ isValid: true });
    } catch (error) {
        res.json({ isValid: false });
    }
}

const refreshTokens = (req, res, next) => {
    userService.gNewTokenAcces(req.body.username, req.body.tokenRefresh)
        .then((newTokenAcces) => {
            if (newTokenAcces !== 'User Not Found' && newTokenAcces !== 'User Not Authorized') {
                res.json(newTokenAcces);
            } else if (newTokenAcces === 'User Not Found') {
                res.status(400).json({
                    message: newTokenAcces
                });
            } else {
                res.status(401).json({
                    message: newTokenAcces
                });
            }
        })
        .catch((err) => next(err));
}

const logout = (req, res, next) => {
    userService.logout(req.params.id)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

router.get('/roles/', getAllRoles);
router.get('/roles/:id', getRoleById);
router.get('/roles/permits/:id', getAssignmentRoleAproven);

router.post('/roles/', addRole);
router.post('/roles/:id/canApproven', assingRoleAproven);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

router.get('/users/current/', getCurrentUser);
router.get('/users/', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/permits/:id', getAssignmentUserAproven);
router.get('/users/match/:user', getUserByUsername);
router.post('/users/', addUser);
router.post('/users/:id/canApproven', assingUserAproven);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/authenticate', authenticate);
router.post('/token', refreshTokens);
router.post('/isTokenExpired', isTokenExpired);
router.post('/logout/:id', logout);

module.exports = router;