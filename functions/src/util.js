import { createHash } from 'crypto';

import { createGzip } from 'zlib';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream'
import { createWriteStream } from 'fs';
import os from 'node:os'
import path from 'path';

export function _date() {
    let _dateObj = {}
    _dateObj.currentDate = new Date();
    _dateObj.firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    _dateObj.lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return _dateObj;
}

export function generateSHA256(file) {
    return createHash("sha256").update(file).digest("hex")
}



// compress bundle and write to file
export async function compressBundle(bundle) {
    let inputStream = new Readable.from(bundle);
    let filePath = path.join(os.tmpdir(), "bundle.txt.gz");
    let outputStream = createWriteStream(filePath)
    try {
        await pipeline(
            inputStream,
            createGzip(),
            outputStream
        )
    }
    catch (e) {
        console.log(e)
        throw e;
    }
}