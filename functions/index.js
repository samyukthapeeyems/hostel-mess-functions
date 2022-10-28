import * as functions from "firebase-functions";
import { initializeApp, cert} from "firebase-admin/app";
import serviceAccount from "../service_account.json" assert { type: 'json'};
import {createOrder} from "./order.js";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp({
    credential: cert(serviceAccount)
});

export const createOrderx = functions.https.onRequest(async (req, res) => {
    try{
        let result = await createOrder(req.body.itemList, null);
        res.json(result);
    }
    catch(e){
        res.json(e);
    }
})


