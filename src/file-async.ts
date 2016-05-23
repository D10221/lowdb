
import {LowStorage} from "./interfaces";

import {storage as storageSync} from './file-sync'

const steno = require('steno');

const {stringify} = require('./json');

export var storage = {

    read: storageSync.read ,

    write: (dest, obj, serialize = stringify) => {

        return new Promise((resolve, reject) => {

            const data = serialize(obj);

            steno.writeFile(dest, data, (err) => {
                if (err) return reject(err);
                resolve()
            })
        })
    }
} as LowStorage<any>;
