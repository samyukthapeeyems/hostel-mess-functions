import PaytmChecksum from "paytmchecksum";
import axios from "axios";
import functions from "firebase-functions";

const PAYTM_MERCHANT_KEY = "SFXi_T7ThBtJ5UKQ";
const PAYTM_MERCHANT_ID = "xZhVnv93110728543806";

async function generateCheckSum(body) {
  let paytmChecksum = await PaytmChecksum.generateSignature(
    body,
    PAYTM_MERCHANT_KEY
  );
  return paytmChecksum;
}

function isCheckSumValid(body, checksum) {
  var isVerifySignature = PaytmChecksum.verifySignature(
    body,
    PAYTM_MERCHANT_KEY,
    checksum
  );
  if (isVerifySignature) {
    return true;
  } else {
    return false;
  }
}

export async function initiateTransaction(oid, amount, uid) {
  let paytmParams = {};

  paytmParams.body = {
    requestType: "Payment",
    mid: PAYTM_MERCHANT_ID,
    websiteName: "WEBSTAGING",
    orderId: oid,
    txnAmount: {
      value: amount.toFixed(2).toString(),
      currency: "INR",
    },
    userInfo: {
      custId: uid,
    },
  };

  paytmParams.head = {
    signature: await generateCheckSum(JSON.stringify(paytmParams.body)),
  };

  try {
    const result = await axios.post(
      `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${PAYTM_MERCHANT_ID}&orderId=${oid}`,
      paytmParams
    );
    functions.logger.log(result);

    if (result.data) functions.logger.log(result.data);

    if (result.data.body.resultInfo.resultStatus === "F")
      throw new Error(
        JSON.stringify({
          status: "Failed",
          statusMessage: result.data.body.resultInfo.resultMsg,
        })
      );
    return result.data.body;
  } catch (e) {
    functions.logger.log("Error occured while generating transaction token", e);
    throw e;
  }
}

async function verifyTransaction(oid) {
  let paytmParams = {
    body: {
      orderId: oid,
      mid: PAYTM_MERCHANT_ID,
    },
  };
  paytmParams.head = {
    signature: await generateSignature(JSON.stringify(paytmParams.body)),
  };

  try {
    const result = await axios.post(
      `https://securegw-stage.paytm.in/v3/order/status`,
      paytmParams
    );
    functions.logger.log(result.data);
  } catch (e) {
    throw e;
  }
}
