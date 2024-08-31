var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	email: String,
	password: String,
	name: String,
	address: String,
	number: Number
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);