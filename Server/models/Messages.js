var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true},
  translatedmessage: { type: String},
  image: {type: Boolean},
  audio: {type: Boolean},
  });

// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;