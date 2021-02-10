const mongoose = require('mongoose');
const moduleSchema = require('./moduleSchema');
const moduleModel = mongoose.model('ModuleModel', moduleSchema);

moduleModel.getModules = getModules;
moduleModel.findModuleById = findModuleById;
moduleModel.createModules = createModules;
moduleModel.updateModule = updateModule;
moduleModel.removeModuleUser = removeModuleUser;
moduleModel.removeModule = removeModule;
module.exports = moduleModel;

function getModules() {
    return moduleModel.find();
}

function findModuleById(moduleId) {
    return moduleModel.findById(moduleId);
}

function createModules(modules) {
    console.log("server" + JSON.stringify(modules));
    return moduleModel.create(modules);
}

function updateModule(moduleId, newModule) {
    return moduleModel.findOneAndUpdate({"_id": moduleId}, {$set: newModule}, {new: true}, (err, doc) => {
        if (err) {
            console.log(`the module we are searching for is ${moduleId}`);
            console.log("something went wrong when updating the data: id not found");
        }
        console.log(doc);
    });
}

function removeModuleUser(moduleId, userId) {
    return moduleModel.updateOne(
        {_id: moduleId},
        {$pull: {'users': { userId: `${userId}`} } }
    );
}

function removeModule(moduleId) {
    return moduleModel.remove({"_id": moduleId});
}



