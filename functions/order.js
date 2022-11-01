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

        // get all resolved promises from itemPromiseList to itemSnapShotList
        let itemSnapShotList = await Promise.all(itemPromiseList);
        
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


        const order = await db.collection('orders').add({
            items: itemList.map(item => `/items/${item}`),
            placed_at : new Date(),
            status : "Completed",
            total_amount : totalPrice,
            user: "qwe4r5t6uykjhgra"
        })

        functions.logger.log("Added order ", order.id);


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

