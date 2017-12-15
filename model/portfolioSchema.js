// -----------------------------------------------------------------------------
// portfolioSchema.js
// Dan DUONG - Postive Energy Community
// Creation 27/11/2017
//
// This file defines the mongoose schema for the portfolio documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 
var Instrument = require('../model/instrumentSchema');

var PortfolioSchema = new mongoose.Schema({
	id: 					{ type: String, unique: false, required: true, trim: true },
	dateOfCreation:	{ type: Date },
	currency: 			{ type: String, trim: true },
	cashAccount:		{ type: Number },
	valuation:			{ type: Number },
	margin:				{ type: Number },
	owner_Id:			{ type: mongoose.Schema.Types.ObjectId },
	
	watchlist: { type: [{ 
			instrument_Id:	{ type: mongoose.Schema.Types.ObjectId, ref:'Instrument'}
		}]
	},
	
	alerts:	{ type: [{ 
			instrument_Id:	{ type: mongoose.Schema.Types.ObjectId, ref:'Instrument'},
			alertType:		{ type: String, enum: ['PRICE','PERCENTAGE'] },
			alertCondition:{ type: String, enum: ['<=', '>=']},
			alertValue:		{ type: Number },
			active:			{ type: Boolean },
			repeating:		{ type: Boolean },
			creationDate:	{ type: Date },
			expiryDate:		{ type: Date }
		}]
	},
	
	positions:	{ type: [{ 
			instrument_Id:	{ type: mongoose.Schema.Types.ObjectId, ref:'Instrument'},
			quantity:		{ type: String, trim: true }
		}]
	},

	orders:	{ type: [{ 
			instrument_Id: { type: mongoose.Schema.Types.ObjectId, ref:'Instrument'},
			orderType:		{ type: String, enum: ['BUY','SELL'] },
			quantity:		{ type: Number },
			creationDate:	{ type: Date },
			expiryDate:		{ type: Date }
		}]
	}
});
		

PortfolioSchema.statics.getPortfoliobyId = function (portfolioId, callback) {
	//console.log("[getPortfoliobyId] - Begin id = " + userId);
	
	Portfolio.findOne({ _id: ObjectId(userId) }, function (err, portfolio) {
		if (err) {
			//console.log("[getPortfoliobyId] - err");
			return callback(err)
		} 
		else if (!portfolio) {
			//console.log("[getPortfoliobyId] - no portfolio found");
			var err = new Error('Portfolio not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			//console.log("[getPortfoliobyId] - OK portfolio found");
			return callback(null, portfolio);
		}
	})
}

		
var Portfolio = mongoose.model('Portfolio', PortfolioSchema);
module.exports = Portfolio;