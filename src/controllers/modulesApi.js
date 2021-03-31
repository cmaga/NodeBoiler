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
router.post('/data/:mac', addData);
router.delete('/:mac/:foodName', removeFoodItem);
router.put('/track/:mac/:foodName', toggleTrackingStatus);
router.post('/:mac', addNewFoodItem);
router.delete('/wipe/:mac/:foodName', wipeFoodsData);

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

//add new food item (just the name);
/*
should be in the format: {foodName: "desiredName"}
 */
async function addNewFoodItem(req, res) {
    let name = req.body.foodName;
    let mac = req.params.mac;
    try {
        let ans = await moduleModel.addNewFoodItem(mac, name);
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}

//clear all module history field
async function removeAllModuleData(req, res) {
    let moduleId = req.params.mac;
    try {
        //module service checks to make sure module exists before clearings its data fields
        let ans = await moduleService.moduleClearHistory(moduleId);
        res.sendStatus(202);
    } catch(err) {
        res.send(err);
    }
}

//Adds data for the current food being tracked
//If no food is currently being tracked the data is not entered into the database
async function addData(req, res) {
    let mac = req.params.mac;
    let data = req.body;
    let ans;
    let freshness = "database error";
    try {
        ans = await moduleModel.addData(mac, data);
        //hardware team specifically asked for the server to send back the status as a response

        for (let i = 0; i < ans.history.length; i++) {
            if (ans.history[i].tracking) {
                freshness = ans.history[i].status;
            }
        }


    } catch (e) {
        console.log(e);
    }

    res.send(freshness);
}

//toggles the status to tracking or not being tracked
//(Can only track one food at a time per module)

async function toggleTrackingStatus(req, res) {
    let mac = req.params.mac;
    let foodName = req.params.foodName;
    let state = req.body.state;

    try {
        let ans = await moduleService.toggleTracking(mac, foodName, state);
        res.sendStatus(204);
    } catch (e) {
        res.status(404).send(e);
    }
}

async function wipeFoodsData(req, res) {
    try {

        let ans = await moduleModel.wipeFoodsData(req.params.mac, req.params.foodName);
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}

module.exports = router;
