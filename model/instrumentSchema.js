// -----------------------------------------------------------------------------
// instrumentSchema.js
// Dan DUONG - Positive Energy Community
// Creation 27/11/2017
//
// This file defines the mongoose schema for the instrument documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

var InstrumentSchema = new mongoose.Schema({
	id: 				{ type: String, unique: false, required: true, trim: true },
	name: 			{ type: String, trim: true },
	description: 	{ type: String, trim: true },
	currency: 		{ type: String, trim: true },
	price: 			{ type: Number },			// in cureency
	supply:			{ type: Number }
});
		

InstrumentSchema.statics.getInstruments = function (callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Instrument.find({}, function (err, instrumentsList) {
		if (err) {
			//console.log("[getInstrumentbyId] - err");
			return callback(err)
		} 
		else if (!instrumentsList) {
			//console.log("[getInstrumentbyId] - no user found");
			var err = new Error('Instrument not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getInstrumentbyId] - OK user found");
			return callback(null, instrumentsList);
		}
	})
}

InstrumentSchema.statics.getInstrumentbyId = function (instrumentId, callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Instrument.findOne({ _id: ObjectId(userId) }, function (err, instrument) {
		if (err) {
			//console.log("[getInstrumentbyId] - err");
			return callback(err)
		} 
		else if (!instrument) {
			//console.log("[getInstrumentbyId] - no user found");
			var err = new Error('Instrument not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getInstrumentbyId] - OK user found");
			return callback(null, instrument);
		}
	})
}

		
var Instrument = mongoose.model('Instrument', InstrumentSchema);
module.exports = Instrument;