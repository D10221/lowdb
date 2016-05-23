import * as test from 'tape';

import * as sinon from 'sinon';

import {low} from '../built/index'

const _test = (str?, source?, storage?, promise?, writeOnChange?) => {

    test(str, async function (t) {
        try {

            let db;

            if (source) {
                db = promise
                    ? await low(source, storage, writeOnChange)
                    : low(source, storage, writeOnChange)
            } else {
                db = low()
            }

            let users = db('users');

            // db('').value() should always return a value (Fix #82)
            if (promise) t.deepEqual(users.value(), []);

            // short syntax
            let [ foo ] = promise
                ? await users.push('foo')
                : users.push('foo');

            t.is(foo, 'foo');
            t.is(users.value().length, 1);

            if (storage && storage.write) {
                let count = writeOnChange ? 1 : 0;
                t.is(storage.write.callCount, count)
            }

            // chain syntax
            let chain = users.chain().push('bar');
            let [, bar ] = promise
                ? await chain.value()
                : chain.value();

            t.is(bar, 'bar');
            t.is(users.value().length, 2);

            if (storage && storage.write) {
                let count;

                count = writeOnChange ? 2 : 0;
                t.is(storage.write.callCount, count);

                db.object = {};

                // write
                promise
                    ? await db.write()
                    : db.write();

                count = writeOnChange ? 3 : 1;
                t.is(storage.write.callCount, count);

                // write dest
                promise
                    ? await db.write('backup.json')
                    : db.write('backup.json');

                // get last write call
                let args = storage.write.args.slice(-1)[0];
                t.same(args, ['backup.json', {}, undefined])
            }

            if (storage && storage.read) {
                // read
                promise
                    ? await db.read()
                    : db.read();

                t.is(storage.read.callCount, 2);

                promise
                    ? await db.read('backup.json')
                    : db.read('backup.json');

                let args = storage.read.args.slice(-1)[0];
                t.same(args, ['backup.json', undefined])
            }

            t.end()
        } catch (err) {
            t.end(err)
        }
    })
};

_test('in-memory');
_test('sync', {
    source: 'db.json',
    read: sinon.spy(() => ({})),
    write: sinon.spy(),
    writeOnChange: true
});
_test('promises', {
    source: 'db.json',
    read: sinon.spy(() => Promise.resolve({})),
    write: sinon.spy(() => Promise.resolve()),
    promise: true,
    writeOnChange: true
});
_test('read-only', {
    source: 'db.json',
    read: sinon.spy(() => ({})),
    writeOnChange: true
});
_test('write-only', {
    source: 'db.json',
    write: sinon.spy(),
    writeOnChange: true
});
_test('writeOnChange = false', {
    source: 'db.json',
    write: sinon.spy(),
    writeOnChange: false
});
