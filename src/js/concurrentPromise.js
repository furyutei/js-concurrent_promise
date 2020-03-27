( ( exports ) => {
'use srict';

// Reference: [Promise.allの並列処理数を規定する関数を15行でサクッと実装する - Qiita](https://qiita.com/ttiger55/items/3f7732f19fe927d1bf0a)
const
    execute = async ( promise_functions, max_concurrent_worker = 10 ) => {
        let results = [],
            current_index = 0;
        
        while ( true ) {
            let promise_functions_chunk = promise_functions.slice( current_index, current_index + max_concurrent_worker );
            
            if ( promise_functions_chunk.length == 0 ) {
                break;
            }
            
            results = results.concat( await Promise.all( promise_functions_chunk.map( promise_function => promise_function().catch( result => result ) ) ) );
            current_index += max_concurrent_worker;
        }
        return {
            promise_results : results,
        };
    };

Object.assign( exports, {
    execute : execute,
} );

} )( ( typeof exports != 'undefined' ) ? exports : ( ( typeof window != 'undefined' ) ? window : this )[ 'concurrentPromise' ] = {} );
