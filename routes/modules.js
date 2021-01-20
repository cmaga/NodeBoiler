const router = require('express').Router();


const moduleModel = require('../models/modulesModel');

router.get('/list', getModules);
router.get('/:moduleId', findModuleById);
router.get('/users/:moduleId', getModuleUsers);
router.post('/create', createModules);
router.put('/:moduleId', updateModule);
router.delete('/:moduleId/:userId', removeModuleUser);
router.delete('/:moduleId', removeModule);

//retrieve all modules
function getModules(req, res) {
    console.log('getting all modules...');
    moduleModel
        .getModules()
        .then(function (modules) {
            res.send(modules);
        }, function(err) {
            res.send(err);
        });
}

//retrieve a single module by id
function findModuleById(req, res) {
    let moduleId = req.params['moduleId'];
    moduleModel
        .findModuleById(moduleId)
        .then(function(module) {
            res.json(module);
        }, function(err) {
            res.send(err);
        });
}

//retrieve a user(s) by module id
function getModuleUsers(req, res) {
    let moduleId = req.params['moduleId'];
    moduleModel
        .getModuleUsers(moduleId)
        .then(function(users){
            res.json(users);
        }, function(err) {
            res.send(err);
        });
}

//adds a single module to the database
function createModules(req, res) {
    let module = req.body;
    moduleModel
        .createModules(module)
        .then(function (module) {
            console.log("entered");
            res.send(module);
        }, function(err) {
            res.send(err);
        });
}

//update a module by id
function updateModule(req, res) {
    let moduleId = req.params['moduleId'];
    let module = req.body;

    moduleModel
        .updateModule(moduleId, module)
        .then(function (module) {
            res.json(module);
        }, function(err) {
            res.send(err);
        });
}

//remove a user from a module given the module id and the user id
function removeModuleUser(req, res) {
    let moduleId = req.params['moduleId'];
    let userId = req.params['userId'];
    console.log('deleting user: '+userId);

    moduleModel
        .removeModuleUser(moduleId, userId)
        .then(function() {
            res.sendStatus(202);
        }, function(err) {
            res.send(err);
        });
}

//remove module by id
function removeModule(req, res) {
    let moduleId = req.params.moduleId;
    console.log('deleting module: ' +moduleId);
    moduleModel
        .removeModule(moduleId)
        .then(function() {
            res.sendStatus(202);
        }, function(err) {
           res.send(err);
        });
}

module.exports = router;
