/**
 * Define the schema for a user.
 */

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: false,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: false,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);