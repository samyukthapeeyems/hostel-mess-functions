import { getStorage } from 'firebase-admin/storage';
import { JWT } from 'google-auth-library'


export async function setMetadata(metadataObj, path){
    if(typeof metadataObj !== "object" && typeof path !== "string"){
        throw new Error("invalid params");
    }
    const storage = getStorage();

    let pathArr = path.split(/\//); 
    try{
        let result = await storage.bucket().file(path).setMetadata(metadataObj);
    
        return result;
    }
    catch(e){
        functions.logger.log(error);
        throw e;
    }
}


// upload ITEM BUNDLE to Firebase Hosting
export async function uploadBundle(file, hash , keys) {

    const client = new JWT({
        email: keys.client_email,
        key: keys.private_key,
        scopes: [ 'https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase','https://www.googleapis.com/auth/firebase.hosting'],
    });

    try {
        const baseUrl = `https://firebasehosting.googleapis.com/v1beta1/`
        const SITE_ID = 'hostel-mess-5d9a7'
        let createVersionURL = `sites/${SITE_ID}/versions`;

        let result = {}

        result = await client.request({
            baseURL: baseUrl,
            url: createVersionURL,
            method: "POST"
        });

        let version = result.data.name

        let populateFileURL = `${version}:populateFiles`

        result = await client.request({
            baseURL: baseUrl,
            url: populateFileURL,
            method: "POST",
            body: JSON.stringify({
                files: {
                    "/bundle": hash
                }
            })
        });

        let uploadURL = `${result.data.uploadUrl}/${hash}`

        console.log(uploadURL);

        result = await client.request({
            url: uploadURL,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            method: "POST",
            body: file
        });

        result = await client.request({
            baseURL: baseUrl,
            url: `${version}?update_mask=status`,
            method: "PATCH",
            body: JSON.stringify({
                status: "FINALIZED"
            })
        });


        result = await client.request({
            baseURL: baseUrl,
            url: `sites/${SITE_ID}/releases?versionName=${version}`,
            method: "POST",
        });

        return {
            status: "200"
        }

    } catch (error) {
        functions.logger.log(error);
        throw e;
    }
}