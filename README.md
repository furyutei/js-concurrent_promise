[js-concurrent_promise](https://github.com/furyutei/js-concurrent_promise)
==========================================================================

- License: The MIT license  
- Copyright (c) 2020 furyu @furyutei  
- Target: Browser(Google Chrome, Firefox), Node.js

Parallel processing module for JavaScript that can specify the number of concurrent executions.  

Module
---

- [concurrent_promise.js](http://furyutei.github.io/js-concurrent_promise/src/js/concurrent_promise.js)  


Usage
---

```javascript
let result_info = await concurrent_promise.execute(
        promise_function_array, // Array of functions that return Promise (Note: it's not Promise itself)
        max_concurrent_worker // Max concurrent Promise number (default: 10)
    );
//  result_info = {
//      promise_results : <Array of results for each Promise>,
//      success_list : <Array of successful Promise results>,
//      failure_list : <Array of failed Promise results>,
//  }
```


Trial
---
### Browser

Open [the test page](http://furyutei.github.io/js-concurrent_promise/test/test.html) in your browser and follow the instructions to run it.  


### Node.js

#### Install

```sh
$ cd js-concurrent_promise
$ yarn install
```

#### Examples

```sh
$ node -i
```

```javascript
// [load modules]
const { concurrentPromise, concurrent_promise, test } = require( './test/node_test.js' );

// [run]
//   test.run( target_module, promise_number, max_concurrent_worker );

// target_module = concurrentPromise: simple version (run Promise.all with each max_concurrent_worker)
test.run( concurrentPromise, 100, 10 );

// target_module = concurrent_promise: efficiency improvement version
test.run( concurrent_promise, 100, 10 );

// [cancel]
test.cancel();

```
