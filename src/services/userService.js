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
function validateCreateUser(user) {
    // Hash password
    if (user.password) {
        user.password = hashPassword(user.password);
    }

    return user;
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
        let foundUser = await userModel.getSingleUserByEmail(loginData.email);
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
                tokenGenerated = jwt.sign({ "userId": foundUser._id }, process.env.TOKEN_SECRET);
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

//Validate user login
const loginValidation = userData => {
    const userSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return userSchema.validate(userData);
}

//Hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports.validateCreateUser = validateCreateUser;
module.exports.userLogin = userLogin;
module.exports.authenticateUser = authenticateUser;