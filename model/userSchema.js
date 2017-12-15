// -----------------------------------------------------------------------------
// userSchema.js
// Dan DUONG - Postive Energy Community
// Creation 22/11/2017
//
// This file defines the mongoose schema for the users documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId; 


var UserSchema = new mongoose.Schema({
	id: { type: String, unique: false, required: false, trim: true	},
	title: 		{ type: String, trim: true },
	firstname: 	{ type: String, trim: true },
	lastname: 	{ type: String, trim: true },
	email: 		{ type: String, required: true, trim: true },
	password: 	{ type: String, required: true, trim: true },
	phone: 		{ type: String, trim: true },
	userstatus: { type: String, trim: true },
	company_Id:	{ type: mongoose.Schema.Types.ObjectId },
	portfolio_Id:	{ type: mongoose.Schema.Types.ObjectId },
	profile: 	{ type: String, trim: true },
	token: String
});


//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
	console.log("[authenticate] - begin");
	User.findOne({ email: email }, function (err, user) {
			if (err) {
				console.log("[authenticate] - err");
				return callback(err)
			} 
			else if (!user) {
				console.log("[authenticate] - user not found");
				var err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			console.log("[authenticate] - user found");
			bcrypt.compare(password, user.password, function (err, result) {
				if (result === true) {
					user.password = null;			// don't send password hash
					return callback(null, user);
				} 
				else {
					return callback();
				}
			})
		}
	);
}

/*
//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
	var user = this;
	console.log("[UserSchema.pre] - password = " + user.password);
	bcrypt.hash(user.password, 10, function (err, hash){
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});*/

//hashing a password before saving it to the database
UserSchema.statics.encrypt = function(user, callback) {
	console.log("[encrypt] - password = " + user.password);
	bcrypt.hash(user.password, 10, function (err, hash){
		if (err) {
			console.log("[encrypt] - err");
			return callback(err);
		}
		console.log("[encrypt] - ok");
		user.password = hash;
		callback();
	});
}
		

UserSchema.statics.getUserbyId = function (userId, callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	User.findOne({ _id: ObjectId(userId) }, function (err, user) {
		if (err) {
			//console.log("[getUserbyId] - err");
			return callback(err)
		} 
		else if (!user) {
			//console.log("[getUserbyId] - no user found");
			var err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getUserbyId] - OK user found");
			return callback(null, user);
		}
	})
}

		
var User = mongoose.model('User', UserSchema);
module.exports = User;