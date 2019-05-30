'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	user: Schema.Types.ObjectId,
	title: {
        type: String,
        required: true,
        trim: true
    },
	description: {
        type: String,
        required: true,
        trim: true
    },
	estimatedTime: String,
	materialsNeeded: String
});

var Course = mongoose.model("Course", CourseSchema);

module.exports.Course = Course;