
# lowdb-ts
original project and docs at : http://typicode.github.io/lowdb/

changes on ts branch

> The idea is to let tsc generate the definion file instead of creating one by hand

> So far is almost a 1:1 of the original project , only differs on the building process, and type annotations



    build:
        npm run build

    test:
        npm run test

    use:
        npm install git+https://github.com/D10221/lowdb.git#ts


status: _unfit for human consumption_

Diff:
- removed: babel-node for tests (node v6 is ok with existing es6 features but async/await), thats why is compiled to preserve the original tests
- extra step to buil test (...wip)
- removed dependency from 'is-promise'
- clash between 'typescript imports' and require('xxx')
   resolved exporting  low ,
   it breaks usage but is cleaner from Typescript

ex:

        var low = require('lowdb);

becomes

    import {low} from 'lowdb'
or..

    import * as lowdb from 'lowdb'
    lowdb.low()



