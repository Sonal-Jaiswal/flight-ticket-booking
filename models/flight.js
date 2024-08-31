var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
	name: String,
	source: String,
	destination: String,
	duration: Number,
	ar_time: Number,
	dp_time: Number,
	price: Number,
	date: Date,
	airline: String	
});

module.exports = mongoose.model("flight", flightSchema);