import { getFirestore, Timestamp, FieldValue, FieldPath } from 'firebase-admin/firestore';

// get items


export async function getItemSnapShotList(itemList) {
    let db = getFirestore();
    let itemIdList = itemList.map(item => item.id);

    let resultSnapShot = await db
        .collection('items')
        .where(FieldPath.documentId(), 'in', itemIdList)
        .get()

    return resultSnapShot;
}


export async function addItemImage(obj) {
    let db = getFirestore();
    let { name, metadata } = obj;

    const itemRef = db.doc(`items/${metadata.itemId}`);
    return itemRef.set({ image: name }, { merge: true });

}



export async function buildItemBundle() {
    let db = getFirestore();
    const items = await db.collection('items').get();
    const bundleBuffer = db.bundle('latest-stories').add('itemBundle', items).build();
    return bundleBuffer;

}
// change git conf