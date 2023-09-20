import {
    getFirestore,
    Timestamp,
    FieldValue,
    FieldPath,
} from "firebase-admin/firestore";

const txnMethod = "WALLET";
const walletLimit = 1000.00;

export async function createWallet(userId, balance = 0.0) {
    let db = getFirestore();

    let res = await db.collection("wallet").add({
        userId: userId,
        balance: balance,
        lastUpdated: new Date(),
        status: "Active",
    });

    return {
        walletId : res.id,
        message: "Wallet created",
    };

}

export async function updateBalance(userId, amount, transactionType) {
    let db = getFirestore();
    let walletSnapshot = await db.collection('wallet').where("userId", "==", userId).where("status", "==", "Active").get();
    let wallet = walletSnapshot.docs[0];
    let walletData = wallet.data()

    if (!wallet) {
        throw new Error("Transaction failed")
    }

    let newBalance = walletData.balance;
    
    if (transactionType === "DEBIT") {
        if (parseInt(walletData.balance) >= amount)
            newBalance = walletData.balance - amount;
        else throw new Error("No balance")
    }

    if (transactionType === "CREDIT") {
        if (amount <= walletLimit)
            newBalance = walletData.balance + amount;
        else throw new Error("Limit exceeded")
    }

    try {
        let txnRes = await db.collection('transaction').add({
            instrumentId: wallet.id,
            pgReference: null,
            transactionType: transactionType,
            transactionMethod: txnMethod,
            amount: amount,
            timestamp: new Date()
        })
        await db.doc(`wallet/${wallet.id}`).set({ balance: newBalance, lastUpdated: new Date() }, { merge: true });

        return {
            txnId: txnRes.id,
            status: "success",
        };
    }

    catch (e) {
        throw e;
    }

}
