var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var ChatListItem = new Schema({
	username: { type: String, required: true },
    name: { type: String},
	date: { type: Date},
    profile_picture: {type: String},
  });


// the schema is useless so far
// we need to create a model using it
var cli = mongoose.model('ChatListItem', ChatListItem);

// make this available to our users in our Node applications
module.exports = cli;