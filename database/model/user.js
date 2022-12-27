const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 15
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;