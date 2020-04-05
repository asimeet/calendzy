let mongoose = require('mongoose');  
let UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
});

let usrMdl = mongoose.model('cl_user', UserSchema);

module.exports = usrMdl;