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