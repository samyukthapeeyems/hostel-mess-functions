import * as functions from "firebase-functions";
import { initializeApp, cert , getApps } from "firebase-admin/app";
// import serviceAccount from "../service_account.json";




import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const serviceAccount = require("../service_account.json") // use the require method




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = initializeApp({
    credential: cert(serviceAccount)
});





import { createOrder ,addDue } from "./order.js";


export const createOrderx = functions.https.onRequest(async (req, res) => {
    try {
        let result = await createOrder(req.body.items, null);

        functions.logger.log("result", result)

        res.json(result);
    }
    catch (e) {
        res.json(e);
    }
})


export const addDuex = functions.https.onRequest(async (req, res) => {
    try {
        let result = await addDue();

        functions.logger.log("result", result)

        res.json(result);
    }
    catch (e) {
        res.json(e);
    }
})


