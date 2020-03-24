( ( exports ) => {
'use strict';

Object.assign( exports, {
    concurrentPromise : require( '../src/js/concurrentPromise.js' ),
    concurrent_promise : require( '../src/js/concurrent_promise.js' ),
    test : require( './test.js' ),
} );

} )( ( typeof exports != 'undefined' ) ? exports : this[ 'node_test' ] = {} );
