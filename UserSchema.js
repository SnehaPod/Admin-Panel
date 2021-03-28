const mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var User = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "mobile": {
        type: String
    },
    "email": {
        type: String
    },
    "userName": {
        type: String,
        unique: true
    },
    "userType": {
        type: String,
        enum: ['ADMIN', 'USER']
    },
    "password": {
        type: String
    },
    "mentees": {
        type: String
    }
})

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function (password) {
    console.log(`password in bcrypt`, bcrypt.compareSync(password, this.password))
    return bcrypt.compareSync(password, this.password);
};

var userModel = mongoose.model('User', User);

module.exports = {
    userModel
}