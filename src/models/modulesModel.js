const mongoose = require('mongoose');
const moduleSchema = require('./moduleSchema');
const moduleModel = mongoose.model('ModuleModel', moduleSchema);

moduleModel.getModules = getModules;
moduleModel.findModuleById = findModuleById;
moduleModel.findModuleByMac = findModuleByMac;
moduleModel.createModules = createModules;
moduleModel.updateModule = updateModule;
moduleModel.removeModule = removeModule;
moduleModel.removeFoodItem = removeFoodItem;
moduleModel.removeAllModuleData = removeAllModuleData;
moduleModel.addData = addData;
moduleModel.addNewFoodItem = addNewFoodItem;
moduleModel.setTrackingToFalse = setTrackingToFalse;
moduleModel.setTrackingToTrue = setTrackingToTrue;
moduleModel.setAllTrackingToFalse = setAllTrackingToFalse;
moduleModel.findFoodByName = findFoodByName;
moduleModel.getFoodStatus = getFoodStatus;
module.exports = moduleModel;

function getModules() {
    return moduleModel.find();
}

function findModuleById(moduleId) {
    return moduleModel.findById(moduleId);
}

function findModuleByMac(mac) {
    console.log("server" + mac);
    return moduleModel.find({"mac": mac});
}

function createModules(modules) {
    console.log("server" + JSON.stringify(modules));
    return moduleModel.create(modules);
}

function updateModule(mac, newModule) {
    /*
    This was how it was previously being done may come back to this so I'm leaving this
    return moduleModel.findOneAndUpdate({"mac": mac}, {$set: newModule}, {new: true}, (err, doc) => {
        if (err) {
            console.log(`the module we are searching for is ${mac}`);
            console.log("something went wrong when updating the data: id not found");
        }
            console.log(doc);
    });
     */
    return moduleModel.findOneAndUpdate({"mac": mac}, {$set: newModule});
}

function removeModule(mac) {
    return moduleModel.deleteOne({"mac": mac});
}

function removeFoodItem(macId, food) {
    return moduleModel.findOneAndUpdate(
        {mac: macId},
        {$pull: { history: {foodName: food}}},
        {multi: true}
    );
}

function removeAllModuleData(macAddress) {
    return moduleModel.findOneAndUpdate({mac: macAddress}, {$set: {"history": []}}, {multi: true});
}

//Note: in the case the user has not begun tracking any food this data will not be accepted
function addData(macAddress, data) {
        return moduleModel.findOneAndUpdate(
            {mac: macAddress},
            {   $push: {"history.$[elem].data" : data}, "upsert": true},
            { arrayFilters: [{ "elem.tracking": {$eq : true} }] },
            );
}

function addNewFoodItem(macAddress, name) {
    return moduleModel.findOneAndUpdate(
        {mac: macAddress},
        {$push: {
                history: {
                            foodName: name,
                            data: []
                        }
            }
        }
    );
}

function setTrackingToFalse(macAddress, foodName) {
    return moduleModel.findOneAndUpdate(
        {mac: macAddress},
        {   $set: {"history.$[elem].tracking" : false}  },
        {   arrayFilters: [ {"elem.history.foodName": {$eq: foodName}} ]    }
    );
}
function setTrackingToTrue(macAddress, foodName) {

    return moduleModel.findOneAndUpdate(
        {mac: macAddress},
        {   $set: {"history.$[elem].tracking" : true}  },
        {   arrayFilters: [ {"elem.history.foodName": {$eq: foodName}} ]    }
    );
}

function setAllTrackingToFalse(macAddress) {
    return moduleModel.findOneAndUpdate(
        {mac: macAddress},
        {$set: {"history.$[elem].tracking": false} },
        {   arrayFilters: [ {"elem.tracking": {$eq: true}} ]}
    )
}
function findFoodByName(macAddress, food) {
    return moduleModel.findOne( {mac: macAddress, "history.foodName": food}   );
}

function getFoodStatus(mac) {

}
