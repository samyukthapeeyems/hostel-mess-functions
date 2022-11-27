import * as functions from "firebase-functions";
import { initializeApp, cert } from "firebase-admin/app";
import { createOrder } from "./src/order.js";
import { getAuth } from "firebase-admin/auth";
import { addItemImage } from "./src/item.js";
import { setMetadata } from "./src/storage.js";
// import serviceAccount from "../service_account.json";



import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const serviceAccount = require("../service_account.json") // use the require method


initializeApp({
    credential: cert(serviceAccount)
});

//changing region 

let regionalFunction = functions.region('asia-south1');

export const processUserSignUp = regionalFunction.auth.user().onCreate(async (user) => {
    
    try{
        await getAuth().setCustomUserClaims(user.uid, {
            roles: ["hosteler", "student"]
        })
    
        
        return Promise.resolve()
    }
    catch(e){
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
        "Cache-Control" : "max-age=2592000"
    }
    await setMetadata(newMetadata, obj.name);
    return addItemImage(obj)
});
// export const createOrderx = functions.https.onCall(async (data, context) => {
//     try {
//         let result = await createOrder(data.order, context.);
//         functions.logger.log("result", result)

//         res.json(result);
//     }
//     catch (e) {
//         res.json(e);
//     }
// })

