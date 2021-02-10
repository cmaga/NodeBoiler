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
async function getModules(req, res) {
    console.log('getting all modules...');
    res.send(await moduleModel.getModules());
}

//retrieve a single module by id
async function findModuleById(req, res) {
    let moduleId = req.params['moduleId'];
    let response;
    try {
        response = await moduleModel.findModuleById(moduleId);
        res.json(response);
    } catch (err) {
        res.status(400).send("no module found");
    }
}

//retrieve a user(s) by module id
async function getModuleUsers(req, res) {
    let moduleId = req.params['moduleId'];
    let module;
    try {
        module = await moduleModel.findModuleById(moduleId);
        res.send(module.users);
    } catch (err) {
        res.status(400).send("no module found therefore no associated users");
    }
}

//adds a single module to the database
async function createModules(req, res) {
    let module = req.body;
    res.send(await moduleModel.createModules(module));
}

//update a module by id
async function updateModule(req, res) {
    let moduleId = req.params['moduleId'];
    let module = req.body;
    let response;
    try {
        response = moduleModel.updateModule(moduleId, module);
        res.json(response);
    } catch (err){
        res.status(400).send("failed to update module");
    }
}

//remove a user from a module given the module id and the user id
async function removeModuleUser(req, res) {
    let moduleId = req.params['moduleId'];
    let userId = req.params['userId'];
    console.log('deleting user: '+userId);
    try {
        await moduleModel.removeModuleUser(moduleId, userId);
        res.sendStatus(202);
    } catch(err) {
        res.status(404).send("module does not exist");
    }
}

//remove module by id
async function removeModule(req, res) {
    let moduleId = req.params.moduleId;
    console.log('deleting module: ' +moduleId);
    let ans;
    try {
        ans = moduleModel.removeModule(moduleId);
        res.sendStatus(202);
    } catch(err) {
        res.send(err);
    }
}

module.exports = router;
