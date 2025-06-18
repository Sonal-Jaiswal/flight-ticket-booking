const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
	quantity: {
		type: Number,
		required: true,
		min: 1,
		max: 10
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
	booker: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	full_name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	flight: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Flight',
		required: true
	},
	status: {
		type: String,
		enum: ['confirmed', 'cancelled', 'pending'],
		default: 'confirmed'
	},
	bookingDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Booking", bookingSchema);