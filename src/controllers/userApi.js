/**
 * user endpoints.
 */

const router = require('express').Router();

const userModel = require('../models/userModel');
const userService = require('../services/userService');

router.post('/register', registerUser);
router.post('/login', userLogin);
router.get('/', getAllUsers);
router.get('/:userId', findUserById);
router.put('/:userId', updateUserById);
router.delete('/:userId', removeUserById);

//Create a user
async function registerUser(req, res) {
    let user = req.body;
    res.send(await userModel.createUser(user));
}

//Login a user
async function userLogin(req, res) {
    //call user login service
    let loginResponse;
    try {
        loginResponse = await userService.userLogin(req.body);
        res.header('auth-token', loginResponse.token).send(loginResponse.id);
    } catch (err) {
        res.send(err);
    }
}

//Get all users
async function getAllUsers(req, res) {
    res.send(await userModel.getUsers());
}

//Find a user by id
async function findUserById(req, res) {
    res.send(await userModel.getSingleUserById(req.params.userId));
}

//Update a user by id
async function updateUserById(req, res) {
    const user = req.body;
    const userId = req.params.userId;
    res.send(await userModel.updateSingleUser(userId, user));
}

//Delete user by id
async function removeUserById(req, res) {
    let userId = req.params.userId;
    let ans;
    try {
        ans = await userModel.removeUserbyId(userId);
        res.sendStatus(202); //restful convention states to respond with 202 and empty body
    } catch (err) {
        res.status(400).send("No user with matching ID exists");
    }
}

module.exports = router;