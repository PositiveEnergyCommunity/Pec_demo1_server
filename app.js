// -----------------------------------------------------------------------------
// main.js
// Dan DUONG - Postive Energy Community
// Creation 22/11/2017
//
// This file is the main node.js server for the PEC demonstrator
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Initialisation
//
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require("morgan");
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo');

var app = express();
var port = process.env.PORT || 3000;

//------------------------------------------------------------------------------
// Connect to MongoDB database using mongoose
//
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
var db = mongoose.connection;

// Handle Mongo errors...
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("[mongoose]- we are connected");
  // we're connected!
});


//------------------------------------------------------------------------------
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

//------------------------------------------------------------------------------
// Allow cross site access
//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
  next();
});

// serve static files from /public
app.use(express.static(__dirname + '/template'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
	console.log("[app.use]- err !!!");
	res.status(err.status || 500).json({ error: err.message });
});

// listen on port
app.listen( port, function () {
	console.log('Express app listening on port '+ port);
}); 