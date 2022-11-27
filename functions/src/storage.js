import { getStorage } from 'firebase-admin/storage';

export async function setMetadata(metadataObj, path){
    if(typeof metadataObj !== "object" && typeof path !== "string"){
        throw new Error("invalid params");
    }
    const storage = getStorage();
    let pathArr = path.split(/\//); 
    try{
        let result = await storage.bucket(pathArr[0]).file(pathArr[1]).setMetadata(metadataObj);
        return result;
    }
    catch(e){
        console.log(e);
        throw e
    }
}