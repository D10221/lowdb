import * as lodash from 'lodash';

var isPromise = require('is-promise') as IsPromise;

import LoDashExplicitWrapper = _.LoDashExplicitWrapper;

import {LowStorage, LowChain, LowOptions} from "./lowdb";

import LoDashStatic = _.LoDashStatic;


// Returns a lodash chain that calls .value()
// automatically after the first .method()
//
// It also returns a promise or value
//
// For example:
// lowChain(_, array, save).method()
//
// is the same as:
// _.chain(array).method().value()
function lowChain<T>(_, array:T[], save): LowChain<T> {

    const chain = _.chain(array);

    _.functionsIn(chain)
        .forEach(method => {
            chain[method] = _.flow(chain[method], arg => {
                let v;
                if (arg) {
                    v = _.isFunction(arg.value) ? arg.value() : arg
                }

                const s = save();

                if (s) return s.then(() => Promise.resolve(v));
                return v
            })
        });

    return chain
}

function low<T>(source: string,
                    options:LowOptions = {},
                    writeOnChange = true) : LowChain<T>|Promise<LowChain<T>> {

    // Create a fresh copy of lodash
    const _ = lodash.runInContext();

    var db :LowChain<T> = function (key) : LowChain<T>  {

        if (typeof db.object[key] === 'undefined') {
            db.object[key] = []
        }

        let array = db.object[key];
        let short = lowChain(_, array, _save) as any;
        short.chain = () => _.chain(array);
        // Prevents db.write being called when just calling db('foo').value()
        short.value = () => db.object[key];

        return <LowChain<T>>short

    } as LowChain<T> ;

    // Expose
    db._ = _;
    db.object = {} as T;
    db.source = source;

    if (source) {

        if (options.storage) {

            const {storage} = options;

            if (storage.read) {

                db.read = (s = source) : Promise<LowChain<T>> | LowChain<T> => {

                    const res = storage.read(s, db.deserialize);

                    if (isPromise(res)) {
                        return (res as Promise<T>).then((obj) => {
                            db.object = obj;
                            db._checksum = JSON.stringify(db.object);

                            return db
                        })
                    }

                    db.object = res;
                    db._checksum = JSON.stringify(db.object);

                    return db
                };
                
            }

            if (storage.write) {
                db.write = (dest = source) => storage.write(dest, db.object, db.serialize)
            }
        }

        if (options.format) {
            const {format} = options;
            db.serialize = format.serialize;
            db.deserialize = format.deserialize
        }

    }

    // Modify value function to call save before returning result
    _.prototype.value = _.wrap(_.prototype.value, function (value) {
        const v = value.apply(this);
        const s = _save();

        if (s) return s.then(() => Promise.resolve(v));
        return v
    });

    // Return a promise or nothing in sync mode or if the database hasn't changed
    function _save() : Promise<{}> {

        if (db.source && db.write && writeOnChange) {
            const str = JSON.stringify(db.object);

            if (str !== db._checksum) {
                db._checksum = str;
                return db.write(db.source, db.object) as Promise<{}>;
            }
        }
        return null;
    }


    // Init
    if (db.read) {
        return db.read() as LowChain<T>
    } else {
        return db as LowChain<T>
    }
}

module.exports = low;