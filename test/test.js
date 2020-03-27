( ( exports ) => {
'use strict';

const AbortController = ( typeof this.AbortController == 'undefined' ) ? require( 'abortcontroller-polyfill/dist/cjs-ponyfill' ).AbortController : this.AbortController;

const
    debug_mode = false,
    
    process_controller = new class {
        constructor() {
            this.reset();
            
            if ( typeof DOMException != 'undefined' ) {
                this._AbortException = class extends DOMException {
                    constructor( message = 'The user aborted a request.', ...params ) {
                        super( message, 'AbortError', ...params );
                    }
                };
            }
            else {
                this._AbortException = class extends Error {
                    constructor( message = 'The user aborted a request.', ...params ) {
                        super( message, ...params );
                        this.name = 'AbortError';
                    }
                };
            }
        }
        
        get is_canceled() {
            return this._is_canceled;
        }
        
        get abort_signal() {
            return this._abort_signal;
        }
        
        reset() {
            this._abort_controller = new AbortController();
            this._abort_signal = this._abort_controller.signal;
            this._is_canceled = false;
        }
        
        cancel() {
            this._is_canceled = true;
            this._abort_controller.abort();
        }
        
        abort_exception( message ) {
            return new this._AbortException( message );
        }
        
        abort_if_canceled( message ) {
            if ( this.is_canceled ) {
                throw this.abort_exception( message );
            }
        }
    }(),
    
    test_promise_function = function ( index )  {
        return new Promise( ( resolve, reject ) => {
            let timeout_sec = 1 + index % 10;
            
            if ( process_controller.is_canceled ) {
                console.log( new Date().toISOString(), 'Promise<IGNORED>: index=', index, 'timeout_sec=', timeout_sec );
                reject( process_controller.abort_exception() );
                return;
            }
            
            let begin_time = Date.now(),
                
                timer_id = setTimeout( () => {
                    timer_id = null;
                    remove_event_listener();
                    
                    let end_time = Date.now();
                    
                    console.log( new Date( end_time ).toISOString(), 'Promise-END: index=', index, 'timeout_sec=', timeout_sec );
                    resolve( {
                        index : index,
                        timeout_sec: timeout_sec,
                        begin_time : begin_time,
                        end_time : end_time,
                        elapsed_time : end_time - begin_time,
                    } );
                }, timeout_sec * 1000 ),
                
                abort_signal = process_controller.abort_signal,
                
                on_abort = ( event ) => {
                    console.log( new Date().toISOString(), 'Promise<CANCELED>: index=', index, 'timeout_sec=', timeout_sec );
                    remove_event_listener();
                    reject( process_controller.abort_exception() );
                },
                
                remove_event_listener = () => {
                    if ( timer_id ) {
                        clearTimeout( timer_id );
                        timer_id = null;
                    }
                    abort_signal.removeEventListener( 'abort', on_abort );
                };
                
            
            console.log( new Date( begin_time ).toISOString(), 'Promise-BEGIN: index=', index, 'timeout_sec=', timeout_sec );
            
            abort_signal.addEventListener( 'abort', on_abort );
        } );
    },
    
    run = async ( target_module, total_promise_number = 100, max_concurrent_worker = 10 ) => {
        process_controller.reset();
        
        const 
            promise_functions = Array( total_promise_number ).fill().map( ( _, index ) => test_promise_function.bind( null, index ) );
        
        let begin_time = Date.now();
        
        console.log( new Date( begin_time ).toISOString(), 'TEST BEGIN: total_promise_number=', total_promise_number, 'max_concurrent_worker=', max_concurrent_worker );
        
        let result_info = await target_module.execute( promise_functions, max_concurrent_worker ),
            end_time = Date.now();
        
        if ( exports.debug_mode ) {
            console.log( 'result_info:', result_info );
        }
        
        console.log( new Date( end_time ).toISOString(), 'TEST END: total_promise_number=', total_promise_number, 'max_concurrent_worker=', max_concurrent_worker );
        console.log( 'elapsed time:', ( end_time - begin_time ) / 1000.0, 'sec' );
        if ( process_controller.is_canceled ) {
            console.log( '(*) test has been canceled' );
        }
    },
    
    cancel = () => {
        console.log( '*** cancel request ***' );
        process_controller.cancel();
    };


Object.assign( exports, {
    run : run,
    cancel : cancel,
    debug_mode : debug_mode,
} );


} )( ( typeof exports != 'undefined' ) ? exports : ( ( typeof window != 'undefined' ) ? window : this )[ 'test' ] = {} );
