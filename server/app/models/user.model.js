const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username : String,
    firstname : String,
    lastname : String,
    password : String,
    avatar : String,
    email : String

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);