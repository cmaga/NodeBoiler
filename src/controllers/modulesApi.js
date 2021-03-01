const router = require('express').Router();


const moduleModel = require('../models/modulesModel');
const moduleService = require('../services/modulesService');

router.get('/list', getModules);
router.get('/mongoId/:moduleId', findModuleById);
router.get('/:mac', findModuleByMac);
router.post('/create', createModules);
router.put('/:mac', updateModule);
router.delete('/:mac', removeModule);
router.delete('/clean/:mac', removeAllModuleData); //removes tracked history only
router.delete('/:mac/:foodName', removeFoodItem);


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

//retrieve a single module by mac address
async function findModuleByMac(req, res) {
    let mac = req.params['mac'];
    let response;
    try {
        response = await moduleModel.findModuleByMac(mac);
        res.json(response);
    } catch (err) {
        res.status(400).send("no module found");
    }
}

//adds a single module to the database
async function createModules(req, res) {
    let module = req.body;
    res.send(await moduleModel.createModules(module));
}

//update a module by mac address
async function updateModule(req, res) {
    let moduleId = req.params['mac'];
    let module = req.body;
    let response = await moduleModel.updateModule(moduleId, module);
    if (response == null) {
        res.status(400).send("Error No matching mac address found");
    } else {
        res.sendStatus(202);
    }
}

//remove module by mac address
async function removeModule(req, res) {
    let moduleId = req.params.mac;
    console.log('deleting module: ' +moduleId);

    let ans = await moduleModel.removeModule(moduleId);
    console.log(ans.deletedCount);
    if (ans.deletedCount === 0) {
        res.status(400).send("module not found");
    } else {
        res.sendStatus(204);
    }
}

//clear data for a particular food item
async function removeFoodItem(req, res) {
    console.log("wrong");
    let moduleId = req.params.mac;
    let foodName = req.params.foodName;
    let ans = await moduleModel.removeFoodItem(moduleId, foodName);

    //this logic only handles the response, there is no business logic
    if (ans != null) {
        const array = ans.history;
        let found = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].foodName === foodName) {
                found = true;
                break;
            }
        }
        if (found) {
            res.sendStatus(202)
        }
    } else {
        res.status(400).send("unable to delete");
    }
}

//clear all saved module data
async function removeAllModuleData(req, res) {
    console.log("correct");
    let moduleId = req.params.mac;
    let ans;

    try {
        //module service checks to make sure module exists before clearings its data fields
        ans = await moduleService.moduleClearHistory(moduleId);
        res.sendStatus(ans);
    } catch(err) {
        res.send(err);
    }
}

module.exports = router;
