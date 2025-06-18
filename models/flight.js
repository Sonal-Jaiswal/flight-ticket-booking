const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	source: {
		type: String,
		required: true
	},
	destination: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true,
		min: 1
	},
	ar_time: {
		type: Number,
		required: true,
		min: 0,
		max: 23
	},
	dp_time: {
		type: Number,
		required: true,
		min: 0,
		max: 23
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
	date: {
		type: Date,
		required: true
	},
	airline: {
		type: String,
		required: true
	},
	seats: {
		type: Number,
		default: 100,
		min: 0
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Flight", flightSchema);