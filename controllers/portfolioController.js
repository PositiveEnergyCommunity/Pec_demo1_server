// -----------------------------------------------------------------------------
// portfolioController.js
// Dan DUONG - Postive Energy Community
// Creation 01/12/2017
//
// This file is the portfolio object controller
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
var Portfolio = require('../model/portfolioSchema');
var portfolioId = 53000000;


// -----------------------------------------------------------------------------
// Function : createPortfolio 
//	Role: create a new portfolio
//
exports.createPortfolio = function (_id , callback) {
	console.log("[createPortfolio] begin");
	console.log("[createPortfolio] id = "+ _id);
	
	var portfolioData = {
		id: portfolioId + 1,				// temporary. will implement proper mngt later...
		dateOfCreation: new Date(),
		currency: "USD",
		cashAccount: 0,
		valuation: 0,
		margin:	0,
		owner_Id: _id,
		watchlist: [],
		alerts: [],
		positions: [],
		orders: []
	};
		
	//use schema.create to insert data into the db
	Portfolio.create( portfolioData, callback);
	
};
