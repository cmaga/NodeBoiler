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
                     {   "gas0": Number,
                         "gas1": Number,
                         "gas2": Number,
                         "gas3": Number,
                         "gas4": Number,
                         "gas5": Number,
                         "battery": Number,
                         "humidity": Number,
                         "temperature": Number,
                         "timeStamp": {
                             type: Date,
                             default: Date.now
                         }
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