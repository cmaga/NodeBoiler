/**
 * Define the schema for a module
 */

const mongoose = require('mongoose');

const moduleSchema = mongoose.Schema({
    //using default mongo id for now
        "users": [{
            "userId": String,
            "userName": String
        }]
    },
    {
    collection: "modules"
    }
);

module.exports = moduleSchema;