/**
 * Define the schema for a module
 */

const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema({
    //using default mongo id for now
    "mac": String,
    "history": [{
        "foodName": String,
        "data": [
            {
                "timeStamp": {
                    type: Date,
                    default: Date.now
                },
                "temperature": String,
                "humidity": String,
                "methane": String,
            }
        ]
    }],
},
    {
        collection: "modules"
    }
);

module.exports = moduleSchema;