"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const test = require('tape');
const sinon = require('sinon');
const index_1 = require('../built/index');
const _test = (str, source, storage, promise, writeOnChange) => {
    test(str, function (t) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let db;
                if (source) {
                    db = promise
                        ? yield index_1.low(source, storage, writeOnChange)
                        : index_1.low(source, storage, writeOnChange);
                }
                else {
                    db = index_1.low();
                }
                let users = db('users');
                // db('').value() should always return a value (Fix #82)
                if (promise)
                    t.deepEqual(users.value(), []);
                // short syntax
                let [foo] = promise
                    ? yield users.push('foo')
                    : users.push('foo');
                t.is(foo, 'foo');
                t.is(users.value().length, 1);
                if (storage && storage.write) {
                    let count = writeOnChange ? 1 : 0;
                    t.is(storage.write.callCount, count);
                }
                // chain syntax
                let chain = users.chain().push('bar');
                let [, bar] = promise
                    ? yield chain.value()
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
                        ? yield db.write()
                        : db.write();
                    count = writeOnChange ? 3 : 1;
                    t.is(storage.write.callCount, count);
                    // write dest
                    promise
                        ? yield db.write('backup.json')
                        : db.write('backup.json');
                    // get last write call
                    let args = storage.write.args.slice(-1)[0];
                    t.same(args, ['backup.json', {}, undefined]);
                }
                if (storage && storage.read) {
                    // read
                    promise
                        ? yield db.read()
                        : db.read();
                    t.is(storage.read.callCount, 2);
                    promise
                        ? yield db.read('backup.json')
                        : db.read('backup.json');
                    let args = storage.read.args.slice(-1)[0];
                    t.same(args, ['backup.json', undefined]);
                }
                t.end();
            }
            catch (err) {
                t.end(err);
            }
        });
    });
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
//# sourceMappingURL=index.js.map