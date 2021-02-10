/**
 * service layer for user.
 */
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

/*
    Primary Services
 */
async function userRegistration (userData) {

        let failed = false;
        let errorMessage = 'no error';
        let successObject;
        //validate post data
        const {error} = registerValidation(userData);
        if (error) {
            errorMessage = error.details[0].message;
            failed = true;
        } else {
            //check if user exists in DB
            const emailExist = await userModel.findOne({email: userData.email});
            if (emailExist) {
                failed = true;
                errorMessage = "User with that email already exists";
            } else {
                //Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                //Create new user
                const user = new userModel({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword
                });
                try {
                    const savedUser = await user.save();
                    successObject = {user: savedUser._id};
                } catch (err) {
                    errorMessage = "database failed to save the user";
                    failed = true;
                }
            }

        }
        console.log(errorMessage);
    return new Promise((resolve, reject) => {
        if (failed) {
            reject(errorMessage);
        } else {
            resolve(successObject);
        }
    })
}

async function userLogin(loginData) {

    let failed = false;
    let errorMessage = 'no error';
    let tokenGenerated;
    let foundUserId;

    const { error } = loginValidation(loginData);
    if (error) {
        errorMessage = error.details[0].message;
        failed = true;
    } else {
        //check if user exists in db
        let foundUser =  await userModel.getSingleUserByEmail(loginData.email);
        if (!foundUser) {
            errorMessage = 'User with that email not found';
            failed = true;
        } else {
            const validPass = await bcrypt.compare(loginData.password, foundUser.password);
            if (!validPass) {
                errorMessage = 'incorrect password';
                failed = true;
            } else {

                foundUserId = foundUser._id;
                tokenGenerated = jwt.sign({ "userId": foundUser._id}, process.env.TOKEN_SECRET);
            }
        }
    }
    let responsePacket = {
        token: tokenGenerated,
        id: foundUserId
    }
    return new Promise((resolve, reject) => {
        if (failed) {
            reject(errorMessage);
        } else {
            resolve(responsePacket);
        }
    })
}
async function updateUserById(userData, userId) {
    let failed = false;
    let errorMessage = 'no error';
    //validate post data
    const {error} = registerValidation(userData);
    if (error) {
        errorMessage = error.details[0].message;
        failed = true;
    } else {
        const userExist = await userModel.getSingleUserById(userId);
        if (!userExist) {
            errorMessage = 'User does not exist';
            failed = true;
        } else {
            //Hash password if new password passed
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            try {
                const savedUser = await userModel.updateSingleUser(userId, userData, hashedPassword);

            } catch (err) {
                failed = true;
                errorMessage = "unable to update the user in the database";
            }
        }
    }
    return new Promise((resolve, reject) => {
        if (failed) {
            reject(errorMessage);
        } else {
            resolve(userId);
        }
    })
}


//authenticate jsonwebtoken
function authenticateUser(token) {
    if (!token) {
        return false;
    }
    return jwt.verify(token, process.env.TOKEN_SECRET);
}

/*
    Helper functions
 */

//Validate user registration
const registerValidation = userData => {
    const userSchema = Joi.object({
        name: Joi.string().min(6).max(255),
        email: Joi.string().min(6).email(),
        password: Joi.string().min(6)
    });

    return userSchema.validate(userData);
}

//Validate user login
const loginValidation = userData => {
    const userSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return userSchema.validate(userData);
}

//

module.exports.userLogin = userLogin;
module.exports.userRegistration = userRegistration;
module.exports.updateUserById = updateUserById;
module.exports.authenticateUser = authenticateUser;

//module.exports = UserService;

/*
left off at:
write service object for users
using factory method pattern
add token decoding to get user id feature in backend
 */