import {LowStorage} from "./lowdb";

const steno = require('steno');

const {stringify} = require('./json');



module.exports = {

    read: (require('./file-sync') as LowStorage<any>).read,

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
