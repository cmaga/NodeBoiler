const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userService = require('../services/userService');
const userModel = mongoose.model('UserModel', userSchema);

userModel.getUsers = getUsers;
userModel.getWifiByRouterUUID = getWifiByRouterUUID;
userModel.getSingleUserById = getSingleUserById;
userModel.getSingleUserByEmail = getSingleUserByEmail;
userModel.updateSingleUser = updateSingleUser;
userModel.removeUserbyId = removeUserById;
userModel.createUser = createUser;
userModel.getModulesByRouterUUID = getModulesByRouterUUID;
userModel.addModuleToUser = addModuleToUser;
module.exports = userModel;

async function addModuleToUser(userId, module) {
    const addModule = await userModel.findOneAndUpdate({ _id: userId }, { $push: { modules: module } });
    return await userModel.findOne({ _id: userId });
}

async function getModulesByRouterUUID(routerUUID) {
    const modules = await userModel.findOne({ router_uuid: routerUUID }).select('modules -_id');
    return modules;
}

async function createUser(user) {
    //These lines cause errors...
    //const emailExists = userModel.findOne({ email: user.email });
    //const validUser = await userService.validateCreateUser(user);
    return userModel.create(user);
}

function getUsers() {
    return userModel.find({}, (err, users) => {
        var userMap = {};

        users.forEach((user) => {
            userMap[user._id] = user;
        });
        return userMap;
    });

}

//Return wifi ssid and wifi pwd for a user
function getWifiByRouterUUID(routerUUID) {
    return userModel.findOne({ router_uuid: routerUUID }).select('wifi_ssid wifi_pwd -_id');
}

function getSingleUserById(userId) {
    return userModel.findById(userId);
}

function getSingleUserByEmail(emailProvided) {
    return userModel.findOne({ email: emailProvided });
}

//updates all user fields except password
function updateSingleUser(userId, newUser) {
    return userModel.findOneAndUpdate({ "_id": userId }, { $set: newUser }, { new: true }, (err, doc) => {
        if (err) {
            console.log("Error when updating the user");
        }
        console.log(doc);
    });
}

function removeUserById(userId) {
    return userModel.deleteOne({ "_id": userId });
}
