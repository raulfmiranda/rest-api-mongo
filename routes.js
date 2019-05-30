'use strict';

var express = require("express");
var router = express.Router();
var User = require("./models/user").User;
var Course = require("./models/course").Course;
var mid = require('./middleware');

// Insert course (with id in parameter id204) inside request
router.param("id204", function(req, res, next, id){
	Course.findById(id, function(err, doc) {
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		req.course = doc;
		return next();
	});
});

// POST /login
router.post('/login', function(req, res, next) {
    if (req.body.emailAddress && req.body.password) {
        User.authenticate(req.body.emailAddress, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            }  else {
                req.session.currentUserId = user._id;
                return res.json({ message: "User authenticated" });
            }
        });
    } else {
        var err = new Error('Email and password are required.');
        err.status = 401;
        return next(err);
    }
});

// GET /api/users200
// Returns the currently authenticated user
router.get("/users200", function(req, res, next) {

    console.log({ session: req.session });
    console.log({ currentUserId: req.session.currentUserId });

    User.find({ _id: req.session.currentUserId })
        .exec(function(err, user) {
            if (err) return next(err);
            res.json(user);
        });
});

// POST /api/users201
// Creates a user, sets the Location header to "/", and returns no content
router.post("/users201", function(req, res, next) {

    if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
        var user = new User(req.body);
        user.save(function(err, user){
            if(err) return next(err);
            req.session.currentUserId = user._id;
            res.header("Location", "/");
            res.status(201);

            console.log({ session: req.session });
            console.log({ currentUserId: req.session.currentUserId });

            res.json({});
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }   
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

// POST /api/courses201
// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses201", function(req, res, next) {

    var course = new Course(req.body);
    course.save(function(err, course){
		if(err) return next(err);
		res.status(201);
		res.json(course);
    });
    
});

// PUT /api/courses/:id204
// Updates a course and returns no content
router.put("/courses/:id204", function(req, res, next) {

    req.course.update(req.body, function(err, result){
		if(err) return next(err);
		res.json(result);
	});
});

// DELETE /api/courses/:id204
// Deletes a course and returns no content
router.delete("/courses/:id204", function(req, res, next) {

    req.course.remove(function(err, result){
		if(err) return next(err);
        res.json(result);
	});
});

module.exports = router;