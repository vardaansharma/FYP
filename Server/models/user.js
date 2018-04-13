var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, required: true },
  location: String,
  age : Number,
  status: String,
  profile_picture : String,
  phone_number : String ,
  email : String,
});



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
