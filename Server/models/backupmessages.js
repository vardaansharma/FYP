var mongoose = require('mongoose'),
Chat = require('./chat.js'),
ChatListItem = require('./chatlist'),
ChatSchema = mongoose.model('Chat').schema,
Chatlistitemschema = mongoose.model('ChatListItem').schema;
var Schema = mongoose.Schema;

	

var backupmessageSchema = new Schema({
	
	username: { type: String, required: true },
	chats: 	[ChatSchema] ,
    chatlist: [Chatlistitemschema]
  });


// the schema is useless so far
// we need to create a model using it
var bms = mongoose.model('Backupmessages', backupmessageSchema);

// make this available to our users in our Node applications
module.exports = bms;