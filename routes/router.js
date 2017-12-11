// -----------------------------------------------------------------------------
// router.js
// Dan DUONG - Postive Energy Community
// Creation 22/11/2017
//
// This file is the router file of the node server
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
var express = require('express');
var morgan = require("morgan");
var router = express.Router();
var Asset = require('../model/assetSchema');
var user = require('../controllers/userController');
var pool = require('../controllers/poolController');
var assert = require('assert');
var _ = require('lodash');

var assetId = 31000000;

// GET route for reading data
router.get('/', function(req, res, next) {
	console.log("GET / request");
	return res.send("working");
});



// -----------------------------------------------------------------------------
// POST /user : create a new user
//
router.post('/user', function (req, res, next) {
	console.log("[POST /user] - Begin");
	console.log("[POST /user] email = "+ req.body.email);
	
	var reqData = req.body;
	user.createUser ( reqData, function (err, userData) {
		if (err) {
			console.log("[POST /user]- err.message = " + err.message);
			var error = new Error(err.message);
			error.status = 409;
			return next(error)
		} 
		else {
			console.log("[POST /user]- Success !!!");
			console.log("[POST /user]- firstname = "+userData.user.firstname);
			res.status(201).json(userData);
		}
	});
});



// -----------------------------------------------------------------------------
// GET /user/login : login and get user token
//	
router.get('/user/login', function (req, res, next) {
	console.log("[GET /user/login] - Begin");
	
	console.log("[GET /user/login] - login = "+req.query.logemail);
	console.log("[GET /user/login] - password = "+req.query.logpassword);
	
	var reqData = req.query;
	user.loginUser ( reqData, function (err, userData) {
		if (err) {
			console.log("[GET /user/login]- err.message = " + err.message);
			var error = new Error(err.message);
			error.status = 409;
			return next(error)
		} 
		else {
			console.log("[GET /user/login]- Success !!!");
			console.log("[GET /user/login]- firstname = "+userData.user.firstname);
			res.status(201).json(userData);
		}
	});
});


// -----------------------------------------------------------------------------
// GET /user : 
//		Check token to authorize access,
//		Return user's info
//	
router.get('/user', ensureAuthorized, function(req, res) {
	console.log("[GET /user] - Begin");
	console.log("[GET /user] - Token = " + req.token);
	
	var reqData = req.token;
	user.getUser ( reqData, function (err, userData) {
		if (err) {
			console.log("[GET /user/login]- err.message = " + err.message);
			var error = new Error(err.message);
			error.status = 400;
			return next(error)
		} 
		else {
			console.log("[GET /user/login]- Success !!!");
			//console.log("[GET /user/login]- firstname = "+userData.user.firstname);
			res.status(200).json(userData);
		}
	});
});


// -----------------------------------------------------------------------------
// GET /pools route: Get all pool projects info
//
router.get('/pools', ensureAuthorized, function (req, res, next) {
	
	console.log("GET /pools");
	
	var userData;
	
	pool.getPools(function(err, userData) {
		if (err) {
			console.log("GET /pools error = "+ err);
			res.send(err);
		}
		
		console.log("GET /pools OK");
		res.json(userData);
	});
	
});


// -----------------------------------------------------------------------------
// POST /pool route: create a new pool project
//
router.post('/pool', ensureAuthorized, function (req, res, next) {
	console.log("[POST /pool] begin");

	console.log("[POST /pool] name = "+ req.body.name);
	
	var reqData = req.body;
	pool.createPool ( reqData, function (err, poolData) {
		if (err) {
			console.log("[POST /pool]- err.message = " + err.message);
			var error = new Error(err.message);
			error.status = 409;
			return next(error)
		} 
		else {
			console.log("[POST /pool]- Success !!!");
			res.status(201).json(poolData);
		}
	});
		
});



// -----------------------------------------------------------------------------
// GET /assets route: Get all asset projects info
//
router.get('/assets', ensureAuthorized, function (req, res, next) {
	
	console.log("GET /assets");
	
	var userData;
	
	Asset.getAssets(function(err, userData) {
		if (err) {
			console.log("GET /assets error = "+ err);
			res.send(err);
		}
		
		console.log("GET /assets OK");
		res.json(userData);
	});
	
});


// -----------------------------------------------------------------------------
// POST /asset route: create a new asset project
//
router.post('/asset', ensureAuthorized, function (req, res, next) {
	console.log("[POST /asset] begin");

	console.log("[POST /asset] name = "+ req.body.name);
	
	// Check that there is a least a name and location 
	if (req.body.name && req.body.address.country) {
		
		console.log("[POST /asset] country = "+ req.body.address.country);
			
		assetData = {
			id: assetId + 1,
			name: req.body.name,
			developer: req.body.developer,
			address:{
				street: req.body.address.street,
				zipcode: req.body.address.zipcode,
				city: req.body.address.city,
				province: req.body.address.province,
				country: req.body.address.country
			},
			currency: req.body.currency,
			dateOfCreation: req.body.dateOfCreation,
			dateOfCommission: req.body.dateOfCommission,
			lifeDuration: req.body.lifeDuration,
			energyType: req.body.energyType,
			installedCapacity: req.body.installedCapacity,
			projectCosts: {
				investmentCost: req.body.projectCosts.investmentCost,
				setupCost: req.body.projectCosts.setupCost,
				consultingCost: req.body.projectCosts.consultingCost
			},
			specificYield: req.body.specificYield,
			degression: req.body.degression,
			variableCosts: {
				insurance: req.body.variableCosts.insurance,
				security: req.body.variableCosts.security,
				technicalOps: req.body.variableCosts.technicalOps,
				salesOps: req.body.variableCosts.salesOps,
				maintenance: req.body.variableCosts.maintenance,
				lease: req.body.variableCosts.lease
			},
			fixedCosts: {
				generalAndAdmin: req.body.fixedCosts.generalAndAdmin,
				otherFixedCosts: req.body.fixedCosts.otherFixedCosts
			},
			projectFinancing: {
				equity: req.body.projectFinancing.equity,
				seniorLoan: req.body.projectFinancing.seniorLoan,
				juniorLoan: req.body.projectFinancing.juniorLoan
			},
			seniorLoan: {
				amount: req.body.seniorLoan.amount,
				duration: req.body.seniorLoan.duration,
				interestRate: req.body.seniorLoan.interestRate
			},
			juniorLoan: {
				amount: req.body.juniorLoan.amount,
				duration: req.body.juniorLoan.duration,
				interestRate: req.body.juniorLoan.interestRate
			},
		};
		
		console.log("[POST /asset]- Create" + assetData.name);

		//use schema.create to insert data into the db
		Asset.create( assetData, function (err, user) {
			if (err) {
				//console.log("[POST /asset]- err.message = " + err.message);
				var error = new Error(err.message);
				error.status = 409;
				return next(error)
			} else {
				console.log("[POST /asset]- Success !!!");
				res.status(201).json(assetData);
			}
		});
	}
	else {
		var err = new Error('Name and country required.');
		err.status = 400;
		return next(err);
	}
});


// -----------------------------------------------------------------------------
// ensureAuthorized()
//		Authorize access through JWT Token
//
function ensureAuthorized(req, res, next) {
	console.log("[ensureAuthorized] - begin");
   var bearerToken;
   var bearerHeader = req.headers["authorization"];
   if (typeof bearerHeader !== 'undefined') {
		console.log("[ensureAuthorized] - go on");
      var bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];
      req.token = bearerToken;
      next();
   } else {
		console.log("[ensureAuthorized] - err access forbidden");
		var err = new Error('Access forbidden');
		err.status = 403;
		return next(err);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});


module.exports = router; 