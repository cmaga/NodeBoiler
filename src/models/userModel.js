const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const userModel = mongoose.model('UserModel', userSchema);

userModel.getUsers = getUsers;
userModel.getSingleUserById = getSingleUserById;
userModel.getSingleUserByEmail = getSingleUserByEmail;
userModel.updateSingleUser = updateSingleUser;
userModel.removeUserbyId = removeUserById;
module.exports = userModel;

function getUsers() {
    return userModel.find({}, (err, users) => {
        var userMap = {};

        users.forEach((user) => {
            userMap[user._id] = user;
        });
        return userMap;
    });

}

function getSingleUserById(userId) {
    return userModel.findById(userId);
}

function getSingleUserByEmail(emailProvided) {
    return userModel.findOne({email: emailProvided});
}

//updates all user fields
function updateSingleUser(userId, newUser, hashedPassword) {
    return userModel.findOneAndUpdate({_id: userId},  {
        name: newUser.name ? newUser.name : userExist.name,
        email: newUser.email ? newUser.email : userExist.email,
        password: hashedPassword
    },
        {new: true});
}

function removeUserById(userId) {
    return userModel.deleteOne({"_id": userId});
}
