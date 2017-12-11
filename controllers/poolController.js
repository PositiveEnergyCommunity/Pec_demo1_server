// -----------------------------------------------------------------------------
// poolController.js
// Dan DUONG - Postive Energy Community
// Creation 01/12/2017
//
// This file is the pool object controller
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
var Pool = require('../model/poolSchema');
var poolId = 39000000;



// -----------------------------------------------------------------------------
// getPools
//
exports.getPools = function (callback) {

	console.log("[getPools] - Begin");
	Pool.getPools(callback);
};


// -----------------------------------------------------------------------------
// POST /pool route: create a new pool project
//
exports.createPool = function (data, callback) {
	console.log("[createPool] begin");
	console.log("[createPool] name = "+ data.name);
		
	// Check that there is a least a name and pool manager 
	if (data.name && data.poolManager) {
			
		console.log("[createPool] name and pool manager present");
	
		poolData = data;
		
		console.log("[createPool]- Create " + poolData.name);

		//use schema.create to insert data into the db
		Pool.create( poolData, callback);
	}
	else {
		var err = new Error('Name and Pool Manager required.');
		err.status = 400;
		callback(err, null);
	}
};
