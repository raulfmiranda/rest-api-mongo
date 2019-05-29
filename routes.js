'use strict';

var express = require("express");
var router = express.Router();
var User = require("./models").User;
var Course = require("./models").Course;

// GET /api/users200
// Returns the currently authenticated user
router.get("/users200", function(req, res, next) {

    User.findOne({})
        .exec(function(err, user) {
            if (err) return next(err);
            res.json(user);
        });
});

// POST /api/users201
// Creates a user, sets theLocationheader to "/", and returns no content
router.post("/users201", function(req, res, next) {
    res.json({
        message: "users201 - Creates a user, sets theLocationheader to '/', and returns no content",
    });
});

// GET /api/courses200
// Returns a list of courses (including the user that owns each course)
router.get("/courses200", function(req, res, next) {

    Course.find({})
        .exec(function(err, courses) {
            if (err) return next(err);
            res.json(courses);
        });
});

// GET /api/courses/:id200
// Returns a the course (including the user that owns the course) for the provided course ID
router.get("/courses/:id200", function(req, res, next) {

    Course.find({ _id: req.params.id200 })
        .exec(function(err, course) {
            if (err) return next(err);
            res.json(course);
        });
});

module.exports = router;