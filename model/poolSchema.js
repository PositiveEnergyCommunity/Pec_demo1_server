// -----------------------------------------------------------------------------
// poolSchema.js
// Dan DUONG - Postive Energy Community
// Creation 27/11/2017
//
// This file defines the mongoose schema for the pool documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId; 

var PoolSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: false,						// to be changed later....
		required: false,
		trim: true
	},
	identity: {
		legalName:		 { type: String, trim: true },
		legalForm: 		 { type: String, trim: true },
		registrationNb: { type: String, trim: true },
		dateOfCreation: { type: Date },
		domiciliation:{
			street: 	 { type: String, trim: true },
			zipcode:  { type: String, trim: true },
			city: 	 { type: String, trim: true },
			province: { type: String, trim: true },
			country:  { type: String, trim: true }
		}
	},
	name: 			{ type: String, trim: true },
	description: 	{ type: String, trim: true },
	poolManager_Id:{ type: mongoose.Schema.Types.ObjectId },
	currency: 		{ type: String, trim: true },
	investValuation: { type: Number },			// in cureency
	cashAccount: 	{ type: Number },    
	tokens : 		{ type : Array , "default" : [] }
});
		

PoolSchema.statics.getPools = function (callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Pool.find({}, function (err, poolsList) {
		if (err) {
			//console.log("[getPoolbyId] - err");
			return callback(err)
		} 
		else if (!poolsList) {
			//console.log("[getPoolbyId] - no user found");
			var err = new Error('Pool not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getPoolbyId] - OK user found");
			return callback(null, poolsList);
		}
	})
}

PoolSchema.statics.getPoolbyId = function (poolId, callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Pool.findOne({ _id: ObjectId(userId) }, function (err, pool) {
		if (err) {
			//console.log("[getPoolbyId] - err");
			return callback(err)
		} 
		else if (!pool) {
			//console.log("[getPoolbyId] - no user found");
			var err = new Error('Pool not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getPoolbyId] - OK user found");
			return callback(null, pool);
		}
	})
}

		
var Pool = mongoose.model('Pool', PoolSchema);
module.exports = Pool;