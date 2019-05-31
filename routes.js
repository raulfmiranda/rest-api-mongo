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

// GET /api/users200
// Returns the currently authenticated user
router.get("/users200", mid.checkCredentials, function(req, res, next) {

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

            res.location('/');
            res.status(301);
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

    // var newCourses = [ "test" ];
    
    // Course.find({})
    //     .stream().on('data', function (course) {
    //         // console.log(course);
    //         if (course.user) {
    //             User.findById(course.user, function(err, user) {
    //                 if(err) return next(err);
    //                 if(!user) {
    //                     err = new Error("Not Found");
    //                     err.status = 404;
    //                     return next(err);
    //                 }
    //                 course.user = user;
    //                 console.log('push: ' + course.user._id);
    //                 newCourses.push(course);
    //             });
    //         }
    //     }).on('end', function() {
    //         console.log({ newCourses });
    //         res.json({ newCourses });
    //     });
});

// GET /api/courses/:id200
// Returns the course (including the user that owns the course) for the provided course ID
router.get("/courses/:id200", function(req, res, next) {

    Course.findOne({ _id: req.params.id200 })
        .exec(function(err, course) {
            if (err) return next(err);

            if (course.user) {
                User.findById(course.user, function(err, user) {
                    if(err) return next(err);
                    if(!user) {
                        err = new Error("Not Found");
                        err.status = 404;
                        return next(err);
                    }
                    course._doc.user = user;
                    res.json(course);
                    // res.json({ ...course._doc, user });
                });
            }
        });
});

// POST /api/courses201
// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses201", mid.checkCredentials, function(req, res, next) {

    if (req.body.title && req.body.description) {
        var course = new Course(req.body);
        course.save(function(err, course){
            if(err) return next(err);
            res.location('/api/courses/' + course._id);
            res.status(301);
            res.json({});
        });
    } else {
        var err = new Error('Title and description fields are required.');
        err.status = 400;
        return next(err);
    }
    
});

// PUT /api/courses/:id204
// Updates a course and returns no content
router.put("/courses/:id204", mid.checkCredentials, function(req, res, next) {

    if (req.body.title && req.body.description) { 
        req.course.update(req.body, function(err, result){
            if(err) return next(err);
            res.json({});
        });
    } else {
        var err = new Error('Title and description fields are required.');
        err.status = 400;
        return next(err);
    }
    
});

// DELETE /api/courses/:id204
// Deletes a course and returns no content
router.delete("/courses/:id204", mid.checkCredentials, function(req, res, next) {

    req.course.remove(function(err, result){
		if(err) return next(err);
        res.json({});
	});
});

module.exports = router;