const fs = require('fs');
const path = require('path');
const test = require('tape');
const tempfile = require('tempfile');
var low = require('../dist/lowdb').low;
const storage = require('../built/file-sync').storage;

test('write', (t) => {
  const filename = tempfile();
  console.log(low);
  const db = low(filename, { storage });
  console.log(db);
  db('foo').push(1);

  const actual = JSON.parse(fs.readFileSync(filename));
  t.same(actual, { foo: [1] });
  t.end()
});

test('read', (t) => {
  const filename = path.join(__dirname, 'fixtures/db.json');
  const db = low(filename, { storage });
  t.same(db.object, { foo: [1] });
  t.end()
});
