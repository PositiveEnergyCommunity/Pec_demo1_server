// -----------------------------------------------------------------------------
// companyController.js
// Dan DUONG - Postive Energy Community
// Creation 13/12/2017
//
// This file is the company object controller
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
var Company = require('../model/companySchema');
var companyId = 46000000;



// -----------------------------------------------------------------------------
// getCompanys
//
exports.getCompanies = function (callback) {

	console.log("[getCompanies] - Begin");
	Company.getCompanies(callback);
};

// -----------------------------------------------------------------------------
// getCompanys
//
exports.getCompanyById = function (_id, callback) {

	console.log("[getCompany] - Begin");
	Company.getCompanyById(_id, callback);
};


// -----------------------------------------------------------------------------
// POST /company route: register a new company into the system
//
exports.createCompany = function (data, callback) {
	console.log("[createCompany] begin");
	console.log("[createCompany] name = "+ data.name);
	
	Company.findOne({name: data.identity.legalName}, function(err, company) {
      if (err) {
			console.log("[createCompany]- error = "+err.message);
			return callback(err, null);
      } 
		else {
			
			console.log("[createCompany]- Company = " + company);
			
			if (company === null) {
				// Check that there is a least a name and company representative 
				if (data.identity.legalName && data.representative) {
						
					console.log("[createCompany] name and company manager present");
					var companyData = data;
					companyData.id = companyId + 1;
					
					console.log("[createCompany]- Create " + companyData.identity.legalName);

					//use schema.create to insert data into the db
					Company.create( companyData, callback);
				}
				else {
					var error = new Error('Name and Company Manager required.');
					error.status = 400;
					return callback(error, null);
				}
			}
			else {
				console.log("[createCompany] Company already exist");
				//console.log("[getUser] success email = "+ user.email);
				return callback(null, company);
			};
      }
   });
};
