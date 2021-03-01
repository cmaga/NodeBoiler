/**
 * Define the schema for a user
 */

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "router_uuid": String,
    "wifi_ssid": String,
    "wifi_pwd": String,
    "modules": [{
        "mac": String
    }]
},
    {
        collection: "users"
    }
);

module.exports = userSchema;