var mongoose = require('mongoose'),
Message = require('./Messages.js'),
MessageSchema = mongoose.model('Message').schema;
var Schema = mongoose.Schema;

	

var chatSchema = new Schema({
	username: { type: String, required: true },
	messages: [MessageSchema],
  });



// the schema is useless so far
// we need to create a model using it
var cs = mongoose.model('Chat', chatSchema);

// make this available to our users in our Node applications
module.exports = cs;