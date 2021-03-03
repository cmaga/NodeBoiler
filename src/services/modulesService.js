/**
 * Contains primary module business logic for the backend
 */
const moduleModel = require('../models/modulesModel');
//const moduleSchema = require('../models/userSchema');

/*
    Primary services
 */

async function moduleClearHistory(mac) {
    let failed = false;
    let error;
    //check if module is in the database
    let found;
    try {
        found = await moduleModel.findModuleByMac(mac);
    } catch (err) {
        error = "module not found";
        failed = true;
    }
    if (!failed) {
        //if it is found clear its data section
        let res;
        try {
            res = await moduleModel.removeAllModuleData(mac);
        } catch (e) {
            error = e;
        }
    }

    return new Promise((resolve, reject) => {
        if (failed) {
            reject(error);
        } else {
            resolve(202);
        }
    });
}

module.exports.moduleClearHistory = moduleClearHistory;