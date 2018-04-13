var mongoose = require('mongoose'),
Message = require('./Messages.js'),
MessageSchema = mongoose.model('Message').schema;
var Schema = mongoose.Schema;

	

// create a schema
var OutBox = new Schema({
	username: { type: String, required: true },
	messages: [MessageSchema],
  });

// the schema is useless so far
// we need to create a model using it
var outbx = mongoose.model('Outbox', OutBox);

// make this available to our users in our Node applications
module.exports = outbx;