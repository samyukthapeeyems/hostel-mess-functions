import * as functions from "firebase-functions";
import { initializeApp, cert , getApps } from "firebase-admin/app";
import serviceAccount from "../service_account.json" assert { type: 'json'};

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';

const app = initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();





import { createOrder } from "./order.js";


export const createOrderx = functions.https.onRequest(async (req, res) => {
    try {

        //   functions.logger.log(db)
        

        let result = [];


        const snapShot = await db.collection('items').doc('mHshUOjCEgETWxAx2eFX').get()
        // let snapShot = await itemC.get()
        // where("name", "==", "meal").get();


        if (snapShot.empty) {
            functions.logger.log('No matching documents.');
        }
        functions.logger.log(snapShot.data())
        snapShot.forEach(doc => {
            functions.logger.log(doc);
            result.push(doc.data());
        })

        functions.logger.log(snapShot.data());

        //let result = await createOrder(req.body.itemList, null);
        res.json(result);
    }
    catch (e) {
        res.json(e);
    }
})


