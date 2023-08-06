import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';
import functions from "firebase-functions";
import { getItemSnapShotList } from './item.js';
import { _date } from './util.js';

export async function createOrder(itemList, userId) {
    const db = getFirestore();

    try {

        // get all resolved promises from itemPromiseList to itemSnapShotList
        let itemSnapShotList = await getItemSnapShotList(itemList);
        // 
        let totalPrice = 0


        for (let item of itemSnapShotList.docs) {

            // if (snapShot?.exists == false) {
            //     return {
            //         message: "Invalid item_id in list items"
            //     }
            // }

            let id = item.id
            let data = item.data();

            if (data.isAvailable == false) {
                return {
                    message: `Item ${data.name} isn't available`
                }
            }

            let { quantity } = itemList.find(_item => _item.id === id)
            totalPrice += data.price * quantity
        }
        //

        const order = await db.collection('orders').add({
            items: itemList.map(item => {
                return {
                    itemId: `/items/${item.id}`,
                    quantity: item.quantity
                }
            }),
            itemCount: itemList.length,
            placed_at: new Date(),
            status: "Pending",
            total_amount: totalPrice,
            user: userId
        })



        // const result = await db.collection('dues')
        //     .where("user", "==", "eritei54753")
        //     .where("period", ">=", _date().firstDate)
        //     .where("period", "<", _date().lastDate)
        //     .where("status", "==", "unsettled").get();

        // let res = [];
        // result.forEach(x => res.push(x.data()))
        // functions.logger.log("result ts", res)
        //
        //
        // functions.logger.log("due result", result.docs);

        // if (result.empty) {
        //     functions.logger.log("due list empty")
        //     await db.collection('dues').add({
        //         amount: totalPrice,
        //         period: new Date(),
        //         status: "unsettled",
        //         user: "eritei54753"
        //     })
        // }

        //
        // else {

        //     await db.collection('dues').doc(result.docs[0].id).update({
        //         amount: result.docs[0].data().amount + totalPrice
        //     })
        // }

        return {
            orderId: order.id,
            totalPrice
        }
    }
    catch (e) {
        throw e;
    }
}


//export function updateStatus() { }




export async function summarizeDailyOrder() {

    let summary = {
        items: [],
        totalRevenue : 0 ,
        completedOrders : 0,
        pendingOrders : 0 ,
        offlineOrders : 0,
        onlineOrders : 0
    }

    const db = getFirestore();

    let r = await db.collection('orders').where('placed_at', '==', new Date()).where('status', '==', 'PAID').get()

    let orderSnapshots = r.docs
    orderSnapshots.forEach(order => {

        order.items.forEach(item => {

            let index = summary.items.findIndex(_item => _item.id === item.id)
            if (index !== -1){
                summary.items[index].quantity = item.qunatity
                
            }
            else
                summary.items.push(item)
        })

    })

}


