/**
 * Define operations for users API.
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');

//Register a user
router.post('/register', async (req, res) => {

    //Validate post data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user exists in DB
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login a user
router.post('/login', async (req, res) => {

    //Validate post data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user exists in DB
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not registered');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(400).send('Invalid password');

    //Create and assign login token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

//Get all users
router.get('/', async (req, res) => {
    User.find({}, (err, users) => {
        var userMap = {};

        users.forEach((user) => {
            userMap[user._id] = user;
          });
      
          res.send(userMap);
    })
})

//Get user by id
router.get('/:userId', async (req, res, next) => {
    User.findById(req.params.userId, (err, user) =>{
        res.send(user);
    })
})

//Update user by id
router.put('/:userId', async (req, res, next) => {
    //Validate put data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if user exists in DB
    const userExist = await User.findOne({ _id: req.params.userId });
    if (!userExist) return res.status(400).send('User does not exist');

    //Hash password if new password passed
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    try {
        const savedUser = await User.findOneAndUpdate({_id: req.params.userId}, {
                name: req.body.name ? req.body.name : userExist.name,
                email: req.body.email ? req.body.email : userExist.email,
                password: hashedPassword //ToDo: confirm intended functionality of updating password
            },
            {new: true});
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete user by id
router.delete('/:userId', async (req, res, next) => {
    const deleteUser = await User.findOneAndDelete({ _id: req.params.userId });    

    try {
        res.send({user: deleteUser._id});
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;