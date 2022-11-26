import PaytmChecksum, { generateSignature } from 'paytmchecksum';
import axios from 'axios';

const PAYTM_MERCHANT_KEY = ''
const PAYTM_MERCHANT_ID = ''


async function generateCheckSum(body) {
    let paytmChecksum = await PaytmChecksum.generateSignature(body, PAYTM_MERCHANT_KEY);
    return paytmChecksum
}

function isCheckSumValid(body, checksum) {
    var isVerifySignature = PaytmChecksum.verifySignature(body, PAYTM_MERCHANT_KEY, paytmChecksum);
    if (isVerifySignature) {
        return true
    } else {
        return false
    }

}

async function initiateTransaction(oid, amount, uid) {

    let paytmParams = {};
   
    paytmParams.body = {
        requestType: "Payment",
        mid: PAYTM_MERCHANT_ID,
        websiteName: "WEBSTAGING",
        orderId: oid,
        txnAmount: {

            value: (amount.toFixed(2)).toString(),
            currency: "INR",
        },
        userInfo: {
            custId: uid,
        },
    };

    paytmParams.head = {
        signature : await generateSignature(JSON.stringify(paytmParams.body))
    }

    try{
        const result = axios.post("")
    }
    catch(e){

    }
}
