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
var company = require('../controllers/companyController');
var portfolio = require('../controllers/portfolioController');
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
			
			company.getCompanyById( user.company_Id, function (err, company) {
				if (err) {
					console.log("[getUser]- getCompanyById error = "+err.message);
					return callback(err, null);
				} 
				else {
					return callback(null, {type: true, user: user, company: company, token: token });
				};
			});
      };
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

		companyData = {
			identity: {
				legalName: data.company.identity.legalName,
				legalForm: data.company.identity.legalForm,
				registrationNb: data.company.identity.registrationNb,
				dateOfCreation: data.company.identity.dateOfCreation,
				domiciliation: {
					street: data.company.identity.domiciliation.street,
					zipcode: data.company.identity.domiciliation.zipcode,
					city: data.company.identity.domiciliation.city,
					province: data.company.identity.domiciliation.province,
					country: data.company.identity.domiciliation.country
				}
			},
			name: data.company.name,
			description: data.company.description,
			representative: data.company.representative,
			currency: data.company.currency
		}
		
		// Retrieve or create the company
		company.createCompany( companyData, function (err, companyDataResp) {
			if (err) {
				console.log("[createUser] Company - err.message = " + err.message);
				var error = new Error(err.message);
				error.status = 409;
				callback(error, null);
			} 
			else {
				console.log("[createUser] createCompany Success !!!");
				console.log("[createUser] company _id = "+companyDataResp._id);

				userData = {
					id: userId + 1,
					title: data.title,
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email, 
					password: data.password,
					phone: data.phone,
					userStatus: data.userStatus,
					company_Id: companyDataResp._id,
					portfolio_Id: null,
					profile: data.profile
				}
				
				console.log("[createUser]- " + userData.firstname + " " + userData.lastname);

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
								
								var portfolio = require('../controllers/portfolioController');
								
								portfolio.createPortfolio( user._id, function (err, portfolioData) {
									if (err) {
										console.log("[createUser] Portfolio - err.message = " + err.message);
										var error = new Error(err.message);
										error.status = 409;
										callback(error, null);
									} 
									else {
										console.log("[createUser] create Portfolio Success !!!");
										console.log("[createUser] portfolio _id = " + portfolioData._id);
								
									user.token = jwt.sign(user.toObject(), process.env.JWT_SECRET);
									user.portfolio_Id = portfolioData._id;
									user.save(function(err, user1) {
										return callback(null, {type: true, user: user1,token: user1.token });
										});
									};
								});
							};
						});
					};
				});
			};
		});
	}	
	else {
		var err = new Error('All fields required.');
		err.status = 400;
		return callback(err);
	};
};