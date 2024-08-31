var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
	quantity: Number,
	price: Number,
	booker: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		}
	},
	full_name: String,
	username: String,
	address: String,
	city: String,
	flight: String,
	date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model("booking", bookingSchema);