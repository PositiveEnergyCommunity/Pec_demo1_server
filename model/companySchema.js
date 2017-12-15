// -----------------------------------------------------------------------------
// companySchema.js
// Dan DUONG - Postive Energy Community
// Creation 12/12/2017
//
// This file defines the mongoose schema for the companies documents in the db
//
// -----------------------------------------------------------------------------
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 


var CompanySchema = new mongoose.Schema({
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
	representative_Id:{ type: mongoose.Schema.Types.ObjectId },
	email: 			{ type: String, trim: true },
	phone: 			{ type: String, trim: true },
	activity: 		{ type: String, trim: true },
});


CompanySchema.statics.getCompanies = function (callback) {
	console.log("[getCompanies] - Begin");
	
	Company.find({}, function (err, companiesList) {
		if (err) {
			console.log("[getCompanybyId] - err");
			return callback(err)
		} 
		else if (!companiesList) {
			console.log("[getCompanybyId] - no user found");
			var err = new Error('Company not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			console.log("[getCompanybyId] - OK user found");
			return callback(null, companiesList);
		}
	})
}


CompanySchema.statics.getCompanyById = function (companyId, callback) {
	console.log("[getCompanyById] - Begin id = " + companyId);
	
	Company.findOne({ _id: ObjectId(companyId) }, function (err, company) {
		if (err) {
			console.log("[getCompanyById] - err");
			return callback(err)
		} 
		else if (!company) {
			console.log("[getCompanyById] - no company found");
			var err = new Error('Company not found.');
			err.status = 401;
			return callback(err);
		}
		else {
			console.log("[getCompanyById] - OK company found");
			return callback(null, company);
		}
	})
}

		
var Company = mongoose.model('Company', CompanySchema);
module.exports = Company;