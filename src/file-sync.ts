import {LowStorage} from "./lowdb";

const fs = require('graceful-fs') as GracefulFs;

const {parse, stringify} = require('./json');


/***
 *
 */
module.exports = {
    /***
     *
     */
    read: function<T>(source, deserialize = parse):T {
        if (fs.existsSync(source)) {
            // Read database
            const data = fs.readFileSync(source, 'utf-8').trim() || '{}';

            try {
                return deserialize(data) as T
            } catch (e) {
                if (e instanceof SyntaxError) {
                    e.message = `Malformed JSON in file: ${source}\n${e.message}`
                }
                throw e
            }
        } else {
            // Initialize empty database
            fs.writeFileSync(source, '{}');
            return {} as T;
        }
    },
    write: (dest, obj, serialize = stringify) => {
        const data = serialize(obj);
        fs.writeFileSync(dest, data)
    }
} as LowStorage<any>;
