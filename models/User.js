const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    accountId: String,  
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);