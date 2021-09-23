const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/users.service');

const isRevoked = async (req, payload, done) => {
    const user = await userService.getUserById(payload.sub);
    const route = req.originalUrl;
    let success = false;
    const exception = [
        //new RegExp('^/categories/{0,1}$')
    ];
    console.log(exception);
    if (!user) {
        return done(null, true);
    }

    // if (!user.role.canSuper) {
    //     exception.forEach((regex) => {
    //         console.log(regex,route,regex.test(route));
    //         if (regex.test(route)) {
    //             success = true;
    //         }
    //     });
    //     if (!success) {
    //         return done(null, true);
    //     }
    // }
    req.currentUser = user;
    done();
};

const jwt = (req,res,next) => {
    console.log(req)
    const secret = config.secret;
    return expressJwt({ secret, isRevoked, algorithms: ['HS256'] }).unless({
        path: [
            '/users/authenticate',
            '/users/logout',
            '/users/isLoggedIn',
            '/users/token'
        ]
    });
}

module.exports = jwt;