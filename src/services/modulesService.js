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

async function toggleTracking(mac, foodName, state) {
    let failed = false;
    let error = "error: unable to find food or module";
        if (state === false) {
             try {
                 await moduleModel.setTrackingToFalse(mac, foodName);
             } catch (e) {
                 failed = true;
             }
         } else if (state === true) {
             let ans;
             //check that the foodName exists for this module
             try {
                 ans = await moduleModel.findFoodByName(mac, foodName);
             } catch (e) {
                 console.log("foodName search error");
             }
             if (ans) {
                 //set stop from tracking all foods for this module
                 try {
                     await moduleModel.setAllTrackingToFalse(mac);
                 } catch (e) {}

                 //set tracking flag for the foodName to true
                 try {
                     let ans = await moduleModel.setTrackingToTrue(mac, foodName);
                 } catch (e) {
                     failed = true;
                 }
             } else {
                 failed = true;
             }
        } else {
             failed = true;
             //string messed up
             error = "body should be true or false";

        }

    return new Promise((resolve, reject)=> {
       if (failed) {
           reject(error);
       }  else {
           resolve(204);
       }
    });
}

module.exports.moduleClearHistory = moduleClearHistory;
module.exports.toggleTracking = toggleTracking;