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
        // 

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
        //

        const order = db.collection('orders').add({
            items: itemList.map(item => `/items/${item}`),
            placed_at: new Date(),
            status: "Completed",
            total_amount: totalPrice,
            user: "eritei54753"
        })


        const currentDate = new Date();
        const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
        
        const result = await db.collection('dues').where("user", "==", "eritei54753").where("period", ">=", firstDate).where("period", "<", lastDate).where("status", "==", "unsettled").get();

        // let res = [];
        // result.forEach(x => res.push(x.data()))
        // functions.logger.log("result ts", res)
//
        //
        functions.logger.log("due result", result.docs);

        if(result.empty){
            functions.logger.log("due list empty")
            await db.collection('dues').add({
                amount: totalPrice,
                period: new Date(),
                status: "unsettled",
                user: "eritei54753"
            })
        }

        //
        else{
            

            await db.collection('dues').doc(result.docs[0].id).update({
                amount: result.docs[0].data().amount + totalPrice
            })
        }

        return {
            totalPrice
        }
    }
    catch (e) {
        throw e;
    }
}

export async function addDue() {
    try {
        let res = []

        return res

    }
    catch (e) {
        throw e;
    }
}

export function updateStatus() { }

