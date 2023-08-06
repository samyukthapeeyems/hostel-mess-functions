import * as functions from "firebase-functions";
import { initializeApp, cert } from "firebase-admin/app";
import { createOrder as newOrder } from "./src/order.js";
import { getAuth } from "firebase-admin/auth";
import { addItemImage, buildItemBundle } from "./src/item.js";
import { setMetadata, uploadBundle } from "./src/storage.js";
import { readFile } from 'fs/promises';
import {initiateTransaction} from './src/payments.js'

import os from 'node:os'
import path from 'path';
import { compressBundle, generateSHA256 } from "./src/util.js";

// import serviceAccount from "../service_account.json";



import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const serviceAccount = require("./service_account.json") // use the require method


initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "hostel-mess-5d9a7.appspot.com/"
});

//changing region 

let regionalFunction = functions.region('asia-south1');

export const processUserSignUp = regionalFunction.auth.user().onCreate(async (user) => {

    try {
        await getAuth().setCustomUserClaims(user.uid, {
            roles: ["hosteler", "student"]
        })


        return Promise.resolve()
    }
    catch (e) {
        functions.logger.log("auth role... failed")
        return Promise.reject("auth role... failed")
    }

})

// async function setRole(uid,roles){
//     await getAuth().setCustomUserClaims(uid, {
//         roles: roles
//     })
// }

//setRole("9bKbE6JvgdeZiPbLG324l83U2oF3",["admin"])
export const addImage = functions.storage.object().onFinalize(async obj => {
    let newMetadata = {
        cacheControl: "max-age=2592000"
    }
    let res = await setMetadata(newMetadata, obj.name);
    functions.logger.log("METADATA RES", res)
    return addItemImage(obj)
});


// CREATE ORDER API


export const createOrder = regionalFunction.https.onCall(async (data, context) => {
    functions.logger.log("data: ", data)
    if (!context.auth.uid)
        return {
            message: "unauthenticated"
        }

    try {
        const createOrderResult = await newOrder(data.itemList, context.auth.uid)
        functions.logger.log("CREATE ORDER API RES: ", createOrderResult)


        const paymentResponse = await initiateTransaction(
            createOrderResult.orderId,
            createOrderResult.totalPrice,
            context.auth.uid
        )

        return { order : createOrderResult, payment : paymentResponse}
    }

    catch (e) {
        functions.logger.error(e)
    }
})


// CACHE ITEMS ON UPDATE
export const createItemBundle = regionalFunction.firestore.document('items/{itemId}').onWrite(async () => {

    try {
        let itemBundle = await buildItemBundle();
        await compressBundle(itemBundle);
        let filePath = path.join(os.tmpdir(), "bundle.txt.gz");

        let file = await readFile(filePath);
        let hash = generateSHA256(file)
        let res = await uploadBundle(file, hash, serviceAccount)
        functions.logger.log("bundle result",res)
        return res;
    }
    catch (err) {
        functions.logger.log(err);
        return {
            status: 500,
            error: err
        }
    }


})