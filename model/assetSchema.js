// -----------------------------------------------------------------------------
// assetSchema.js
// Dan DUONG - Postive Energy Community
// Creation 27/11/2017
//
// This file defines the mongoose schema for the asset documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = require('mongoose').Types.ObjectId; 

var AssetSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: false,						// to be changed later....
		required: false,
		trim: true
	},
	name: {
		type: String, trim: true
	},
	developer: {
		type: String, trim: true
	},
	address:{
		street: { type: String, trim: true },
		zipcode: 		{ type: String, trim: true },
		city: 			{ type: String, trim: true	},
		province: 		{ type: String, trim: true },
		country: 		{ type: String, trim: true	}
	},
	currency: { 
		type: String, trim: true 
	},
	dateOfCreation: { 
		type: Date 
	},
	dateOfCommission: { 
		type: Date 
	},
	lifeDuration: { 
		type: Number 			// in years
	},
	energyType: { 
		type: String,
      enum: ['Solar', 'Wind', 'Geothermal', 'Hydro', 'Biomass'],
	},
	installedCapacity: { 
		type: Number 			// in kWp
	},
	projectCosts: { 
		investmentCost: {
			type: Number,		// in currency/kWp
		},
		setupCost: {
			type: Number,		// in currency
		},
		consultingCost: {
			type: Number,		// in currency
		}
	},
	specificYield: {
		type: Number,		// in kWh/kWp/year
	},
	degression: {
		type: Number,		// in %
		min: 00, max: 100
	},
	variableCosts: {
		insurance: { type: Number},		// in currency/MW
		security: { type: Number },		// in currency/MW
		technicalOps: { type: Number},	// in currency/MW
		salesOps: { type: Number },		// in currency/MW
		maintenance: { type: Number },	// in currency/MW
		lease: { type: Number }				// in currency/MW
	},
	fixedCosts: {
		generalAndAdmin: {type: Number},	// in currency
		otherFixedCosts: {type: Number}
	},
	projectFinancing: {
		equity: {type: Number},				// percentage
		seniorLoan: {type: Number},			// percentage
		juniorLoan: {type: Number}			// percentage
	},
	seniorLoan: {
		amount: {type: Number},
		duration: {type: Number},
		interestRate: {type: Number, min:0, max:100}
	},
	juniorLoan: {
		amount: {type: Number},
		duration: {type: Number},
		interestRate: {type: Number, min:0, max:100}
	}
});
		

AssetSchema.statics.getAssets = function (callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Asset.find({}, function (err, assetsList) {
		if (err) {
			//console.log("[getAssetbyId] - err");
			return callback(err)
		} 
		else if (!assetsList) {
			//console.log("[getAssetbyId] - no user found");
			var err = new Error('Asset not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getAssetbyId] - OK user found");
			return callback(null, assetsList);
		}
	})
}

AssetSchema.statics.getAssetbyId = function (assetId, callback) {
	//console.log("[getUserbyId] - Begin id = " + userId);
	
	Asset.findOne({ _id: ObjectId(userId) }, function (err, asset) {
		if (err) {
			//console.log("[getAssetbyId] - err");
			return callback(err)
		} 
		else if (!asset) {
			//console.log("[getAssetbyId] - no user found");
			var err = new Error('Asset not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getAssetbyId] - OK user found");
			return callback(null, asset);
		}
	})
}

		
var Asset = mongoose.model('Asset', AssetSchema);
module.exports = Asset;