import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';

// get items


export async function getItemSnapShotList(itemList) {
    let db = getFirestore();
    let itemPromiseList = [];

    itemList.forEach(item => {
        let itemPromise = db.collection('items').doc(item).get();
        itemPromiseList.push(itemPromise);
    })

    // get all resolved promises from itemPromiseList to itemSnapShotList
    let itemSnapShotList = await Promise.all(itemPromiseList);
    return itemSnapShotList;
}


export async function addItemImage(obj) {
    let db = getFirestore();
    let { name, metadata } = obj;

    const itemRef = db.doc(`items/${metadata.itemId}`);
    return itemRef.set({ image: name }, { merge: true });

}

// change git conf