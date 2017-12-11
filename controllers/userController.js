// -----------------------------------------------------------------------------
// userController.js
// Dan DUONG - Postive Energy Community
// Creation 07/12/2017
//
// This file is the user object controller
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
var User = require('../model/userSchema');
var jwt  = require("jsonwebtoken");
var userId = 23000000;


// -----------------------------------------------------------------------------
// GET /user/login : login and get user token
//
exports.loginUser = function (data, callback) {
	console.log("[loginUser] begin");
	
	if (data.logemail && data.logpassword) {
		console.log("[loginUser] - email = "+ data.logemail);
		console.log("[loginUser] - password = "+ data.logpassword);
		User.authenticate(data.logemail, data.logpassword, function (error, user) {
			if (error || !user) {
				console.log("[loginUser] - error Wrong email or password.");
				var err = new Error('Wrong email or password.');
				err.status = 401
				callback(err, null);
			} 
			else {
				console.log("[loginUser]- Success !!!");
				console.log("[loginUser] - Token = " + user.token);
				return callback(null, {type: true, user: user,token: user.token });
			}
		});
	} 
	else {
		console.log("[loginUser]- error All fields required.");
		var err = new Error('All fields required.');
		err.status = 400;
		callback(err, null);
	};
};


// -----------------------------------------------------------------------------
// GET /user : 
//		Check token to authorize access,
//		Return user's info
//
exports.getUser = function (token, callback) {
	console.log("[getUser] begin");
	
   User.findOne({token: token}, function(err, user) {
      if (err) {
			console.log("[getUser]- error = ");
			var err = new Error('All fields required.'+ err.status);
			callback(err, null);
      } 
		else {
			console.log("[getUser] success");
			//console.log("[getUser] success email = "+ user.email);
			return callback(null, {type: true, user: user,token: token });
      }
   });
};


// -----------------------------------------------------------------------------
// POST /user route: create a new user
//
exports.createUser = function (data, callback) {
	console.log("[createUser] begin");
	console.log("[createUser] email = "+ data.email);
	
	// confirm that user typed same password twice
	if (data.password !== data.passwordConf) {
		console.log("[createUser]- Error passwords dont match");
		var err = new Error('Error passwords dont match');
		err.status = 401;
		callback(err, null);
	}

	if (data.email && data.firstname && data.lastname
	&& data.password) {
		
		userData = {
			id: userId + 1,
			title: data.title,
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email, 
			password: data.password,
			phone: data.phone,
			userStatus: data.userStatus,
		}
		
		console.log("[createUser]- " + userData.firstname 
		+ " " + userData.lastname);

		User.encrypt( userData, function (err) {
			if (err) {
			return callback(err);
			}
			else {
				//use schema.create to insert data into the db
				User.create( userData, function (err, user) {
					if (err) {
						console.log("[createUser]- err.message = " + err.message);
						var error = new Error(err.message);
						error.status = 409;
						return callback(error);
					} else {
						console.log("[createUser]- Success !!!");
						user.token = jwt.sign(user.toObject(), process.env.JWT_SECRET);
						user.save(function(err, user1) {
							return callback(null, {type: true, user: user1,token: user1.token });
						});
					}
				});
			};
		});
	}
	else {
		var err = new Error('All fields required.');
		err.status = 400;
		return callback(err);
	}
};