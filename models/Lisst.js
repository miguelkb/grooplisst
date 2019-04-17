var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	text: String,
	checked: Boolean 
});

var lisstSchema = new mongoose.Schema({
	title: { type: String },
	usserId: { type: String },
	items: [itemSchema]
});

exports.LisstSchema = lisstSchema;