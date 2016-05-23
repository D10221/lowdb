const test = require('tape')
var low = require('../dist/lowdb').low;

test('mixin', t => {
  const db = low()
  db._.mixin({ hello: (array, word) => array.push('hello ' + word) })

  // Test short syntax
  db('msg').hello('world')
  t.same(db.object.msg, [ 'hello world' ])

  // Test chaining
  db.object.msg = []
  db('msg').chain().hello('world').value()
  t.same(db.object.msg, [ 'hello world' ])

  t.end()
})
