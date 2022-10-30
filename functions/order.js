import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';
import functions from "firebase-functions";


export async function createOrder(itemList, userId) {
    const db = getFirestore();
        //   functions.logger.log(db)

    let result = [];

    try {

        const docRef = db.collection('items').doc('alovelace');

        await docRef.set({
            first: 'Ada',
            last: 'Lovelace',
            born: 1815
        });

        const snapShot = await db.collection('items').doc('mHshUOjCEgETWxAx2eFX').get()
        // let snapShot = await itemC.get()
        // where("name", "==", "meal").get();


        if (snapShot.empty) {
            functions.logger.log('No matching documents.');
        }



        // snapShot.forEach(doc => {

        //     functions.logger.log(doc);

        //     result.push(doc.data());
        // })
        functions.logger.log(snapShot.data());

        return result;
    }
    catch (e) {
        throw e;
    }
}

export function cancelOrder() { }

export function updateStatus() { }

