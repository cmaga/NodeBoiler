/**
 * Perform validation on data sent to backend.
 */

const Joi = require('joi');

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

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
