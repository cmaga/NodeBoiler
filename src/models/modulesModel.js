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


