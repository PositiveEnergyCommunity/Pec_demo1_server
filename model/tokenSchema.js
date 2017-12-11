// -----------------------------------------------------------------------------
// tokenSchema.js
// Dan DUONG - Postive Energy Community
// Creation 30/11/2017
//
// This file defines the mongoose schema for the tokens documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId; 

var TokenSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: false,						// to be changed later....
		required: false,
		trim: true
	},
	owner_Id:		{ type: ObjectId },	// contract owner = the pool, which emitted
	name: 			{ type: String, trim: true },
	description: 	{ type: String, trim: true },
	symbol:			{ type: String, trim: true };
	totalSupply:	{ type: Number },
	decimal:			{ type: Number };
	balanceOf :		{ type : Array , "default" : [] },
	allowance:		{ type: Array , "default" : [] }
}
		

TokenSchema.statics.getTokens = function (callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Token.find({}, function (err, tokensList) {
		if (err) {
			//console.log("[getTokenbyId] - err");
			return callback(err)
		} 
		else if (!tokensList) {
			//console.log("[getTokenbyId] - no user found");
			var err = new Error('Token not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getTokenbyId] - OK user found");
			return callback(null, tokensList);
		}
	})
}

TokenSchema.statics.getTokenbyId = function (tokenId, callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Token.findOne({ _id: ObjectId(userId) }, function (err, token) {
		if (err) {
			//console.log("[getTokenbyId] - err");
			return callback(err)
		} 
		else if (!token) {
			//console.log("[getTokenbyId] - no user found");
			var err = new Error('Token not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getTokenbyId] - OK user found");
			return callback(null, token);
		}
	})
}

		
var Token = mongoose.model('Token', TokenSchema);
module.exports = Token;