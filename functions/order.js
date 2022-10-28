import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';
import functions from "firebase-functions";


export async function createOrder(itemList, userId){
    const db = getFirestore();
    let result = [];
    try{
        const snapShot = await db.collection("items").where("name", "==", "meal").get();
        snapShot.forEach(doc => {
            result.push(doc);
        })
        functions.logger.log(result);

        return result;
    }
    catch(e){
        throw e;
    }
}

export function cancelOrder(){}

export function updateStatus(){}

