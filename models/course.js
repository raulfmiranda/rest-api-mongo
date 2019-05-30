'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	user: Schema.Types.ObjectId,
	title: String,
	description: String,
	estimatedTime: String,
	materialsNeeded: String
});

var Course = mongoose.model("Course", CourseSchema);

module.exports.Course = Course;