/**
 * Define the schema for a user.
 */

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
},
    {
        collection: "users"
    }
    );

module.exports = userSchema;