var User = require("../models/user").User;
var auth = require('basic-auth');

function checkCredentials(req, res, next) {
    
    var credentials = auth(req);
    
    if (credentials && credentials.name && credentials.pass) {
        User.authenticate(credentials.name, credentials.pass, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            }  else {
                req.session.currentUserId = user._id;
                // return res.json({ message: "User authenticated" });
                return next();
            }
        });
    } else {
        var err = new Error('Email and password are required in Authorization header (Basic Auth).');
        err.status = 401;
        return next(err);
    }
}

function emailValidation(req, res, next) {
    
    if (req.body && req.body.emailAddress) {

        var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.emailAddress);

        if (isEmailValid) {

            let countUsers = User.find({ emailAddress: req.body.emailAddress }).count();
            if(countUsers == 0) {
                return next();            
            }
            let err = new Error('E-mail is already registed.');
            err.status = 401;
            return next(err);

        }  else {
            let err = new Error('Invalid email format.');
            err.status = 401;
            return next(err);
        }
    } else {
        let err = new Error('Email is required.');
        err.status = 401;
        return next(err);
    }
}

function userCourseOwner(req, res, next) {

    let currentUserId = JSON.stringify(req.session.currentUserId);
    let courseUser = JSON.stringify(req.session.currentUserId);

    if (currentUserId == courseUser) {
        return next();
    } else {
        let err = new Error('Current user is not the owner of this course.');
        err.status = 403;
        return next(err);
    }
}

// function requiresLogin(req, res, next) {
//     if (req.session && req.session.currentUserId) {
//         return next();
//     } else {
//         var err = new Error('You must be logged in to view this page.');
//         err.status = 401;
//         return next(err);
//     }
// }

module.exports.checkCredentials = checkCredentials;
module.exports.emailValidation = emailValidation;
module.exports.userCourseOwner = userCourseOwner;