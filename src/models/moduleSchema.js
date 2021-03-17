/**
 * Define the schema for a module
 */

const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema({
    "mac": String,
    "history": [
        {
        "foodName": String,
        "tracking": {type: Boolean, default: false},
        "status": {type: String, default: "none"},
        "data": [
                     {
                         "timeStamp": {
                             type: Date,
                             default: Date.now
                         },
                         "temperature": Number,
                         "humidity": Number,
                         "methane": Number,
                     }
                ]
        }
    ],
},
    {
        collection: "modules"
    }
);

module.exports = moduleSchema;