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
router.get('/:routerUUID/router', getWifiByRouterUUID);
router.get('/:routerUUID/modules', getModulesByRouterUUID);
router.put('/:userId', updateUserById);
router.put('/:userId/modules', addModuleToUser);
router.delete('/:userId', removeUserById);

//Add module mac address to a user schema
async function addModuleToUser(req, res) {
    const module = req.body;
    const userId = req.params.userId;
    res.send(await userModel.addModuleToUser(userId, module));
}

//Get all modules associated with a routerUUID
async function getModulesByRouterUUID(req, res) {
    const routerUUID = req.params.routerUUID;
    res.send(await userModel.getModulesByRouterUUID(routerUUID));
}

//Get wifi credentials by router uuid
async function getWifiByRouterUUID(req, res) {
    routerUUID = req.params.routerUUID;
    res.send(await userModel.getWifiByRouterUUID(routerUUID));
}

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

/*
Typically, authentication occurs to create routes that require a valid token
This is purely an endpoint to check if the user is authenticated
Primary reason this exists is to maintain the contents of the legacy
verify_Token.js file from before the project adopted a 3-layer architecture.
TODO: Delete it, if it is not needed.
 */
function userAuthentication(req, res) {
    const verified = userService.authenticateUser(req.header('auth-token'));
    if (!verified) {
        res.status(400).send("Invalid Token");
    } else {
        req.user = verified;
    }
}
module.exports = router;