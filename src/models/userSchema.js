/**
 * Define the schema for a user
 */

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "name": String,
    "password": String,
},
    {
        collection: "Users"
    }
);

module.exports = userSchema;