import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';
import functions from "firebase-functions";


export async function createOrder(itemList, userId) {
    const db = getFirestore();

    let result = [];

    try {

        // get all items from firestore with the key 
        let itemPromiseList = []

        itemList.forEach(item => {
            let itemPromise = db.collection('items').doc(item).get();
            itemPromiseList.push(itemPromise);
        })


        let itemSnapShotList = await Promise.all(itemPromiseList);
        // 
        functions.logger.log("snapshot", itemSnapShotList[0].data())
        let totalPrice = 0


        for (let snapShot of itemSnapShotList) {

            if (snapShot.exists == false) {
                return {
                    message: "Invalid item_id in list items"
                }
            }

            let data = snapShot.data();

            
            if (data.isAvailable == false) {
                return {
                    message: `Item ${data.name} isn't available`
                }
            }


            totalPrice += parseInt(data.price)
        }



        return {
            totalPrice
        }
    }
    catch (e) {
        throw e;
    }
}

export function cancelOrder() { }

export function updateStatus() { }

