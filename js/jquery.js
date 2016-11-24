/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				script = document.createElement( "script" );

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			var tmp = array.indexOf( elem );
			return (typeof tmp == 'undefined') ? -1 : tmp;
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						// We have to add a catch block for
						// IE prior to 8 or else the finally
						// block will never get executed
						catch (e) {
							throw e;
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var lastIndex = arguments.length,
			deferred = lastIndex <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( lastIndex > 1 ) {
			var array = slice.call( arguments, 0 ),
				count = lastIndex,
				iCallback = function( index ) {
					return function( value ) {
						array[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
						if ( !( --count ) ) {
							deferred.resolveWith( promise, array );
						}
					};
				};
			while( ( lastIndex-- ) ) {
				object = array[ lastIndex ];
				if ( object && jQuery.isFunction( object.promise ) ) {
					object.promise().then( iCallback(lastIndex), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( promise, array );
			}
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		noCloneEvent: true,
		noCloneChecked: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	input.checked = true;
	jQuery.support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	var _scriptEval = null;
	jQuery.support.scriptEval = function() {
		if ( _scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				_scriptEval = true;
				delete window[ id ];
			} else {
				_scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return _scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery._data( elem, "handle" );

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, "events");

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent !== document && !parent.parentNode ) {
			return;
		}
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			},
			teardown: function() {
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ),
			length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		var pos = POS.test( selectors ) ?
			jQuery( selectors, context || this.context ) : null;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique(ret) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes(src, dest) {
	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	var nodeName = dest.nodeName.toLowerCase();

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	dest.clearAttributes();

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	dest.mergeAttributes(src);

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );
	
	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		// Return the cloned set
		return clone;
},
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, "<$1></$2>");

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// Make sure that NaN and null values aren't set. See: #7116
			if ( typeof value === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
}

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /(?:^file|^widget|\-extension):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rucHeaders = /(^|\-)([a-z])/g,
	rucHeadersFunc = function( _, $1, $2 ) {
		return $1 + $2.toUpperCase();
	},
	rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from document.location if document.domain has been set
try {
	ajaxLocation = document.location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() );

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

//Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
} );

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		crossDomain: null,
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						requestHeaders[ name.toLowerCase().replace( rucHeaders, rucHeadersFunc ) ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( !s.crossDomain ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			requestHeaders[ "Content-Type" ] = s.contentType;
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				requestHeaders[ "If-Modified-Since" ] = jQuery.lastModified[ ifModifiedKey ];
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				requestHeaders[ "If-None-Match" ] = jQuery.etag[ ifModifiedKey ];
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		requestHeaders.Accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
			s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
			s.accepts[ "*" ];

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// If we see an array here, it is empty and should be treated as an empty
		// object
		if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			for ( var name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|()\?\?()/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var dataIsString = ( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonpCallback ||
		originalSettings.jsonp != null ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				dataIsString && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2",
			cleanUp = function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( previous ) ) {
					window[ jsonpCallback ]( responseContainer[ 0 ] );
				}
			};

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( dataIsString ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Install cleanUp function
		jqXHR.then( cleanUp, cleanUp );

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
} );




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
} );




var // #5280: next active xhr id and list of active xhrs' callbacks
	xhrId = jQuery.now(),
	xhrCallbacks,

	// XHR used to determine supports properties
	testXHR;

// #5280: Internet Explorer will keep connections alive if we don't abort on unload
function xhrOnUnloadAbort() {
	jQuery( window ).unload(function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Test if we can create an xhr object
testXHR = jQuery.ajaxSettings.xhr();
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
testXHR = undefined;

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// Requested-With header
					// Not set for crossDomain requests with no content
					// (see why at http://trac.dojotoolkit.org/ticket/9486)
					// Won't change header if already provided
					if ( !( s.crossDomain && !s.hasContent ) && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									delete xhrCallbacks[ handle ];
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						// Create the active xhrs callbacks list if needed
						// and attach the unload handler
						if ( !xhrCallbacks ) {
							xhrCallbacks = {};
							xhrOnUnloadAbort();
						}
						// Add to list of active xhrs callbacks
						handle = xhrId++;
						xhr.onreadystatechange = xhrCallbacks[ handle ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery._data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
					jQuery._data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur();

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || ( jQuery.cssNumber[ name ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;

		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


window.jQuery = window.$ = jQuery;
})(window);

/*!
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery hashchange event
//
// *Version: 1.2, Last updated: 2/11/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (1.1kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrate one way
// in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and robust,
// there are a few unfortunate browser bugs surrounding expected hashchange
// event-based behaviors, independent of any JavaScript window.onhashchange
// abstraction. See the following examples for more information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// About: Release History
// 
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Method / object references.
  var fake_onhashchange,
    jq_event_special = $.event.special,
    
    // Reused strings.
    str_location = 'location',
    str_hashchange = 'hashchange',
    str_href = 'href',
    
    // IE6/7 specifically need some special love when it comes to back-button
    // support, so let's do a little browser sniffing..
    browser = $.browser,
    mode = document.documentMode,
    is_old_ie = browser.msie && ( mode === undefined || mode < 8 ),
    
    // Does the browser support window.onhashchange? Test for IE version, since
    // IE8 incorrectly reports this when in "IE7" or "IE8 Compatibility View"!
    supports_onhashchange = 'on' + str_hashchange in window && !is_old_ie;
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || window[ str_location ][ str_href ];
    return url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Property: jQuery.hashchangeDelay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 100.
  
  $[ str_hashchange + 'Delay' ] = 100;
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // window.onhashchange event is used (IE8, FF3.6), otherwise a polling loop is
  // initialized, running every <jQuery.hashchangeDelay> milliseconds to see if
  // the hash has changed. In IE 6 and 7, a hidden Iframe is created to allow
  // the back button and hash-based history to work.
  // 
  // Usage:
  // 
  // > $(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one callback
  //   is actually bound to 'hashchange'.
  // * If you need the bound callback(s) to execute immediately, in cases where
  //   the page 'state' exists on page load (via bookmark or page refresh, for
  //   example) use $(window).trigger( 'hashchange' );
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a $(document).ready() callback.
  
  jq_event_special[ str_hashchange ] = $.extend( jq_event_special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      iframe,
      set_history,
      get_history;
    
    // Initialize. In IE 6/7, creates a hidden Iframe for history handling.
    function init(){
      // Most browsers don't need special methods here..
      set_history = get_history = function(val){ return val; };
      
      // But IE6/7 do!
      if ( is_old_ie ) {
        
        // Create hidden Iframe after the end of the body to prevent initial
        // page load from scrolling unnecessarily.
        iframe = $('<iframe src="javascript:0"/>').hide().insertAfter( 'body' )[0].contentWindow;
        
        // Get history by looking at the hidden Iframe's location.hash.
        get_history = function() {
          return get_fragment( iframe.document[ str_location ][ str_href ] );
        };
        
        // Set a new history item by opening and then closing the Iframe
        // document, *then* setting its location.hash.
        set_history = function( hash, history_hash ) {
          if ( hash !== history_hash ) {
            var doc = iframe.document;
            doc.open().close();
            doc[ str_location ].hash = '#' + hash;
          }
        };
        
        // Set initial history.
        set_history( get_fragment() );
      }
    };
    
    // Start the polling loop.
    self.start = function() {
      // Polling loop is already running!
      if ( timeout_id ) { return; }
      
      // Remember the initial hash so it doesn't get triggered immediately.
      var last_hash = get_fragment();
      
      // Initialize if not yet initialized.
      set_history || init();
      
      // This polling loop checks every $.hashchangeDelay milliseconds to see if
      // location.hash has changed, and triggers the 'hashchange' event on
      // window when necessary.
      (function loopy(){
        var hash = get_fragment(),
          history_hash = get_history( last_hash );
        
        if ( hash !== last_hash ) {
          set_history( last_hash = hash, history_hash );
          
          $(window).trigger( str_hashchange );
          
        } else if ( history_hash !== last_hash ) {
          window[ str_location ][ str_href ] = window[ str_location ][ str_href ].replace( /#.*/, '' ) + '#' + history_hash;
        }
        
        timeout_id = setTimeout( loopy, $[ str_hashchange + 'Delay' ] );
      })();
    };
    
    // Stop the polling loop, but only if an IE6/7 Iframe wasn't created. In
    // that case, even if there are no longer any bound event handlers, the
    // polling loop is still necessary for back/next to work at all!
    self.stop = function() {
      if ( !iframe ) {
        timeout_id && clearTimeout( timeout_id );
        timeout_id = 0;
      }
    };
    
    return self;
  })();
  
})(jQuery,this);

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
    if ( event.detail     ) { delta = -event.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return $.event.handle.apply(this, args);
}

})(jQuery);
/*
 * nyroModal - jQuery Plugin
 * http://nyromodal.nyrodev.com
 *
 * Copyright (c) 2010 Cedric Nirousset (nyrodev.com)
 * Licensed under the MIT license
 *
 * $Date: 2010-02-15 (Mon, 15 Feb 2010) $
 * $version: 1.6.1
 */
jQuery(function($) {

    // -------------------------------------------------------
    // Private Variables
    // -------------------------------------------------------

    var userAgent = navigator.userAgent.toLowerCase();
    var browserVersion = (userAgent.match(/.+(?:rv|webkit|khtml|opera|msie)[\/: ]([\d.]+)/) || [0, '0'])[1];

    var isIE6 = (/msie/.test(userAgent) && !/opera/.test(userAgent) && parseInt(browserVersion) < 7 && (!window.XMLHttpRequest || typeof (XMLHttpRequest) === 'function'));
    var body = $('body');

    var currentSettings;
    var callingSettings;

    var shouldResize = false;

    var gallery = {};

    // To know if the fix for the Issue 10 should be applied (or has been applied)
    var fixFF = false;

    // Used for retrieve the content from an hidden div
    var contentElt;
    var contentEltLast;

    // Contains info about nyroModal state and all div references
    var modal = {
        started: false,
        ready: false,
        dataReady: false,
        anim: false,
        animContent: false,
        loadingShown: false,
        transition: false,
        resizing: false,
        closing: false,
        error: false,
        blocker: null,
        blockerVars: null,
        full: null,
        bg: null,
        loading: null,
        tmp: null,
        content: null,
        wrapper: null,
        contentWrapper: null,
        scripts: new Array(),
        scriptsShown: new Array()
    };

    // Indicate of the height or the width was resized, to reinit the currentsettings related to null
    var resized = {
        width: false,
        height: false,
        windowResizing: false
    };

    var initSettingsSize = {
        width: null,
        height: null,
        windowResizing: true
    };

    var windowResizeTimeout;


    // -------------------------------------------------------
    // Public function
    // -------------------------------------------------------

    // jQuery extension function. A paramater object could be used to overwrite the default settings
    $.fn.nyroModal = function(settings) {
        if (!this)
            return false;
        return this.each(function() {
            var me = $(this);
            if (this.nodeName.toLowerCase() == 'form') {
                me
				.unbind('submit.nyroModal')
				.bind('submit.nyroModal', function(e) {
				    if (e.isDefaultPrevented())
				        return false;
				    if (me.data('nyroModalprocessing'))
				        return true;
				    if (this.enctype == 'multipart/form-data') {
				        processModal($.extend(settings, {
				            from: this
				        }));
				        return true;
				    }
				    e.preventDefault();
				    processModal($.extend(settings, {
				        from: this
				    }));
				    return false;
				});
            } else {
                me
				.unbind('click.nyroModal')
				.bind('click.nyroModal', function(e) {
				    if (e.isDefaultPrevented())
				        return false;
				    e.preventDefault();
				    processModal($.extend(settings, {
				        from: this
				    }));
				    return false;
				});
            }
        });
    };

    // jQuery extension function to call manually the modal. A paramater object could be used to overwrite the default settings
    $.fn.nyroModalManual = function(settings) {
        if (!this.length)
            processModal(settings);
        return this.each(function() {
            processModal($.extend(settings, {
                from: this
            }));
        });
    };

    $.nyroModalManual = function(settings) {
        processModal(settings);
    };

    // Update the current settings
    // object settings
    // string deep1 first key where overwrite the settings
    // string deep2 second key where overwrite the settings
    $.nyroModalSettings = function(settings, deep1, deep2) {
        setCurrentSettings(settings, deep1, deep2);
        if (!deep1 && modal.started) {
            if (modal.bg && settings.bgColor)
                currentSettings.updateBgColor(modal, currentSettings, function() { });

            if (modal.contentWrapper && settings.title)
                setTitle();

            if (!modal.error && (settings.windowResizing || (!modal.resizing && (('width' in settings && settings.width == currentSettings.width) || ('height' in settings && settings.height == currentSettings.height))))) {
                modal.resizing = true;
                if (modal.contentWrapper)
                    calculateSize(true);
                if (modal.contentWrapper && modal.contentWrapper.is(':visible') && !modal.animContent) {
                    if (fixFF)
                        modal.content.css({ position: '' });
                    currentSettings.resize(modal, currentSettings, function() {
                        currentSettings.windowResizing = false;
                        modal.resizing = false;
                        if (fixFF)
                            modal.content.css({ position: 'fixed' });
                        if ($.isFunction(currentSettings.endResize))
                            currentSettings.endResize(modal, currentSettings);
                    });
                }
            }
        }
    };

    // Remove the modal function
    $.nyroModalRemove = function() {
        removeModal();
    };

    // Go to the next image for a gallery
    // return false if nothing was done
    $.nyroModalNext = function() {
        var link = getGalleryLink(1);
        if (link)
            return link.nyroModalManual(getCurrentSettingsNew());
        return false;
    };

    // Go to the previous image for a gallery
    // return false if nothing was done
    $.nyroModalPrev = function() {
        var link = getGalleryLink(-1);
        if (link)
            return link.nyroModalManual(getCurrentSettingsNew());
        return false;
    };


    // -------------------------------------------------------
    // Default Settings
    // -------------------------------------------------------

    $.fn.nyroModal.settings = {
        debug: false, // Show the debug in the background

        blocker: false, // Element which will be blocked by the modal

        windowResize: true, // indicates if the modal should resize when the window is resized

        modal: false, // Esc key or click backgrdound enabling or not

        type: '', // nyroModal type (form, formData, iframe, image, etc...)
        forceType: null, // Used to force the type
        from: '', // Dom object where the call come from
        hash: '', // Eventual hash in the url

        processHandler: null, // Handler just before the real process

        selIndicator: 'nyroModalSel', // Value added when a form or Ajax is sent with a filter content

        formIndicator: 'nyroModal', // Value added when a form is sent

        content: null, // Raw content if type content is used

        bgColor: '#000000', // Background color

        ajax: {}, // Ajax option (url, data, type, success will be overwritten for a form, url and success only for an ajax call)

        swf: { // Swf player options if swf type is used.
            wmode: 'transparent'
        },

        width: null, // default Width If null, will be calculate automatically
        height: null, // default Height If null, will be calculate automatically

        minWidth: 400, // Minimum width
        minHeight: 300, // Minimum height

        resizable: true, // Indicate if the content is resizable. Will be set to false for swf
        autoSizable: true, // Indicate if the content is auto sizable. If not, the min size will be used

        padding: 25, // padding for the max modal size

        regexImg: '/DownloadPicture-|/(Tool)?DownloadFile-.*\.(jpg|jpeg|png|tiff|gif|bmp)(&|$)|(\.(jpg|jpeg|png|tiff|gif|bmp)\s*$)', // Regex to find images
        addImageDivTitle: false, // Indicate if the div title should be inserted
        defaultImgAlt: 'Image', // Default alt attribute for the images
        setWidthImgTitle: true, // Set the width to the image title
        ltr: true, // Left to Right by default. Put to false for Hebrew or Right to Left language

        gallery: null, // Gallery name if provided
        galleryLinks: '<a href="#" class="nyroModalPrev">Prev</a><a href="#"  class="nyroModalNext">Next</a>', // Use .nyroModalPrev and .nyroModalNext to set the navigation link
        galleryCounts: galleryCounts, // Callback to show the gallery count
        galleryLoop: false, // Indicate if the gallery should loop

        zIndexStart: 900,

        cssOpt: { // Default CSS option for the nyroModal Div. Some will be overwritten or updated when using IE6
            bg: {
                position: 'absolute',
                overflow: 'hidden',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%'
            },
            wrapper: {
                position: 'absolute',
                top: '50%',
                left: '50%'
            },
            wrapper2: {
        },
        content: {
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-50px',
        marginLeft: '-50px'
    }
},

wrap: { // Wrapper div used to style the modal regarding the content type
    div: '<div class="wrapper"></div>',
    ajax: '<div class="wrapper"></div>',
    form: '<div class="wrapper"></div>',
    formData: '<div class="wrapper"></div>',
    image: '<div class="wrapperImg"></div>',
    swf: '<div class="wrapperSwf"></div>',
    iframe: '<div class="wrapperIframe"></div>',
    iframeForm: '<div class="wrapperIframe"></div>',
    manual: '<div class="wrapper"></div>'
},

closeButton: '<a href="#" class="nyroModalClose" id="closeBut" title="close">Close</a>', // Adding automaticly as the first child of #nyroModalWrapper

title: null, // Modal title
titleFromIframe: true, // When using iframe in the same domain, try to get the title from it

openSelector: '.nyroModal', // selector for open a new modal. will be used to parse automaticly at page loading
closeSelector: '.nyroModalClose', // selector to close the modal

contentLoading: '<a href="#" class="nyroModalClose">Cancel</a>', // Loading div content

errorClass: 'error', // CSS Error class added to the loading div in case of error
contentError: 'The requested content cannot be loaded.<br />Please try again later.<br /><a href="#" class="nyroModalClose">Close</a>', // Content placed in the loading div in case of error

handleError: null, // Callback in case of error

showBackground: showBackground, // Show background animation function
hideBackground: hideBackground, // Hide background animation function

endFillContent: null, // Will be called after filling and wraping the content, before parsing closeSelector and openSelector and showing the content
showContent: showContent, // Show content animation function
endShowContent: null, // Will be called once the content is shown
beforeHideContent: null, // Will be called just before the modal closing
hideContent: hideContent, // Hide content animation function

showTransition: showTransition, // Show the transition animation (a modal is already shown and a new one is requested)
hideTransition: hideTransition, // Hide the transition animation to show the content

showLoading: showLoading, // show loading animation function
hideLoading: hideLoading, // hide loading animation function

resize: resize, // Resize animation function
endResize: null, // Will be called one the content is resized

updateBgColor: updateBgColor, // Change background color animation function

endRemove: null // Will be called once the modal is totally gone
};

// -------------------------------------------------------
// Private function
// -------------------------------------------------------

// Main function
function processModal(settings) {
    if (modal.loadingShown || modal.transition || modal.anim)
        return;
    debug('processModal');
    modal.started = true;
    callingSettings = $.extend({}, settings);
    setDefaultCurrentSettings(settings);
    if (!modal.full)
        modal.blockerVars = modal.blocker = null;
    modal.error = false;
    modal.closing = false;
    modal.dataReady = false;
    modal.scripts = new Array();
    modal.scriptsShown = new Array();

    currentSettings.type = fileType();
    if (currentSettings.forceType) {
        if (!currentSettings.content)
            currentSettings.from = true;
        currentSettings.type = currentSettings.forceType;
        currentSettings.forceType = null;
    }

    if ($.isFunction(currentSettings.processHandler))
        currentSettings.processHandler(currentSettings);

    var from = currentSettings.from;
    var url = currentSettings.url;

    initSettingsSize.width = currentSettings.width;
    initSettingsSize.height = currentSettings.height;

    if (currentSettings.type == 'swf') {
        // Swf is transforming as a raw content
        setCurrentSettings({ overflow: 'visible' }, 'cssOpt', 'content');
        currentSettings.content = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + currentSettings.width + '" height="' + currentSettings.height + '"><param name="movie" value="' + url + '"></param>';
        var tmp = '';
        $.each(currentSettings.swf, function(name, val) {
            currentSettings.content += '<param name="' + name + '" value="' + val + '"></param>';
            tmp += ' ' + name + '="' + val + '"';
        });
        currentSettings.content += '<embed src="' + url + '" type="application/x-shockwave-flash" width="' + currentSettings.width + '" height="' + currentSettings.height + '"' + tmp + '></embed></object>';
    }

    if (from) {
        var jFrom = $(from).blur();
        if (currentSettings.type == 'form') {
            var data = $(from).serializeArray();
            data.push({ name: currentSettings.formIndicator, value: 1 });
            if (currentSettings.selector)
                data.push({ name: currentSettings.selIndicator, value: currentSettings.selector.substring(1) });
            showModal();
            $.ajax($.extend({}, currentSettings.ajax, {
                url: url,
                data: data,
                type: jFrom.attr('method') ? jFrom.attr('method') : 'get',
                success: ajaxLoaded,
                error: loadingError
            }));
            debug('Form Ajax Load: ' + jFrom.attr('action'));
        } else if (currentSettings.type == 'formData') {
            // Form with data. We're using a hidden iframe
            initModal();
            jFrom.attr('target', 'nyroModalIframe');
            jFrom.attr('action', url);
            jFrom.prepend('<input type="hidden" name="' + currentSettings.formIndicator + '" value="1" />');
            if (currentSettings.selector)
                jFrom.prepend('<input type="hidden" name="' + currentSettings.selIndicator + '" value="' + currentSettings.selector.substring(1) + '" />');
            modal.tmp.html('<iframe frameborder="0" hspace="0" name="nyroModalIframe" src="javascript:\'\';"></iframe>');
            $('iframe', modal.tmp)
					.css({
					    width: currentSettings.width,
					    height: currentSettings.height
					})
					.error(loadingError)
					.load(formDataLoaded);
            debug('Form Data Load: ' + jFrom.attr('action'));
            showModal();
            showContentOrLoading();
        } else if (currentSettings.type == 'image') {
            debug('Image Load: ' + url);
            var title = jFrom.attr('title') || currentSettings.defaultImgAlt;
            initModal();
            modal.tmp.html('<img id="nyroModalImg" />').find('img').attr('alt', title);
            modal.tmp.css({ lineHeight: 0 });
            $('img', modal.tmp)
					.error(loadingError)
					.load(function() {
					    debug('Image Loaded: ' + this.src);
					    $(this).unbind('load');
					    var w = modal.tmp.width();
					    var h = modal.tmp.height();
					    modal.tmp.css({ lineHeight: '' });
					    resized.width = w;
					    resized.height = h;
					    setCurrentSettings({
					        width: w,
					        height: h,
					        imgWidth: w,
					        imgHeight: h
					    });
					    initSettingsSize.width = w;
					    initSettingsSize.height = h;
					    setCurrentSettings({ overflow: 'visible' }, 'cssOpt', 'content');
					    modal.dataReady = true;
					    if (modal.loadingShown || modal.transition)
					        showContentOrLoading();
					})
					.attr('src', url);
            showModal();
        } else if (currentSettings.type == 'iframeForm') {
            initModal();
            modal.tmp.html('<iframe frameborder="0" hspace="0" src="javascript:\'\';" name="nyroModalIframe" id="nyroModalIframe"></iframe>');
            debug('Iframe Form Load: ' + url);
            $('iframe', modal.tmp).eq(0)
					.css({
					    width: '100%',
					    height: !$.support.boxModel ? '99%' : '100%'
					})
					.load(iframeLoaded);
            modal.dataReady = true;
            showModal();
        } else if (currentSettings.type == 'iframe') {
            initModal();
            modal.tmp.html('<iframe frameborder="0" hspace="0" src="javascript:\'\';" name="nyroModalIframe" id="nyroModalIframe"></iframe>');
            debug('Iframe Load: ' + url);
            $('iframe', modal.tmp).eq(0)
					.css({
					    width: '100%',
					    height: !$.support.boxModel ? '99%' : '100%'
					})
					.load(iframeLoaded);
            modal.dataReady = true;
            showModal();
        } else if (currentSettings.type) {
            // Could be every other kind of type or a dom selector
            debug('Content: ' + currentSettings.type);
            initModal();
            modal.tmp.html(currentSettings.content);
            var w = modal.tmp.width();
            var h = modal.tmp.height();
            var div = $(currentSettings.type);
            if (div.length) {
                setCurrentSettings({ type: 'div' });
                w = div.width();
                h = div.height();
                if (contentElt)
                    contentEltLast = contentElt;
                contentElt = div;
                modal.tmp.append(div.contents());
            }
            initSettingsSize.width = w;
            initSettingsSize.height = h;
            setCurrentSettings({
                width: w,
                height: h
            });
            if (modal.tmp.html())
                modal.dataReady = true;
            else
                loadingError();
            if (!modal.ready)
                showModal();
            else
                endHideContent();
        } else {
            debug('Ajax Load: ' + url);
            setCurrentSettings({ type: 'ajax' });
            var data = currentSettings.ajax.data || {};
            if (currentSettings.selector) {
                if (typeof data == "string") {
                    data += '&' + currentSettings.selIndicator + '=' + currentSettings.selector.substring(1);
                } else {
                    data[currentSettings.selIndicator] = currentSettings.selector.substring(1);
                }
            }
            showModal();
            $.ajax($.extend({}, currentSettings.ajax, {
                url: url,
                success: ajaxLoaded,
                error: loadingError,
                data: data
            }));
        }
    } else if (currentSettings.content) {
        // Raw content not from a DOM element
        debug('Content: ' + currentSettings.type);
        setCurrentSettings({ type: 'manual' });
        initModal();
        modal.tmp.html($('<div/>').html(currentSettings.content).contents());
        if (modal.tmp.html())
            modal.dataReady = true;
        else
            loadingError();
        showModal();
    } else {
        // What should we show here? nothing happen
    }
}

// Update the current settings
// object settings
// string deep1 first key where overwrite the settings
// string deep2 second key where overwrite the settings
function setDefaultCurrentSettings(settings) {
    debug('setDefaultCurrentSettings');
    currentSettings = $.extend(true, {}, $.fn.nyroModal.settings, settings);
    setMargin();
}

function setCurrentSettings(settings, deep1, deep2) {
    if (modal.started) {
        if (deep1 && deep2) {
            $.extend(true, currentSettings[deep1][deep2], settings);
        } else if (deep1) {
            $.extend(true, currentSettings[deep1], settings);
        } else {
            if (modal.animContent) {
                if ('width' in settings) {
                    if (!modal.resizing) {
                        settings.setWidth = settings.width;
                        shouldResize = true;
                    }
                    delete settings['width'];
                }
                if ('height' in settings) {
                    if (!modal.resizing) {
                        settings.setHeight = settings.height;
                        shouldResize = true;
                    }
                    delete settings['height'];
                }
            }
            $.extend(true, currentSettings, settings);
        }
    } else {
        if (deep1 && deep2) {
            $.extend(true, $.fn.nyroModal.settings[deep1][deep2], settings);
        } else if (deep1) {
            $.extend(true, $.fn.nyroModal.settings[deep1], settings);
        } else {
            $.extend(true, $.fn.nyroModal.settings, settings);
        }
    }
}

// Set the margin for postionning the element. Useful for IE6
function setMarginScroll() {
    if (isIE6 && !modal.blocker) {
        if (document.documentElement) {
            currentSettings.marginScrollLeft = document.documentElement.scrollLeft;
            currentSettings.marginScrollTop = document.documentElement.scrollTop;
        } else {
            currentSettings.marginScrollLeft = document.body.scrollLeft;
            currentSettings.marginScrollTop = document.body.scrollTop;
        }
    } else {
        currentSettings.marginScrollLeft = 0;
        currentSettings.marginScrollTop = 0;
    }
}

// Set the margin for the content
function setMargin() {
    setMarginScroll();
    currentSettings.marginLeft = -(currentSettings.width + currentSettings.borderW) / 2;
    currentSettings.marginTop = -(currentSettings.height + currentSettings.borderH) / 2;
    if (!modal.blocker) {
        currentSettings.marginLeft += currentSettings.marginScrollLeft;
        currentSettings.marginTop += currentSettings.marginScrollTop;
    }
}

// Set the margin for the current loading
function setMarginLoading() {
    setMarginScroll();
    var outer = getOuter(modal.loading);
    currentSettings.marginTopLoading = -(modal.loading.height() + outer.h.border + outer.h.padding) / 2;
    currentSettings.marginLeftLoading = -(modal.loading.width() + outer.w.border + outer.w.padding) / 2;
    if (!modal.blocker) {
        currentSettings.marginLeftLoading += currentSettings.marginScrollLeft;
        currentSettings.marginTopLoading += currentSettings.marginScrollTop;
    }
}

// Set the modal Title
function setTitle() {
    var title = $('h1#nyroModalTitle', modal.contentWrapper);
    if (title.length)
        title.text(currentSettings.title);
    else
        modal.contentWrapper.prepend('<h1 id="nyroModalTitle">' + currentSettings.title + '</h1>');
}

// Init the nyroModal div by settings the CSS elements and hide needed elements
function initModal() {
    debug('initModal');
    if (!modal.full) {
        if (currentSettings.debug)
            setCurrentSettings({ color: 'white' }, 'cssOpt', 'bg');

        var full = {
            zIndex: currentSettings.zIndexStart,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        };

        var contain = body;
        var iframeHideIE = '';
        if (currentSettings.blocker) {
            modal.blocker = contain = $(currentSettings.blocker);
            var pos = modal.blocker.offset();
            var w = modal.blocker.outerWidth();
            var h = modal.blocker.outerHeight();
            if (isIE6) {
                setCurrentSettings({
                    height: '100%',
                    width: '100%',
                    top: 0,
                    left: 0
                }, 'cssOpt', 'bg');
            }
            modal.blockerVars = {
                top: pos.top,
                left: pos.left,
                width: w,
                height: h
            };
            var plusTop = (/msie/.test(userAgent) ? 0 : getCurCSS(body.get(0), 'borderTopWidth'));
            var plusLeft = (/msie/.test(userAgent) ? 0 : getCurCSS(body.get(0), 'borderLeftWidth'));
            full = {
                position: 'absolute',
                top: pos.top + plusTop,
                left: pos.left + plusLeft,
                width: w,
                height: h
            };
        } else if (isIE6) {
            var w = body.width();
            var h = $(window).outerHeight() + 'px';
            if ($(window).outerHeight() >= body.outerHeight()) {
                h = body.outerHeight() + 'px';
                w += 40;
            }
            w += 'px';
            body.css({
                width: w,
                height: h,
                position: 'static',
                overflow: 'hidden'
            });
            $('html').css({ overflow: 'hidden' });
            setCurrentSettings({
                cssOpt: {
                    bg: {
                        position: 'absolute',
                        zIndex: currentSettings.zIndexStart + 1,
                        height: '110%',
                        width: '110%',
                        top: currentSettings.marginScrollTop + 'px',
                        left: currentSettings.marginScrollLeft + 'px'
                    },
                    wrapper: { zIndex: currentSettings.zIndexStart + 2 },
                    loading: { zIndex: currentSettings.zIndexStart + 3 }
                }
            });

            iframeHideIE = $('<iframe id="nyroModalIframeHideIe" src="javascript:\'\';"></iframe>')
								.css($.extend({},
									currentSettings.cssOpt.bg, {
									    opacity: 0,
									    zIndex: 50,
									    border: 'none'
									}));
        }

        contain.append($('<div id="nyroModalFull"><div id="nyroModalBg"></div><div id="nyroModalWrapper"><div id="nyroModalContent"></div></div><div id="nyrModalTmp"></div><div id="nyroModalLoading"></div></div>').hide());

        modal.full = $('#nyroModalFull')
				.css(full)
				.show();
        modal.bg = $('#nyroModalBg')
				.css($.extend({
				    backgroundColor: currentSettings.bgColor
				}, currentSettings.cssOpt.bg))
				.before(iframeHideIE);
        modal.bg.bind('click.nyroModal', clickBg);
        modal.loading = $('#nyroModalLoading')
				.css(currentSettings.cssOpt.loading)
				.hide();
        modal.contentWrapper = $('#nyroModalWrapper')
				.css(currentSettings.cssOpt.wrapper)
				.hide();
        modal.content = $('#nyroModalContent');
        modal.tmp = $('#nyrModalTmp').hide();

        // To stop the mousewheel if the the plugin is available
        if ($.isFunction($.fn.mousewheel)) {
            modal.content.mousewheel(function(e, d) {
                var elt = modal.content.get(0);
                if ((d > 0 && elt.scrollTop == 0) ||
							(d < 0 && elt.scrollHeight - elt.scrollTop == elt.clientHeight)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        $(document).bind('keydown.nyroModal', keyHandler);
        modal.content.css({ width: 'auto', height: 'auto' });
        modal.contentWrapper.css({ width: 'auto', height: 'auto' });

        if (!currentSettings.blocker && currentSettings.windowResize) {
            $(window).bind('resize.nyroModal', function() {
                window.clearTimeout(windowResizeTimeout);
                windowResizeTimeout = window.setTimeout(windowResizeHandler, 200);
            });
        }
    }
}

function windowResizeHandler() {
    $.nyroModalSettings(initSettingsSize);
}

// Show the modal (ie: the background and then the loading if needed or the content directly)
function showModal() {
    debug('showModal');
    if (!modal.ready) {
        initModal();
        modal.anim = true;
        currentSettings.showBackground(modal, currentSettings, endBackground);
    } else {
        modal.anim = true;
        modal.transition = true;
        currentSettings.showTransition(modal, currentSettings, function() { endHideContent(); modal.anim = false; showContentOrLoading(); });
    }
}

// Called when user click on background
function clickBg(e) {
    if (!currentSettings.modal)
        removeModal();
}

// Used for the escape key or the arrow in the gallery type
function keyHandler(e) {
    if (e.keyCode == 27) {
        if (!currentSettings.modal)
            removeModal();
    } else if (currentSettings.gallery && modal.ready && modal.dataReady && !modal.anim && !modal.transition) {
        if (e.keyCode == 39 || e.keyCode == 40) {
            e.preventDefault();
            $.nyroModalNext();
            return false;
        } else if (e.keyCode == 37 || e.keyCode == 38) {
            e.preventDefault();
            $.nyroModalPrev();
            return false;
        }
    }
}

// Determine the filetype regarding the link DOM element
function fileType() {
    var from = currentSettings.from;

    var url;

    if (from && from.nodeName) {
        var jFrom = $(from);

        url = jFrom.attr(from.nodeName.toLowerCase() == 'form' ? 'action' : 'href');
        if (!url)
            url = location.href.substring(window.location.host.length + 7);
        currentSettings.url = url;

        if (jFrom.attr('rev') == 'modal')
            currentSettings.modal = true;

        currentSettings.title = jFrom.attr('title');

        if (from && from.rel && from.rel.toLowerCase() != 'nofollow') {
            var indexSpace = from.rel.indexOf(' ');
            currentSettings.gallery = indexSpace > 0 ? from.rel.substr(0, indexSpace) : from.rel;
        }

        var imgType = imageType(url, from);
        if (imgType)
            return imgType;

        if (isSwf(url))
            return 'swf';

        var iframe = false;
        if (from.target && from.target.toLowerCase() == '_blank' || (from.hostname && from.hostname.replace(/:\d*$/, '') != window.location.hostname.replace(/:\d*$/, ''))) {
            iframe = true;
        }
        if (from.nodeName.toLowerCase() == 'form') {
            if (iframe)
                return 'iframeForm';
            setCurrentSettings(extractUrlSel(url));
            if (jFrom.attr('enctype') == 'multipart/form-data')
                return 'formData';
            return 'form';
        }
        if (iframe)
            return 'iframe';
    } else {
        url = currentSettings.url;
        if (!currentSettings.content)
            currentSettings.from = true;

        if (!url)
            return null;

        if (isSwf(url))
            return 'swf';

        var reg1 = new RegExp("^http://|https://", "g");
        if (url.match(reg1))
            return 'iframe';
    }

    var imgType = imageType(url, from);
    if (imgType)
        return imgType;

    var tmp = extractUrlSel(url);
    setCurrentSettings(tmp);

    if (!tmp.url)
        return tmp.selector;
}

function imageType(url, from) {
    var image = new RegExp(currentSettings.regexImg, 'i');
    if (image.test(url)) {
        return 'image';
    }
}

function isSwf(url) {
    var swf = new RegExp('[^\.]\.(swf)\s*$', 'i');
    return swf.test(url);
}

function extractUrlSel(url) {
    var ret = {
        url: null,
        selector: null
    };

    if (url) {
        var hash = getHash(url);
        var hashLoc = getHash(window.location.href);
        var curLoc = window.location.href.substring(0, window.location.href.length - hashLoc.length);
        var req = url.substring(0, url.length - hash.length);

        if (req == curLoc || req == $('base').attr('href')) {
            ret.selector = hash;
        } else {
            ret.url = req;
            ret.selector = hash;
        }
    }
    return ret;
}

// Called when the content cannot be loaded or tiemout reached
function loadingError() {
    debug('loadingError');

    modal.error = true;

    if (!modal.ready)
        return;

    if ($.isFunction(currentSettings.handleError))
        currentSettings.handleError(modal, currentSettings);

    modal.loading
			.addClass(currentSettings.errorClass)
			.html(currentSettings.contentError);
    $(currentSettings.closeSelector, modal.loading)
			.unbind('click.nyroModal')
			.bind('click.nyroModal', removeModal);
    setMarginLoading();
    modal.loading
			.css({
			    marginTop: currentSettings.marginTopLoading + 'px',
			    marginLeft: currentSettings.marginLeftLoading + 'px'
			});
}

// Put the content from modal.tmp to modal.content
function fillContent() {
    debug('fillContent');
    if (!modal.tmp.html())
        return;

    modal.content.html(modal.tmp.contents());
    modal.tmp.empty();
    wrapContent();

    if (currentSettings.type == 'iframeForm') {
        $(currentSettings.from)
				.attr('target', 'nyroModalIframe')
				.data('nyroModalprocessing', 1)
				.submit()
				.attr('target', '_blank')
				.removeData('nyroModalprocessing');
    }

    if (!currentSettings.modal)
        modal.wrapper.prepend(currentSettings.closeButton);

    if ($.isFunction(currentSettings.endFillContent))
        currentSettings.endFillContent(modal, currentSettings);

    modal.content.append(modal.scripts);

    $(currentSettings.closeSelector, modal.contentWrapper)
			.unbind('click.nyroModal')
			.bind('click.nyroModal', removeModal);
    $(currentSettings.openSelector, modal.contentWrapper).nyroModal(getCurrentSettingsNew());
}

// Get the current settings to be used in new links
function getCurrentSettingsNew() {
    return callingSettings;
    var currentSettingsNew = $.extend(true, {}, currentSettings);
    if (resized.width)
        currentSettingsNew.width = null;
    else
        currentSettingsNew.width = initSettingsSize.width;
    if (resized.height)
        currentSettingsNew.height = null;
    else
        currentSettingsNew.height = initSettingsSize.height;
    currentSettingsNew.cssOpt.content.overflow = 'auto';
    return currentSettingsNew;
}

// Wrap the content and update the modal size if needed
function wrapContent() {
    debug('wrapContent');

    var wrap = $(currentSettings.wrap[currentSettings.type]);
    modal.content.append(wrap.children().remove());
    modal.contentWrapper.wrapInner(wrap);

    if (currentSettings.gallery) {
        // Set the action for the next and prev button (or remove them)
        modal.content.append(currentSettings.galleryLinks);

        gallery.links = $('[rel="' + currentSettings.gallery + '"], [rel^="' + currentSettings.gallery + ' "]');
        gallery.index = gallery.links.index(currentSettings.from);

        if (currentSettings.galleryCounts && $.isFunction(currentSettings.galleryCounts))
            currentSettings.galleryCounts(gallery.index + 1, gallery.links.length, modal, currentSettings);

        var currentSettingsNew = getCurrentSettingsNew();

        var linkPrev = getGalleryLink(-1);
        if (linkPrev) {
            var prev = $('.nyroModalPrev', modal.contentWrapper)
					.attr('href', linkPrev.attr('href'))
					.click(function(e) {
					    e.preventDefault();
					    $.nyroModalPrev();
					    return false;
					});
            if (isIE6 && currentSettings.type == 'swf') {
                prev.before($('<iframe id="nyroModalIframeHideIeGalleryPrev" src="javascript:\'\';"></iframe>').css({
                    position: prev.css('position'),
                    top: prev.css('top'),
                    left: prev.css('left'),
                    width: prev.width(),
                    height: prev.height(),
                    opacity: 0,
                    border: 'none'
                }));
            }
        } else {
            $('.nyroModalPrev', modal.contentWrapper).remove();
        }
        var linkNext = getGalleryLink(1);
        if (linkNext) {
            var next = $('.nyroModalNext', modal.contentWrapper)
					.attr('href', linkNext.attr('href'))
					.click(function(e) {
					    e.preventDefault();
					    $.nyroModalNext();
					    return false;
					});
            if (isIE6 && currentSettings.type == 'swf') {
                next.before($('<iframe id="nyroModalIframeHideIeGalleryNext" src="javascript:\'\';"></iframe>')
									.css($.extend({}, {
									    position: next.css('position'),
									    top: next.css('top'),
									    left: next.css('left'),
									    width: next.width(),
									    height: next.height(),
									    opacity: 0,
									    border: 'none'
									})));
            }
        } else {
            $('.nyroModalNext', modal.contentWrapper).remove();
        }
    }

    calculateSize();
}

function getGalleryLink(dir) {
    if (currentSettings.gallery) {
        if (!currentSettings.ltr)
            dir *= -1;
        var index = gallery.index + dir;
        if (index >= 0 && index < gallery.links.length)
            return gallery.links.eq(index);
        else if (currentSettings.galleryLoop) {
            if (index < 0)
                return gallery.links.eq(gallery.links.length - 1);
            else
                return gallery.links.eq(0);
        }
    }
    return false;
}

// Calculate the size for the contentWrapper
function calculateSize(resizing) {
    debug('calculateSize');

    modal.wrapper = modal.contentWrapper.children('div:first');

    resized.width = false;
    resized.height = false;
    if (false && !currentSettings.windowResizing) {
        initSettingsSize.width = currentSettings.width;
        initSettingsSize.height = currentSettings.height;
    }

    if (currentSettings.autoSizable && (!currentSettings.width || !currentSettings.height)) {
        modal.contentWrapper
				.css({
				    opacity: 0,
				    width: 'auto',
				    height: 'auto'
				})
				.show();
        var tmp = {
            width: 'auto',
            height: 'auto'
        };
        if (currentSettings.width) {
            tmp.width = currentSettings.width;
        } else if (currentSettings.type == 'iframe') {
            tmp.width = currentSettings.minWidth;
        }

        if (currentSettings.height) {
            tmp.height = currentSettings.height;
        } else if (currentSettings.type == 'iframe') {
            tmp.height = currentSettings.minHeight;
        }

        modal.content.css(tmp);
        if (!currentSettings.width) {
            currentSettings.width = modal.content.outerWidth(true);
            resized.width = true;
        }
        if (!currentSettings.height) {
            currentSettings.height = modal.content.outerHeight(true);
            resized.height = true;
        }
        modal.contentWrapper.css({ opacity: 1 });
        if (!resizing)
            modal.contentWrapper.hide();
    }

    if (currentSettings.type != 'image' && currentSettings.type != 'swf') {
        currentSettings.width = Math.max(currentSettings.width, currentSettings.minWidth);
        currentSettings.height = Math.max(currentSettings.height, currentSettings.minHeight);
    }

    var outerWrapper = getOuter(modal.contentWrapper);
    var outerWrapper2 = getOuter(modal.wrapper);
    var outerContent = getOuter(modal.content);

    var tmp = {
        content: {
            width: currentSettings.width,
            height: currentSettings.height
        },
        wrapper2: {
            width: currentSettings.width + outerContent.w.total,
            height: currentSettings.height + outerContent.h.total
        },
        wrapper: {
            width: currentSettings.width + outerContent.w.total + outerWrapper2.w.total,
            height: currentSettings.height + outerContent.h.total + outerWrapper2.h.total
        }
    };

    if (currentSettings.resizable) {
        var maxHeight = modal.blockerVars ? modal.blockerVars.height : $(window).height()
								- outerWrapper.h.border
								- (tmp.wrapper.height - currentSettings.height);
        var maxWidth = modal.blockerVars ? modal.blockerVars.width : $(window).width()
								- outerWrapper.w.border
								- (tmp.wrapper.width - currentSettings.width);
        maxHeight -= currentSettings.padding * 2;
        maxWidth -= currentSettings.padding * 2;

        if (tmp.content.height > maxHeight || tmp.content.width > maxWidth) {
            // We're gonna resize the modal as it will goes outside the view port
            if (currentSettings.type == 'image' || currentSettings.type == 'swf') {
                // An image is resized proportionnaly
                var useW = currentSettings.imgWidth ? currentSettings.imgWidth : currentSettings.width;
                var useH = currentSettings.imgHeight ? currentSettings.imgHeight : currentSettings.height;
                var diffW = tmp.content.width - useW;
                var diffH = tmp.content.height - useH;
                if (diffH < 0) diffH = 0;
                if (diffW < 0) diffW = 0;
                var calcH = maxHeight - diffH;
                var calcW = maxWidth - diffW;
                var ratio = Math.min(calcH / useH, calcW / useW);
                calcW = Math.floor(useW * ratio);
                calcH = Math.floor(useH * ratio);
                tmp.content.height = calcH + diffH;
                tmp.content.width = calcW + diffW;
            } else {
                // For an HTML content, we simply decrease the size
                tmp.content.height = Math.min(tmp.content.height, maxHeight);
                tmp.content.width = Math.min(tmp.content.width, maxWidth);
            }
            tmp.wrapper2 = {
                width: tmp.content.width + outerContent.w.total,
                height: tmp.content.height + outerContent.h.total
            };
            tmp.wrapper = {
                width: tmp.content.width + outerContent.w.total + outerWrapper2.w.total,
                height: tmp.content.height + outerContent.h.total + outerWrapper2.h.total
            };
        }
    }

    if (currentSettings.type == 'swf') {
        $('object, embed', modal.content)
				.attr('width', tmp.content.width)
				.attr('height', tmp.content.height);
    } else if (currentSettings.type == 'image') {
        $('img', modal.content).css({
            width: tmp.content.width,
            height: tmp.content.height
        });
    }

    modal.content.css($.extend({}, tmp.content, currentSettings.cssOpt.content));
    modal.wrapper.css($.extend({}, tmp.wrapper2, currentSettings.cssOpt.wrapper2));

    if (!resizing)
        modal.contentWrapper.css($.extend({}, tmp.wrapper, currentSettings.cssOpt.wrapper));

    if (currentSettings.type == 'image' && currentSettings.addImageDivTitle) {
        // Adding the title for the image
        $('img', modal.content).removeAttr('alt');
        var divTitle = $('div', modal.content);
        if (currentSettings.title != currentSettings.defaultImgAlt && currentSettings.title) {
            if (divTitle.length == 0) {
                divTitle = $('<div>' + currentSettings.title + '</div>');
                modal.content.append(divTitle);
            }
            if (currentSettings.setWidthImgTitle) {
                var outerDivTitle = getOuter(divTitle);
                divTitle.css({ width: (tmp.content.width + outerContent.w.padding - outerDivTitle.w.total) + 'px' });
            }
        } else if (divTitle.length = 0) {
            divTitle.remove();
        }
    }

    if (currentSettings.title)
        setTitle();

    tmp.wrapper.borderW = outerWrapper.w.border;
    tmp.wrapper.borderH = outerWrapper.h.border;

    setCurrentSettings(tmp.wrapper);
    setMargin();
}

function removeModal(e) {
    debug('removeModal');
    if (e)
        e.preventDefault();
    if (modal.full && modal.ready) {
        $(document).unbind('keydown.nyroModal');
        if (!currentSettings.blocker)
            $(window).unbind('resize.nyroModal');
        modal.ready = false;
        modal.anim = true;
        modal.closing = true;
        if (modal.loadingShown || modal.transition) {
            currentSettings.hideLoading(modal, currentSettings, function() {
                modal.loading.hide();
                modal.loadingShown = false;
                modal.transition = false;
                currentSettings.hideBackground(modal, currentSettings, endRemove);
            });
        } else {
            if (fixFF)
                modal.content.css({ position: '' }); // Fix Issue #10, remove the attribute
            modal.wrapper.css({ overflow: 'hidden' }); // Used to fix a visual issue when hiding
            modal.content.css({ overflow: 'hidden' }); // Used to fix a visual issue when hiding
            $('iframe', modal.content).hide(); // Fix issue 359
            if ($.isFunction(currentSettings.beforeHideContent)) {
                currentSettings.beforeHideContent(modal, currentSettings, function() {
                    currentSettings.hideContent(modal, currentSettings, function() {
                        endHideContent();
                        currentSettings.hideBackground(modal, currentSettings, endRemove);
                    });
                });
            } else {
                currentSettings.hideContent(modal, currentSettings, function() {
                    endHideContent();
                    currentSettings.hideBackground(modal, currentSettings, endRemove);
                });
            }
        }
    }
    if (e)
        return false;
}

function showContentOrLoading() {
    debug('showContentOrLoading');
    if (modal.ready && !modal.anim) {
        if (modal.dataReady) {
            if (modal.tmp.html()) {
                modal.anim = true;
                if (modal.transition) {
                    fillContent();
                    modal.animContent = true;
                    currentSettings.hideTransition(modal, currentSettings, function() {
                        modal.loading.hide();
                        modal.transition = false;
                        modal.loadingShown = false;
                        endShowContent();
                    });
                } else {
                    currentSettings.hideLoading(modal, currentSettings, function() {
                        modal.loading.hide();
                        modal.loadingShown = false;
                        fillContent();
                        setMarginLoading();
                        setMargin();
                        modal.animContent = true;
                        currentSettings.showContent(modal, currentSettings, endShowContent);
                    });
                }
            }
        } else if (!modal.loadingShown && !modal.transition) {
            modal.anim = true;
            modal.loadingShown = true;
            if (modal.error)
                loadingError();
            else
                modal.loading.html(currentSettings.contentLoading);
            $(currentSettings.closeSelector, modal.loading)
					.unbind('click.nyroModal')
					.bind('click.nyroModal', removeModal);
            setMarginLoading();
            currentSettings.showLoading(modal, currentSettings, function() { modal.anim = false; showContentOrLoading(); });
        }
    }
}

// -------------------------------------------------------
// Private Data Loaded callback
// -------------------------------------------------------

function ajaxLoaded(data) {
    debug('AjaxLoaded: ' + this.url);

    if (currentSettings.selector) {
        var tmp = {};
        var i = 0;
        // Looking for script to store them
        data = data
				.replace(/\r\n/gi, 'nyroModalLN')
				.replace(/<script(.|\s)*?\/script>/gi, function(x) {
				    tmp[i] = x;
				    return '<pre style="display: none" class=nyroModalScript rel="' + (i++) + '"></pre>';
				});
        data = $('<div>' + data + '</div>').find(currentSettings.selector).html()
				.replace(/<pre style="display: none;?" class="?nyroModalScript"? rel="(.?)"><\/pre>/gi, function(x, y, z) {
				    return tmp[y];
				})
				.replace(/nyroModalLN/gi, "\r\n");
    }
    modal.tmp.html(filterScripts(data));
    if (modal.tmp.html()) {
        modal.dataReady = true;
        showContentOrLoading();
    } else
        loadingError();
}

function formDataLoaded() {
    debug('formDataLoaded');
    var jFrom = $(currentSettings.from);
    jFrom.attr('action', jFrom.attr('action') + currentSettings.selector);
    jFrom.attr('target', '');
    $('input[name=' + currentSettings.formIndicator + ']', currentSettings.from).remove();
    var iframe = modal.tmp.children('iframe');
    var iframeContent = iframe.unbind('load').contents().find(currentSettings.selector || 'body').not('script[src]');
    iframe.attr('src', 'about:blank'); // Used to stop the loading in FF
    modal.tmp.html(iframeContent.html());
    if (modal.tmp.html()) {
        modal.dataReady = true;
        showContentOrLoading();
    } else
        loadingError();
}

function iframeLoaded() {
    if ((window.location.hostname && currentSettings.url.indexOf(window.location.hostname) > -1)
				|| currentSettings.url.indexOf('http://')) {
        var iframe = $('iframe', modal.full).contents();
        var tmp = {};
        if (currentSettings.titleFromIframe) {
            tmp.title = iframe.find('title').text();
            if (!tmp.title) {
                // for IE
                try {
                    tmp.title = iframe.find('title').html();
                } catch (err) { }
            }
        }
        var body = iframe.find('body');
        if (!currentSettings.height && body.height())
            tmp.height = body.height();
        if (!currentSettings.width && body.width())
            tmp.width = body.width();
        $.extend(initSettingsSize, tmp);
        $.nyroModalSettings(tmp);
    }
}

function galleryCounts(nb, total, elts, settings) {
    if (total > 1)
        settings.title += (settings.title ? ' - ' : '') + nb + '/' + total;
}


// -------------------------------------------------------
// Private Animation callback
// -------------------------------------------------------

function endHideContent() {
    debug('endHideContent');
    modal.anim = false;
    if (contentEltLast) {
        contentEltLast.append(modal.content.contents());
        contentEltLast = null;
    } else if (contentElt) {
        contentElt.append(modal.content.contents());
        contentElt = null;
    }
    modal.content.empty();

    gallery = {};

    modal.contentWrapper.hide().children().remove().empty().attr('style', '').hide();

    if (modal.closing || modal.transition)
        modal.contentWrapper.hide();

    modal.contentWrapper
			.css(currentSettings.cssOpt.wrapper)
			.append(modal.content);
    showContentOrLoading();
}

function endRemove() {
    debug('endRemove');
    $(document).unbind('keydown', keyHandler);
    modal.anim = false;
    modal.full.remove();
    modal.full = null;
    if (isIE6) {
        body.css({ height: '', width: '', position: '', overflow: '' });
        $('html').css({ overflow: '' });
    }
    if ($.isFunction(currentSettings.endRemove))
        currentSettings.endRemove(modal, currentSettings);
}

function endBackground() {
    debug('endBackground');
    modal.ready = true;
    modal.anim = false;
    showContentOrLoading();
}

function endShowContent() {
    debug('endShowContent');
    modal.anim = false;
    modal.animContent = false;
    modal.contentWrapper.css({ opacity: '' }); // for the close button in IE
    fixFF = /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent) && parseFloat(browserVersion) < 1.9 && currentSettings.type != 'image';

    if (fixFF)
        modal.content.css({ position: 'fixed' }); // Fix Issue #10
    modal.content.append(modal.scriptsShown);

    if (currentSettings.type == 'iframe')
        modal.content.find('iframe').attr('src', currentSettings.url);

    if ($.isFunction(currentSettings.endShowContent))
        currentSettings.endShowContent(modal, currentSettings);

    if (shouldResize) {
        shouldResize = false;
        $.nyroModalSettings({ width: currentSettings.setWidth, height: currentSettings.setHeight });
        delete currentSettings['setWidth'];
        delete currentSettings['setHeight'];
    }
    if (resized.width)
        setCurrentSettings({ width: null });
    if (resized.height)
        setCurrentSettings({ height: null });
}


// -------------------------------------------------------
// Utilities
// -------------------------------------------------------

// Get the selector from an url (as string)
function getHash(url) {
    if (typeof url == 'string') {
        var hashPos = url.indexOf('#');
        if (hashPos > -1)
            return url.substring(hashPos);
    }
    return '';
}

// Filter an html content to remove the script[src]
function filterScripts(data) {
    // Removing the body, head and html tag
    if (typeof data == 'string')
        data = data.replace(/<\/?(html|head|body)([^>]*)>/gi, '');
    var tmp = new Array();
    $.each($.clean({ 0: data }, this.ownerDocument), function() {
        if ($.nodeName(this, "script")) {
            if (!this.src || $(this).attr('rel') == 'forceLoad') {
                if ($(this).attr('rev') == 'shown')
                    modal.scriptsShown.push(this);
                else
                    modal.scripts.push(this);
            }
        } else
            tmp.push(this);
    });
    return tmp;
}

// Get the vertical and horizontal margin, padding and border dimension
function getOuter(elm) {
    elm = elm.get(0);
    var ret = {
        h: {
            margin: getCurCSS(elm, 'marginTop') + getCurCSS(elm, 'marginBottom'),
            border: getCurCSS(elm, 'borderTopWidth') + getCurCSS(elm, 'borderBottomWidth'),
            padding: getCurCSS(elm, 'paddingTop') + getCurCSS(elm, 'paddingBottom')
        },
        w: {
            margin: getCurCSS(elm, 'marginLeft') + getCurCSS(elm, 'marginRight'),
            border: getCurCSS(elm, 'borderLeftWidth') + getCurCSS(elm, 'borderRightWidth'),
            padding: getCurCSS(elm, 'paddingLeft') + getCurCSS(elm, 'paddingRight')
        }
    };

    ret.h.outer = ret.h.margin + ret.h.border;
    ret.w.outer = ret.w.margin + ret.w.border;

    ret.h.inner = ret.h.padding + ret.h.border;
    ret.w.inner = ret.w.padding + ret.w.border;

    ret.h.total = ret.h.outer + ret.h.padding;
    ret.w.total = ret.w.outer + ret.w.padding;

    return ret;
}

function getCurCSS(elm, name) {
    var ret = parseInt($.curCSS(elm, name, true));
    if (isNaN(ret))
        ret = 0;
    return ret;
}

// Proxy Debug function
function debug(msg) {
    if ($.fn.nyroModal.settings.debug || currentSettings && currentSettings.debug)
        nyroModalDebug(msg, modal, currentSettings || {});
}

// -------------------------------------------------------
// Default animation function
// -------------------------------------------------------

function showBackground(elts, settings, callback) {
    elts.bg.css({ opacity: 0 }).fadeTo(200, 0.75, callback);
}

function hideBackground(elts, settings, callback) {
    elts.bg.fadeOut(200, callback);
}

function showLoading(elts, settings, callback) {
    elts.loading
			.css({
			    marginTop: settings.marginTopLoading + 'px',
			    marginLeft: settings.marginLeftLoading + 'px',
			    opacity: 0
			})
			.show()
			.animate({
			    opacity: 1
			}, { complete: callback, duration: 200 });
}

function hideLoading(elts, settings, callback) {
    callback();
}

function showContent(elts, settings, callback) {
    elts.loading
			.css({
			    marginTop: settings.marginTopLoading + 'px',
			    marginLeft: settings.marginLeftLoading + 'px'
			})
			.show()
			.animate({
			    width: settings.width + 'px',
			    height: settings.height + 'px',
			    marginTop: settings.marginTop + 'px',
			    marginLeft: settings.marginLeft + 'px'
			}, { duration: 150, complete: function() {
			    elts.contentWrapper
					.css({
					    width: settings.width + 'px',
					    height: settings.height + 'px',
					    marginTop: settings.marginTop + 'px',
					    marginLeft: settings.marginLeft + 'px'
					})
					.show();
			    elts.loading.fadeOut(200, callback);
			}
			});
}

function hideContent(elts, settings, callback) {
    elts.contentWrapper
			.animate({
			    height: '50px',
			    width: '50px',
			    marginTop: (-(25 + settings.borderH) / 2 + settings.marginScrollTop) + 'px',
			    marginLeft: (-(25 + settings.borderW) / 2 + settings.marginScrollLeft) + 'px'
			}, { duration: 150, complete: function() {
			    elts.contentWrapper.hide();
			    callback();
			}
			});
}

function showTransition(elts, settings, callback) {
    // Put the loading with the same dimensions of the current content
    elts.loading
			.css({
			    marginTop: elts.contentWrapper.css('marginTop'),
			    marginLeft: elts.contentWrapper.css('marginLeft'),
			    height: elts.contentWrapper.css('height'),
			    width: elts.contentWrapper.css('width'),
			    opacity: 0
			})
			.show()
			.fadeTo(200, 1, function() {
			    elts.contentWrapper.hide();
			    callback();
			});
}

function hideTransition(elts, settings, callback) {
    // Place the content wrapper underneath the the loading with the right dimensions
    elts.contentWrapper
			.hide()
			.css({
			    width: settings.width + 'px',
			    height: settings.height + 'px',
			    marginLeft: settings.marginLeft + 'px',
			    marginTop: settings.marginTop + 'px',
			    opacity: 1
			});
    elts.loading
			.animate({
			    width: settings.width + 'px',
			    height: settings.height + 'px',
			    marginLeft: settings.marginLeft + 'px',
			    marginTop: settings.marginTop + 'px'
			}, { complete: function() {
			    elts.contentWrapper.show();
			    elts.loading.fadeOut(200, function() {
			        elts.loading.hide();
			        callback();
			    });
			}, duration: 150
			});
}

function resize(elts, settings, callback) {
    elts.contentWrapper
			.animate({
			    width: settings.width + 'px',
			    height: settings.height + 'px',
			    marginLeft: settings.marginLeft + 'px',
			    marginTop: settings.marginTop + 'px'
			}, { complete: callback, duration: 100 });
}

function updateBgColor(elts, settings, callback) {
    if (!$.fx.step.backgroundColor) {
        elts.bg.css({ backgroundColor: settings.bgColor });
        callback();
    } else
        elts.bg
				.animate({
				    backgroundColor: settings.bgColor
				}, { complete: callback, duration: 400 });
}

// -------------------------------------------------------
// Default initialization
// -------------------------------------------------------

$($.fn.nyroModal.settings.openSelector).nyroModal();

});

// Default debug function, to be overwritten if needed
//      Be aware that the settings parameter could be empty
var tmpDebug = '';
function nyroModalDebug(msg, elts, settings) {
	if (elts.full && elts.bg) {
		elts.bg.prepend(msg+'<br />'+tmpDebug);
		tmpDebug = '';
	} else
		tmpDebug+= msg+'<br />';
}
/*!
 * jQuery UI @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "@VERSION",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}

function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );

/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			$( elem ).triggerHandler( "remove" );
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						$( this ).triggerHandler( "remove" );
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var callback = this.options[ type ];

		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );

/*!
 * jQuery UI Mouse @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$(document).mousedown(function(e) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if(mouseHandled) {return};

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		
		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);

function any2date(v) {
    var s = new String(v);
    var a = s.split(/\.|\. |-|T|:| /);
    var d = new Date();

    try {
        d = new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2]), isNaN(Number(a[3])) ? 0 : Number(a[3]), isNaN(Number(a[4])) ? 0 : Number(a[4]));
    }
    catch (ex) {
        return null;
    }

    return d;
}

function date2str(v) {
    if (v == null || v == '')
        return null;

    return v.getFullYear() + '-' +
            (v.getMonth() + 1 < 10 ? '0' : '') + (v.getMonth() + 1) + '-' +
            (v.getDate() < 10 ? '0' : '') + v.getDate() + ' ' +
            (v.getHours() < 10 ? '0' : '') + v.getHours() + ':' +
            (v.getMinutes() < 10 ? '0' : '') + v.getMinutes() + ':' +
            (v.getSeconds() < 10 ? '0' : '') + v.getSeconds();
}

function date2datestr(v) {
    if (v == null || v == '')
        return null;

    return v.getFullYear() + '-' +
            (v.getMonth() + 1 < 10 ? '0' : '') + (v.getMonth() + 1) + '-' +
            (v.getDate() < 10 ? '0' : '') + v.getDate();
}

function date2timestr(v) {
    if (v == null || v == '')
        return null;

    return  (v.getHours() < 10 ? '0' : '') + v.getHours() + ':' +
            (v.getMinutes() < 10 ? '0' : '') + v.getMinutes() + ':' +
            (v.getSeconds() < 10 ? '0' : '') + v.getSeconds();
}

/* navigator/breadcrumb */
function breadcrumb(ul, type, id) {
    ul.addClass('show');
    ul.mouseleave(function () { ul.removeClass('show'); });

    if (jQuery('ul', ul).length == 0) {
        DexAjax({
            url: url_breadcrumb,
            data: { type: type, id: id },
            handler: function (res) { ul.append(res); }
        });
    }
}

function initHtmlEditor2(id, editorParams, uploaderParams) {
    var editor = tinyMCE.get(id);
    if (editor) {
        if (uploaderParams) {
            var upl = document.getElementById(id + '_uploader');
            if (upl && upl.FileUploader)
                up.FileUploader.reset();
        }
        editor.remove();
    }

    if (typeof (editorParams.buttons) == 'undefined' || editorParams.buttons == null) editorParams.buttons = '';
    if (typeof (editorParams.plugins) == 'undefined' || editorParams.plugins == null) editorParams.plugins = '';
    if (typeof (editorParams.focus) == 'undefined' || editorParams.focus == null) editorParams.focus = false;
    if (typeof (editorParams.lang) == 'undefined' || editorParams.lang == null || editorParams.lang == '') editorParams.lang = 'en';
    if (typeof (editorParams.css) == 'undefined' || editorParams.css == null) editorParams.css = window.tinyMCEDefaults && window.tinyMCEDefaults.css ? window.tinyMCEDefaults.css : '';
    if (typeof (editorParams.height) == 'undefined' || editorParams.height == null) editorParams.height = 100;
    if (typeof (editorParams.styles) == 'undefined' || editorParams.styles == null) editorParams.styles = '';

    var btns1 = '';
    var btns2 = '';
    var btns3 = '';

    if (editorParams.toolbars == 0) {
        btns1 = editorParams.buttons.length > 0 ? editorParams.buttons.substring(1) : '';
    } else if (editorParams.toolbars == 1) {
        btns1 = 'pastetext,pre,|,undo,redo,|,bold,italic,underline,strikethrough,removeformat,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,sub,sup,|,link,unlink,|,hr,charmap' + editorParams.buttons;
    } else if (editorParams.toolbars == 2) {
        btns1 = 'pastetext,pre,|,undo,redo,|,bold,italic,underline,strikethrough,removeformat,|,justifyleft,justifycenter,justifyright,justifyfull' + (editorParams.styles ? ',styleselect' : '');
        btns2 = 'sub,sup,bullist,numlist,|,link,unlink,|,hr,charmap' + editorParams.buttons;
    } else if (editorParams.toolbars == 3) {
        btns1 = 'pastetext,pre,|,undo,redo,|,bold,italic,underline,strikethrough,removeformat';
        btns2 = 'justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,sub,sup';
        btns3 = (editorParams.styles ? 'styleselect,' : '') + '|,link,unlink,|,hr,charmap' + editorParams.buttons;
    }

    var editorInitParams = {
        mode: 'exact',
        document_base_url: editorParams.document_base_url,
        cleanup: true,
        entity_encoding: 'raw',
        elements: id,
        content_css: editorParams.css,
        theme: 'advanced',
        skin: 'CooSpace',
        theme_advanced_buttons1: btns1,
        theme_advanced_buttons2: btns2,
        theme_advanced_buttons3: btns3,
        theme_advanced_toolbar_align: 'center',
        theme_advanced_toolbar_location: editorParams.toolbar_location,
        theme_advanced_statusbar_location: 'none',
        theme_advanced_path: false,
        theme_advanced_styles: (editorParams.styles && editorParams.styles.slice(0,1) == ',' ? 'advanced.h1=h1;advanced.h2=h2;advanced.h3=h3' : '') + editorParams.styles,
        plugins: 'paste,inlinepopups,pre' + editorParams.plugins,
        valid_elements: '' +
            'b/strong,u,i/em,ol[style],ul[style],li[style],br,hr,' +
            'a[href|target:_blank|rel|style],' +
            'big[align|style],' +
            'div[align|style],' +
            'img[align|style|src|alt|width|height|title],' +
            'p[align|style|class],' +
            'small[align|style],' +
            'strike[align|style],' +
            'span[align|style|id|class],' +
            'tt[align|style],' + 
            'table[class|style|cellspacing|cellpadding],thead,tbody,tr[style],td[style],th[style],' + 
            'sub,sup,' + 
            'pre',
        language: editorParams.lang,
        auto_focus: editorParams.focus ? id : '',
        height: editorParams.height,
        customParams: editorParams.customParams,
        advimageParams: editorParams.customParams,
        otherParams: editorParams.otherParams
    };

    if (editorParams.onChange)
        editorInitParams.onchange_callback = editorParams.onChange;

    if (uploaderParams == null) {
        if (editorParams.initFunc != null) {
            editorInitParams.oninit = function (ed) {
                eval(editorParams.initFunc);
            }
        }
    } else {
        editorInitParams.setup = function (ed) {
            ed.addButton('uploadify', {
                title: uploaderParams.btn_label,
                image: uploaderParams.image_url,
                tagname: 'div'
            });
        };
        
        editorInitParams.oninit = function (ed) {
            eval(id + '_uploader_init();');
            if (editorParams.initFunc != null) eval(editorParams.initFunc);
        };
    }

    tinyMCE.init(editorInitParams);

}

// DesignHelper.CategoryChooser
function categorychooser(ho, url, scene_id, list) {
    if ($("#categorychooser_" + scene_id).length == 0) {
        if (lastCategoryChooserId != 0)
            closecategorychooser(lastCategoryChooserId);

        categories = $(ho).closest("li").attr("data-cats");

        DexAjax({
            url: url,
            data: {
                scene_id: scene_id,
                categories: categories
            },
            handler: function (res) {
                $(ho).after($(res));
                if (list) {
                    $('#categorychooser_' + scene_id).css('left', $(ho).offset().left - 303 + $(ho).width() + 'px');
                    $('#categorychooser_' + scene_id).css('top', $(ho).offset().top + 24 + 'px');
                } else {
                    $('#categorychooser_' + scene_id).css('left', '-20px');
                }
                lastCategoryChooserId = scene_id;
            }
        });
    }
    else
        closecategorychooser(scene_id);
}

function closecategorychooser(scene_id) {
    $('#categorychooser_' + scene_id).remove();
    lastCategoryChooserId = 0;
}

// session keepalive
var tmr_sessionKeepAlive;
function sessionKeepAlive(url, login_url) {
    if (tmr_sessionKeepAlive)
        return;
    tmr_sessionKeepAlive = window.setInterval(function () {
        var data = {};
        if (window.sessionping) {
            var i = 0;
            $.each(window.sessionping, function (k, v) {
                data['targets[' + i + '].key'] = k;
                data['targets[' + i + '].value'] = v;
                i++;
            });
        }
        DexAjax({
            url: url,
            data: data,
            handler: function (res) {
                if (res == 'NO_SESSION') {
                    if (!login_url)
                        return;
                    location.href = login_url;
                }
                if (!res)
                    return;
                $.each(res, function (k, v) {
                    var fn = 'sessionping_callback_' + k;
                    if (typeof window[fn] == 'function')
                        window[fn](v);
                });
            },
            ajax_sel: '#sessionping'
        });
    }, 55000);
}

if (!window.sessionping) window.sessionping = {};

// DesignHelperRightChooser
function rightchooser(ho, funcname, funcctx, items) {
    if (ho.childNodes.length > 0)
        return;
    o = $(ho);

    var newitems = '<div>\n';

    for (i = 0; i < items.length; i++) {
        var item = items[i];
        newitems += '<a href="javascript:;" class="rightchooser_' + item.right + '">' + item.label + '</a>\n';
    }
    newitems += '</div>';

    o.append($(newitems));

    $('div a', o).each(function (i, oo) {
        $(oo).click(function () {
            var right = oo.className;
            right = right.substring(right.indexOf('_') + 1);

            ho.parentNode.className = 'rightchooser_outer rightchooser_' + right;
            ho.title = this.innerText;
            window.setTimeout(function () { o.html(''); }, 10);
            var ctx = funcctx; eval(funcname + '(ctx, \'' + right + '\');');
            return false;
        });
    });
    o.mouseleave(function (ev) { o.html(''); });
}


// HACK for lazyloading tinyMCE
$(function () { window.tinyMCE_lazyload_hack = true; if (!window.tinyMCE_GZ) window.tinyMCE_GZ = { loaded: true }; });

// dexLazyLoad
if (!window.dexLoadedScripts) window.dexLoadedScripts = {};
function requireScript(url) {
    if (!window.dexLoadedScripts[url]) {
        window.dexLoadedScripts[url] = true;

        var head = document.getElementsByTagName('head')[0];
        var node = document.createElement('script');
        node.async = false; // ?
        node.type = 'text/javascript';
        node.src = url;
        head.appendChild(node);
    }
}

//dirty bekapcsolása
function dirtyOn(selector) {
    $(selector).change(function () {
        window.dirty = true;
    });
}


function markeventread(event_id) {
    DexAjax({
        url: url_markeventread,
        data: {
            event_id: event_id
        },
        handler: function (res) { if (res == 'OK') { $('#event_' + event_id).fadeOut(); } }
    });
}

function markeventsread(eventsubtype_id) {
    DexAjax({
        url: url_markeventsread,
        data: {
            eventsubtype_id: eventsubtype_id
        },
        handler: function (res) { if (res == 'OK') { $('#left_events_EST' + eventsubtype_id).fadeOut(); } }
    });
}


function htmlEncode(html) {
    return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

var userhint_showtimer;
var userhint_hidetimer;

//userinfo
function userhint_show(uid, id, href, img, name, code, other, msg_url, online, video) {
    if ($('div.userinfohint div.csms_box:visible').length > 0)
        return;

    if (userhint_showtimer) {
        clearTimeout(userhint_showtimer);
        userhint_showtimer = null;
    }

    if ($('div#userinfolink_' + id + '_div').length)
        return;

    $('div.userinfohint').remove();

    userhint_showtimer = setTimeout(function () { userhint(uid, id, href, img, name, code, other, msg_url, online, video) }, 800);
}

function userhint_hide(id) {
    if (userhint_showtimer) {
        clearTimeout(userhint_showtimer);
        userhint_showtimer = null;
    }

    if ($('div#userinfolink_' + id + '_div').is(':visible')) {
        userhint_hidetimer = setTimeout(function () { userhint_remove(id); }, 500);
    }
}

function userhint(uid, id, href, img, name, code, other, msg_url, online, video) {
    var template = '<div class="userinfohint" id="userinfolink_' + id + '_div">';
    template += '<div class="hintimage"><img src="' + img + '" alt="usr_' + code + '"></div>';
    template += '<div class="hintinfo">';
    template += '<div class="name"><a href="' + href + '">' + (name == null ? '' : name) + '</a></div>';
    template += '<div class="code">' + (code == null ? '' : code) + '</div>';
    if (online)
        template += '<div class="online">' + htmlEncode('online') + '</div>';

    if (msg_url != null)
        template += '<div><a class="linkbutton16 csms_btn" href="javascript:;" onclick="userhint_showmessage(' + id + ');return false;">' + htmlEncode('Üzenetküldés') + '</a></div>';

    if (video)
        template += '<div><a class="linkbutton16 video_btn" href="javascript:;" onclick="videoCall(' + uid + ');">' + htmlEncode('Videóhívás') + '</a></div>';

    template += '</div>';
    template += '<div style="clear: both;"></div>';
    if (other != null) {
        template += '<div class="actions">';
        for (var i = 0; i < other.length; i++) {
            if (other[i] != null)
                template += '<span class="other">' + other[i] + '</span> ';
        }
        template += '</div>';
    }
    template += '<div style="clear: both;"></div>';
    if (msg_url != null) {
        template += '<div class="csms_box">';
        template += '<form id="csms_form_' + id + '" action="#">';
        template += '<input type="hidden" name="partner_id" value="' + uid + '" />';
        template += '<textarea name="message"></textarea><br />';
        template += '<div class="operations"><a class="button" href="javascript:;" onclick="userhint_hidemessage(' + id + ');return false;">' + htmlEncode('Mégsem') + '</a> ';
        template += '<a class="button" href="javascript:;" onclick="userhint_sendmessage(' + id + ', \'' + msg_url + '\');return false;">' + htmlEncode('Küldés') + '</a></div>';
        template += '</form>';
        template += '</div>';
    }
    template += '</div>';

    var lnk = $('a#userinfolink_' + id);
    if (lnk.length == 0) {
        userhint_hide(id);
        return;
    }

    var div = $(template).appendTo('body');

    var pos = lnk.position();
    pos.top -= (div.height() - 5);
    pos.left += 40;

    //Ha nincs hely jobbra akkor balra
    if ((window.innerWidth - pos.left) < div.width())
        pos.left -= div.width();

    div.css(pos);
    div.show();
    div.hover(function () { if (userhint_hidetimer) {
                                clearTimeout(userhint_hidetimer);
                                userhint_hidetimer = null;
                            }
                          },
              function () { if (userhint_hidetimer) 
                                clearTimeout(userhint_hidetimer);
                            userhint_hidetimer = setTimeout(function () { userhint_remove(id); }, 500);
                          });
}

function userhint_remove(id) {
    if (!$('div#userinfolink_' + id + '_div div.csms_box').is(':visible'))
        $('div#userinfolink_' + id + '_div').remove();
}

function userhint_showmessage(id) {
    $('div#userinfolink_' + id + '_div div.actions').hide();
    $('div#userinfolink_' + id + '_div div.csms_box').show();

    /*var pos = $('div#userinfolink_' + id + '_div').position();
    pos.top -= $('div#userinfolink_' + id + '_div div.csms_box').height() + 20;
    $('div#userinfolink_' + id + '_div').css(pos);*/

    $('div#userinfolink_' + id + '_div div.csms_box textarea').focus();

    if (typeof userhint_timer != 'undefined' && userhint_timer)
        clearTimeout(userhint_timer);
}

function userhint_hidemessage(id) {
    $('div#userinfolink_' + id + '_div div.actions').show();
    $('div#userinfolink_' + id + '_div div.csms_box').hide();

    userhint_remove(id);
}

function userhint_sendmessage(id, url) {
    var msg = $.trim($('#csms_form_' + id + ' textarea').val());
    if (msg.length == 0) {
        alert('Üres üzenetet nem lehet elküldeni!');
        return;
    }
    
    DexAjax({
        url: url,
        form: 'csms_form_' + id,
        data: {
            source: 'infobox'
        },
        handler: function (res) {
            if (res == 'OK') {
                userhint_hidemessage(id);
            } else {
                alert(res);
            }
        }
    });
}

/* toolheader buttonlist */
function show_btnlist(obj) {
    var submenu = $(obj).parent().next('li');
    
    if (submenu.is(':visible'))
        submenu.slideUp('fast');
    else
        submenu.slideDown('fast');
}

//DesignHelper.ThreeStateControl
function threestate_click(id, val) {
    var hidden = $('#' + id);
    var ctrl = $('#' + id + '_ctrl');
    ctrl.find('div').removeClass('on');
    ctrl.removeClass('val');
    ctrl.removeClass('val0');
    ctrl.removeClass('val1');

    if (val == null) {
        ctrl.find('div.threestate_na').addClass('on');
        ctrl.addClass('val');
        hidden.val('');
    } else if (val == 1) {
        ctrl.find('div.threestate_y').addClass('on');
        ctrl.addClass('val1');
        hidden.val('1');
    } else if (val == 0) {
        ctrl.find('div.threestate_n').addClass('on');
        ctrl.addClass('val0');
        hidden.val('0');
    }
}



//friends
function sessionping_callback_Friends(ret) {
    if (ret != null) {
        if (!window.sessionping) window.sessionping = {};
        window.sessionping.Friends = ret.ts_string;

        $('.onlinefriends span.count').text(ret.count);

        var friends_cont = $('#main_friendslist');
        if (ret.friendlist.length == 0) {
            friends_cont.html($('#main_friendsemptytemplate').html());
        } else {
            friends_cont.html('');
            if (ret.friendlist.length < 20)
                $('#show_allfriends').hide();
            var max = $('#show_allfriends').is(':visible') ? Math.min(ret.friendlist.length, 20) : ret.friendlist.length;
            for (i = 0; i < max; i++) {
                var f = ret.friendlist[i];

                var f_new = $('#main_friendstemplate').clone();
                f_new.attr('id', 'main_friend_' + f.id);
                friends_cont.append(f_new);
                f_new.show();

                var d_new = $('#main_friend_' + f.id);
                d_new.addClass(f.active ? 'active' : 'inactive');
                var l = d_new.find('a').attr('href').replace(/-999999/g, f.id);
                d_new.find('a').attr('href', l);
                d_new.find('a span.name').text(f.displayname);
                d_new.find('a span.image img').attr('src', f.picture);
            }
        }
    }
}

function main_friends_visibility(show) {
    if (show) {
        $('#main_friends_show').hide();
        $('#main_friends_hide').show();
        $('#main_friendscontent').show('fast');
    } else {
        $('#main_friends_show').show();
        $('#main_friends_hide').hide();
        $('#main_friendscontent').hide('fast');
    }

    sessionStorage.Friends = sessionStorage.Friends.substring(0, sessionStorage.Friends.length - 1) + (show ? '1' : '0')
}

function show_csms() {
    if ($('#csms_partners').is(":visible")) {
        $('#csms_partners').hide();
        $('#csms_leftcontent .csms_allmessage').hide();
    } else {
        $('#csms_partners').show();
        $('#csms_leftcontent .csms_allmessage').show();
    }
}

function dexSelItem(o, level) {
    for (var i = 0; o && i < level; i++)
        o = o.parentNode;
    if (!o)
        return;
    //console.log(o);
    //console.log($('> *', o.parentNode));
    $('> *', o.parentNode).removeClass('selected');
    $(o).addClass('selected');
}

function showsearch(o) {
    if ($('#mainsearch input').is(":visible")) {
        $('#mainsearch input').toggle('fast');
        $(o).removeClass("showed");
        if (typeof (localsearch) == 'function')
            localsearch('');
    } else {
        $('#mainsearch input').toggle('fast').focus();
        $(o).addClass("showed");
    }
}

function infobar(type, msg, timeout) {
    $('#infobar').remove();
    var ib = $('<div id="infobar" />');
    var timer;
    var clear = function() {
        if (timer)
            window.clearTimeout(timer);
        ib.slideUp('fast');
    };
    if (timeout)
        timer = window.setTimeout(clear, timeout);
    ib.addClass('infobar_' + type).text(msg).hide();
    ib.html(ib.html().replace(/\n/g, '<br/>'));
    ib.appendTo(document.body).slideDown('fast').click(function () { clear(); });
}

function addFilesToUploader(uploaderId, data, noprefix) {
    //console.debug(data);
    var uo = document.getElementById(uploaderId);
    if (!uo || !uo.FileUploader)
        return;
    return uo.FileUploader.addExistingFiles(data, noprefix ? '' : '+');
}

/***/

jQuery.fn.extend({
    serializeJSON: function () {
        var obj = {};
        $.each(this.serializeArray(), function (i, n) {
            obj[n.name] = n.value;
        });
        return obj;
    }
});

/***/

if (!sessionStorage)
    sessionStorage = {};
function handleErrors(ajax_url) {
    var errorAjaxInProgress = false;
    window.onerror = function (errorMsg, url, lineNumber, column, errObj) {
        if (errorAjaxInProgress || sessionStorage.malwareDetected)
            return false;
        var data = { url: location.href, script: url + ':' + lineNumber + ':' + column, msg: errorMsg };
        if (errObj && errObj.stack) {
            data.stack = errObj.stack;
        }

        //
        var s = '' + url + ' ' + data.stack;
        var malware = null;
        if (s.match(/datafastguru\.info\//))
            malware = 'datafastguru.info';
        else if (s.match(/crbfjs\.info\//))
            malware = 'crbfjs.info';
        else if (s.match(/directrev\.com\//))
            malware = 'directrev.com';
        else if (s.match(/ushopcomp\.com\//))
            malware = 'ushopcomp.com';
        else if (s.match(/yac\.mx\//))
            malware = 'yac.mx';
        else if (s.match(/ttinline\.com\//))
            malware = 'ttinline.com';
        else if (s.match(/staticwebdom\.com\//))
            malware = 'staticwebdom.com';
        else if (s.match(/eshopcomp\.com\//))
            malware = 'eshopcomp.com';

        if (malware) {
            data.stack = 'MALWARE=' + malware + (data.stack ? '\r\n' + data.stack : '');
            sessionStorage.malwareDetected = true;
        }
        //

        if (navigator && navigator.userAgent)
            data.stack = 'USERAGENT=' + navigator.userAgent + (data.stack ? '\r\n' + data.stack : '');

        errorAjaxInProgress = true;
        DexAjax({ url: ajax_url, data: data, handler: function () { }, completedHandler: function () { errorAjaxInProgress = false; } });
        return false;
    };
}

function overlayWithHtml(html, onClose) {
    if (!document.getElementById('OverlayEffect2')) {
        $('<table id="OverlayEffect2"><tr><td>' + html + '</td></tr></table>')
            .appendTo(document.body)
            .show()
            .click(function () { if (onClose) onClose(); $('#OverlayEffect2').remove(); });
    }
}

/* Feedback */
function feedback(send) {
    if (send) {

        if ($('#feedback_form input[name=type]:checked').length == 0) {
            alert('Kérem, válasszon üzenet típust!');
            return;
        }
        if ($('#feedback_form textarea[name=message]').val() == '') {
            alert('Üres üzenet nem küldhető!');
            return;
        }

        DexAjax({
            form: 'feedback_form',
            data: { url: location.href },
            url: url_feedback,
            handler: function (data) {
                //console.debug(data);
                if (data.success === false) {
                    alert('Hiba a küldés során.');
                    return;
                }
                if (data.success === true) {
                    alert('Üzenet sikeresen elküldve.');
                    return;                   
                }
                $.ajax(url_feedback2, { type: 'POST', crossDomain: true, data: data, success: function (data2) {
                        //console.debug(data2);
                    }
                });
            }
        });
    }

    $('.feedback_form').toggle();
    $('.feedback a.icon').toggleClass('hovered');
    $('#feedback_form textarea[name=message]').val('');
    $('#feedback_form input[name=type]').attr('checked', false);  
}


/* ML_input */
function ML_input_change(dis, inp) {
    $(dis).parent().find('a.selected').removeClass('selected');
    $(dis).addClass('selected');
    $('#' + inp + '_text').parent().find('input[type=text]').addClass('hide');
    $('#' + inp + '_text').removeClass('hide').focus();

}

function playsound(url, loop) {
    var e = document.createElement('audio');
    e.style = 'width: 0px; height: 0px; visibility: hidden';
    e.src = url;
    e.controls = false;
    e.loop = !!loop;
    e.autoplay = true;
    document.body.appendChild(e);
    return function () {
        $(e).remove();
    };
}

var SSE_subscriptions = [];

function SSE_subscribe(event, handler) {
    SSE_subscriptions.push({ event: event, handler: handler });
}

function SSE_init(url_sse) {
    var sse;
    if (window.EventSource) {
        window.setTimeout(function () {
            var u = url_sse;
            for (var i = 0; i < SSE_subscriptions.length; i++) {
                var p = SSE_subscriptions[i].event;
                if (u.match(/\?/))
                    u += '&';
                else
                    u += '?';
                u += 's=' + encodeURIComponent(p);
            }
            sse = new EventSource(u);

            sse.addEventListener('message', function (e) {
                console.log('SSE message: ' + e.data);
                var data;
                eval('data = ' + e.data);
                if (data && data.event) { // subscribed events
                    var en = data.event;
                    for (var i = 0; i < SSE_subscriptions.length; i++) {
                        var p = SSE_subscriptions[i];
                        if (en == p.event /*|| en.substr(0, p.event.length + 1) == p.event + '.'*/)
                            p.handler(data);
                    }
                }
            }, false);

            for (var k in window) {
                if (!k.match(/^SSE_on/))
                    continue;
                (function (m) {
                    var n = m.substr(6);
                    sse.addEventListener(n, function (e) {
                        console.log('SSE ' + n + ': ' + e.data);
                        var o = JSON.parse(e.data);
                        window[m](o);
                    }, false);
                })(k);
            }

            sse.addEventListener('open', function (e) {
                console.log('SSE: opened');
            }, false);

            sse.addEventListener('error', function (e) {
                console.log('SSE: ' + e.readyState);
                /*if (e.readyState == EventSource.CLOSED) {
                console.log('SSE: closed');
                }*/
            }, false);
        }, 3000);
    }
}

// sessionping fallback
function sessionping_callback_SSE(ret) {
    //console.debug('SessionPingSSE:');
    //console.debug(ret);
    if (ret && ret.length) {
        for (var i = 0; i < ret.length; i++) {
            var o = ret[i];
            var f = window['SSE_on' + o[0]];
            if (f)
                f(o[1]);
        }
    }
}

// AdminMsg
function SSE_onAdminMsg(data) {
    infobar('I', 'Rendszerüzenet:' + " " + data.Message);
}

// options:
// - url: (default: location.href)
// - form: form idje vagy form objektum vagy form id tömb
// - data: objektum (a key-ek value-jai lehetnek array-ok is)
// - handler(data): contentid nélküli htmlnél és json esetén hívja meg
// - contentid: a visszakapott html-t milyen id-jű containerbe rakja bele
// - method: GET/POST (default: POST)
// - async: true/false
// - insertionMode: default vagy 'ReplaceOuter'
// - errorHandler(textStatus, errorThrown, request.responseText): http hiba esetén fut le
// - indexcollections: OBSOLETE
// - multiform: ha nem üres, akkor ez lesz a neve a Dictionary<string, ExpandoObject>-re bindelhető action paraméternek, ahol a key a form id-je, ExpandoObject pedig a form key-value-jait tartalmazza
// - completedHandler(type, idlist, request): művelet végén fut le (minden típus esetén). idlist: módosított elementek idjei (array)
// - ajax_sel: az ajax indikátor selectora (default: '#ajaxbusy')
// - disable_sel: a futás idejére kiiktatandó gombok selectora (default: nincs)
function DexAjax(options) {
    var url = typeof (options.url) == 'undefined' ? location.href : options.url;
    var async = 1 && options.async;
    var method = typeof (options.method) == 'undefined' || options.method == null ? 'POST' : options.method;

    //alert(insertionMode);
    var ajaxWorking = true;
    var opleasewait;
    if (options.ajax_sel)
        opleasewait = $(options.ajax_sel);
    else
        opleasewait = $('#ajaxbusy');

    if (options.disable_sel) {
        var disableit = $(options.disable_sel);
        disableit.css('visibility', 'hidden');
    }

    window.setTimeout(function () {
        if (ajaxWorking) {
            opleasewait.show();
            opleasewait.css('visibility', 'inherit');
        }
    }, 500);

    if (typeof (FCKeditorAPI) != 'undefined') {
        for (var name in FCKeditorAPI.Instances) {
            var oEditor = FCKeditorAPI.Instances[name];
            try {
                oEditor.UpdateLinkedField();
            } catch (e) { }
        }
    }

    if (typeof (tinymce) != 'undefined') {
        try {
            tinymce.triggerSave();
        }
        catch (e) { }
    }

    var params = [];
    if (options.form) {
        if (options.multiform) {
            var forms;
            if (typeof (options.form) == 'string')
                forms = $('#' + options.form);
            else if (jQuery.isArray(options.form)) {
                var sss = [];
                jQuery.each(options.form, function () {
                    sss.push('#' + this);
                });
                forms = $(sss.join('|'));
            }
            else
                forms = $(options.form);
            forms.each(function (i, f) {
                var a = $(f).serializeArray();
                params.push({ name: options.multiform + '[' + i + '].key', value: f.id });
                jQuery.each(a, function () {
                    params.push({ name: options.multiform + '[' + i + '].value.' + this.name, value: this.value });
                });
            });
        }
        else {
            if (typeof (options.form) == 'string') {
                params = $('#' + options.form).serializeArray();
            }
            else if (jQuery.isArray(options.form)) {
                jQuery.each(options.form, function () {
                    params = jQuery.merge(params, $('#' + this).serializeArray());
                });
            }
            else {
                params = $(options.form).serializeArray();
            }
        }
    }

    if (options.data) {
        for (var k in options.data) {
            var v = options.data[k];
            if (v == null)
                continue;
            if ($.isArray(v)) {
                for (var i = 0; i < v.length; i++)
                    params.push({ name: k, value: v[i] });
            } else
                params.push({ name: k, value: v });
        }
    }

    if (options.indexcollections) {
        // automatikusan beindexeli a name-eket, hogy az MVC default modelbindere tudja értelmezni a collectiont
        // pl. a[]=x,a[]=y,b[]=1 -ből a[0]=x,a[1]=y,b[0]=1 lesz
        var collidx = {};
        var re = /(.+)\[\]/;
        for (var i = 0; i < params.length; i++) {
            var m = params[i].name.match(re);
            if (m) {
                var c = m[1];
                var j = collidx[c];
                if (typeof (j) == 'undefined')
                    j = 0;

                params[i].name = params[i].name.replace(re, c + '[' + j + ']');

                collidx[c] = j + 1;
            }
        }
    }

    params.push({ name: 'X-Requested-With', value: 'XMLHttpRequest' });
    if (typeof (window.__antiCSRFtoken) != 'undefined')
        params.push({ name: '__antiCSRFtoken', value: window.__antiCSRFtoken });

    var erroroccured = false;

    $.ajax({
        async: async,
        type: method,
        url: url,
        data: params,
        cache: false,
        processData: true,
        dataType: 'text',
        complete: function (transport) {
            if (erroroccured)
                return;

            var cookie = transport.getResponseHeader('X-LoginRequired');
            if (cookie) {
                location.href = cookie;
                return;
            }

            var ct = transport.getResponseHeader('Content-Type');
            var res = transport.responseText;
            var type = 'unknown'; // for completedHandler
            var idlist = []; // for completedHandler

            /*if (ct.match(/text\/errormsg-data/)) {
            eval('res = ' + res + ';');
            if (handler)
            handler(res);
            else
            dexalert('unhandled_error: ' + res);
            }*/
            if (ct.match(/text\/errormsg/)) {
                type = 'error';
                if (res)
                    res = res.replace(/\r\n/g, '\n');
                alert(res);
            }
            else if (ct.match(/text\/html/)) {
                type = 'html';
                //if (res.indexOf('Dexter.fw.login') > -1)
                //    location.href = dexconfig['page.login.name'];
                //else {
                if (options.contentid && typeof (options.contentid) == 'string') {
                    idlist.push(options.contentid);
                    if (typeof (options.insertionMode) != 'undefined' && options.insertionMode == 'ReplaceOuter')
                        $(options.contentid ? '#' + options.contentid : '#the_content').hide().after(res).remove();
                    else
                        $(options.contentid ? '#' + options.contentid : '#the_content').html(res);
                }
                else if (options.contentid) {
                    if (typeof (options.insertionMode) != 'undefined' && options.insertionMode == 'ReplaceOuter')
                        $(options.contentid).after(res).remove();
                    else
                        $(options.contentid).html(res);
                }
                else if (options.handler) {
                    options.handler(res);
                }
                //}
            }
            else if (ct.match(/application\/json/)) {
                type = 'json';
                eval('res = ' + res + ';');
                if (options.handler)
                    options.handler(res);
                else
                    alert('Missing AJAX handler!');
            }
            else if (ct.match(/text\/plain/)) {
                type = 'text';
                if (options.handler)
                    options.handler(res);
                //else
                //    alert('Missing AJAX handler!');
            }
            else if (ct.match(/application\/do-refresh/)) {
                type = 'refresh';
                location.href = location.href;
            }
            else if (ct.match(/application\/do-redirect/)) {
                type = 'redirect';
                window.dirty = false; // dirty off
                location.href = res;
            } else if (ct.match(/application\/do-eval/)) {
                type = 'eval';
                var funcStr = "function() { " + res + "}";
                var func = eval('[' + funcStr + ']')[0];
                func();
                //jQuery.globalEval(res);
                //eval(res);
            }
            else if (ct.match(/application\/x-htmlpart/)) {
                type = 'htmlpart';
                try {
                    /* az a baja, hogy a script tageket kiveszi a htmlpartbol
                    $(transport.responseText).each(function () {
                    console.debug(this);
                    var id = this.getAttribute('id');
                    idlist.push(id);
                    var h = this.innerHTML;
                    if ($.browser.msie && parseInt($.browser.version) == 9)
                    h = h.replace(/td>\s+<td/g, 'td><td'); // IE9 fix
                    var o = $('#' + id);
                    if (o.length > 0)
                    o.html(h);
                    else
                    alert('htmlpart missing: ' + id);
                    });
                    */

                    var re = /<htmlpart[^>]*id="([^">]+)"(?:[^>]*autohide="([^">]+)")?[^\/>]*(?:\/>|>((?:(?!<\/htmlpart)[\s\S])*)<\/htmlpart>)/mig;
                    var ms;
                    while ((ms = re.exec(transport.responseText))) {
                        var id = ms[1];
                        var h = ms[3];
                        if (typeof (h) == 'undefined')
                            h = '';

                        if (id == '!infobar!') {
                            var x = $(h);
                            infobar(x.attr('type'), x.attr('message'), 1 * x.attr('timeout'));
                        }
                        else {
                            var o = $('#' + id);
                            idlist.push(id);
                            if (o.length > 0) {
                                if ($.browser.msie && parseInt($.browser.version) == 9) h = h.replace(/td>\s+<td/g, 'td><td'); // buggy with IE9!
                                o.html(h);

                                if (typeof (ms[2]) != 'undefined' && ms[2] != '') {
                                    if (ms[2] != '0')
                                        o.fadeIn('fast').delay(ms[2] * 1000).fadeOut('slow', function () { o.html(''); });
                                    else
                                        o.fadeIn('fast');
                                }

                            } else
                                alert('htmlpart missing: ' + id);
                        }
                    }
                } catch (e) { alert('ERR:' + e); }
            }

            //ajaxfuncs();
            ajaxWorking = false;
            opleasewait.hide();
            //opleasewait.remove();

            if (disableit) {
                disableit.css('visibility', 'inherit');
            }

            if (options.completedHandler)
                options.completedHandler(type, idlist, transport);
        },
        error: function (request, textStatus, errorThrown) {
            erroroccured = true;
            ajaxWorking = false;
            opleasewait.hide();
            //opleasewait.remove();
            if (this.errorHandler) {
                this.errorHandler(textStatus, errorThrown, request.responseText);
            }
            else
                alert('AJAX error\n' + url + '\n' + request.responseText);

        }
    });
    return;
}

//
// options = { width: 720, height: 400, forceType: 'image' }
function DexModal(url, options) {
    var o = $.extend({},
    {
        url: url,
        forceType: 'iframe',
        regexImg: 'DownloadPicture|([^\.]\.(jpg|jpeg|png|tiff|gif|bmp)\s*$)',
        width: options && options.width ? options.width : 900,
        height: options && options.height ? options.height : 550,
        closeButton: '',
        titleFromIframe: false
    }, options);
    $.nyroModalManual(o);
}

var DexModalWins = [];
var DexModalWinId = 1;
function DexModal2(url, options) {
    var o = $.extend({},
    {
        width: options && options.width ? options.width : 900,
        height: options && options.height ? options.height : 550,
    }, options);

    var id = DexModalWinId++;
    var w = { id: id };
    var ol = $('<div class="dm_overlay"/>');
    ol.appendTo(document.body);
    w.overlay = ol;
    var div = $('<div class="dm_win"/>');
    div.css({ width: o.width + 'px', height: o.height + 'px', left: 'calc((100% - ' + o.width + 'px) / 2)', top: 'calc((100% - ' + o.height + 'px) / 2)' });
    div.appendTo(document.body);
    w.div = div;
    fr = $('<iframe/>').attr('src', url);
    fr.appendTo(div);
    window.setTimeout(function() { ol.addClass('anim'); div.addClass('anim'); }, 1);

    w.close = function() {
        w.overlay.remove();
        w.div.remove();
        DexModalWins.pop();
    };
    ol.click(function() { w.close(); });
    DexModalWins.push(w);
}
function DexModal2Close() {
    var w;
    if ((w = DexModalWins.pop())) {
        w.close();
        return true;
    }
    return false;
}

//
function startwizard(url_show, url_post, startPage) {
    new DexWizard(url_show, url_post, startPage);
	return;
}

var DexWizard = function (url_show, url_post, startPage) {
    this.id = 'r' + Math.random().toString().replace(/^0\./, '');
    this.url_show = url_show;
    if (typeof (url_post) != 'undefined')
        this.url_post = url_post;
    else
        this.url_post = url_show.match(/_Show(?:(?=\/$)|(?=\?)|$)/) ? url_show.replace(/_Show(?:(?=\/$)|(?=\?)|$)/, '_Post') : url_show;
    this.currentPage = 0;
    var w = this;
    $.nyroModalManual({
        url: url_show,
        debug: false,
        ajax: { data: { htmlId: this.id }, type: 'post' },
        width: 900,
        height: 550,
        closeButton: '',
        modal: true,
        endShowContent: function (e, s) {
            if (!$('#' + w.id).length)
                return;
            w.init();
            if (startPage)
                w.setPage(startPage);
        }
    });
}

DexWizard.prototype.initElementsOnCurrentPage = function() {
	$('#' + this.id + '_page' + this.currentPage + ' .hasscript').each(function(i, o) {
		var f = window[o.id + '__init'];
		if (f) {
			try {
				f();
			} catch(e) {
				alert(e);
			}
		}
	});
};

DexWizard.prototype.init = function () {
	var w = this;
	var id = this.id;

	$('#' + id + '_prev').click(function () { { w.prev(); $('#' + id + '_info').css('visibility', 'hidden').html(''); } });
	$('#' + id + '_cancel').click(function () { { w.cancel(); } });
	$('#' + id + '_next').click(function () { { w.next(); $('#' + id + '_info').css('visibility', 'hidden').html(''); } });
	$('#' + id + '_finish').one('click', function () { { w.finish(this); } });
	this.updateButtons();

	$('#' + id + ' label.label').each(function (i, o) {
		$(o).mouseenter(function () {
			$('#' + id + '_info').html('<b>' + o.innerHTML + '</b><br/>' + o.title).css('visibility', 'visible');
		});
	});
	$('#' + id + ' input, #' + id + ' select, #' + id + ' textarea').each(function (i, o) {
		var f = function () {
			var oid = o.id;
			if (oid && o.type == 'radio')
				oid = oid.replace(/__[^_]+$/, '');
			var lab = $('#' + id + ' label[for=' + oid.replace(/\./g, '\\.') + ']');
			$('#' + id + '_info').html('<b>' + lab.html() + '</b><br/>' + lab.attr('title')).show();
		};
		$(o).click(f).focus(f);
	});

	this.initElementsOnCurrentPage();

	$('input[id^=\'' + id + '\'], select[id^=\'' + id + '\']').bind('change', function () {
			w.setDisabled(id);
	});

	w.setDisabled(id);
	this.setInputFocus();
}

DexWizard.prototype.setDisabled = function (id) {
	$('#' + id + ' input[id^=\'' + id + '\'] , #' + id + ' select[id^=\'' + id + '\']').each(function () {
		var td = $(this).closest('td');
		var cond = td.data('condition');
		var w = this;
		if (cond) {
			var v = function (fina) {
				var s = w.form.elements[fina];
				var ret;
				if (typeof (s.length) != 'undefined' && s[0].tagName == 'SELECT')
				    ret = s[0].value;
				else
				    ret = s.value;
				if ((typeof ret == 'undefined') || (s.length)) {
					for (var i = 0; i < s.length; i++) {
						if (s[i].checked) {
							ret = s[i].value;
							break;
						}
					}
				}
                //console.debug('v(' + fina + ') = ' + ret);
                return ret;
			};

			var tdcols = td.attr('colspan').value;
			var t = w.value;
			var full = false;   //disable full control
			if (eval(cond)) {
				$(w).attr('disabled', true).trigger("chosen:updated");
				$('label[for=' + $(w).attr('id') + ']').addClass('disabled');
				if (full) {
					td.addClass('disabled');
					if (typeof tdcols === 'undefined' || tdcols === false)
						td.prev('td').addClass('disabled');
				}
			}
			else {
				$(w).removeAttr('disabled').trigger("chosen:updated");
				$('label[for=' + $(w).attr('id') + ']').removeClass('disabled');
				td.removeClass('disabled');
				if (typeof tdcols === 'undefined' || tdcols === false)
					td.prev('td').removeClass('disabled');
			}
		}
	});
}

DexWizard.prototype.setButtonEnabled = function (b, enabled) {
	var o = $('#' + this.id + '_' + b);
	var cn = o.attr('class').match(/\b(?:\S(?!_disabled))+\b/);

	if (enabled) {
		o.removeClass('disabled');
		o.removeClass(cn + '_disabled');
		o.removeClass('linkbutton24_disabled');
		o.removeAttr('disabled');
	}
	else {
		o.addClass('disabled');
		o.addClass(cn + '_disabled');
		o.addClass('linkbutton24_disabled');
		o.attr('disabled', true);
	}
}

DexWizard.prototype.updateButtons = function () {
	this.setButtonEnabled('prev', this.currentPage > 0);
	this.setButtonEnabled('next', $('#' + this.id + '_page' + (this.currentPage + 1)).length > 0);

	var cp = this.currentPage;
	$('#' + this.id + ' .wizard_page_num').each(function (i, o) {
		if (i == cp)
			$(o).addClass('wizard_page_num_active');
		else
			$(o).removeClass('wizard_page_num_active');
	});
	$('#' + this.id + ' table.wizard_pages th').each(function (i, o) {
		if (Math.floor(i / 2) == cp)
			$(o).addClass('active');
		else
			$(o).removeClass('active');
	});
}

DexWizard.prototype.setInputFocus = function () {
	$('#' + this.id + '_page' + this.currentPage + ' input[type=text], #' + this.id + '_page' + this.currentPage + ' textarea').first().focus();
}

DexWizard.prototype.cancel = function () {

	$('#' + this.id + '_page' + this.currentPage + ' .hasscript').each(function (i, o) {
		var f = window[o.id + '__finalize'];
		if (f) {
			try {
				f();
			} catch (e) { alert(e); }
		}
	});

	$.nyroModalRemove();
}

DexWizard.prototype.prev = function () {
    this.setPage(this.currentPage - 1);
}

DexWizard.prototype.next = function () {
    this.setPage(this.currentPage + 1);
}

DexWizard.prototype.setPage = function (newPage) {
    var n = $('#' + this.id + '_page' + newPage);
    if (!n.length)
        return false;

    $('#' + this.id + '_page' + this.currentPage + ' .hasscript').each(function (i, o) {
        var f = window[o.id + '__finalize'];
        if (f) {
            try {
                f();
            } catch (e) { alert(e); }
        }
    });
    $('#' + this.id + '_page' + this.currentPage).hide();

    this.currentPage = newPage;

    $('#' + this.id + '_page' + this.currentPage).show();
    this.initElementsOnCurrentPage();

    this.updateButtons();
    this.setInputFocus();

    return true;
}

DexWizard.prototype.finish = function (btn) {
	var w = this;
	DexAjax({
		url: this.url_post,
		form: this.id,
		type: 'post',
		indexcollections: true,
		disable_sel: '#' + this.id + '_finish',
		handler: function (data) {
			$.nyroModalRemove();
			if (typeof (w.finishHandler) == 'function')
				w.finishHandler(data);
		},

        completedHandler: function (type) {
            if(type != "redirect")
			    $(btn).one('click', function () { { w.finish(this); } });
		}
	});

}

function wiztoolrights(name, helperUrl) {
    var form = $($('#' + name).attr('form'));
    tms_form = form;

    var data = {};
    $('select.toolmembersetting', form).each(function (i, x) {
        data['role' + (i + 1) + '_name'] = $('label[for=' + x.id + ']', form).text();
        data['role' + (i + 1)] = x.value;
    });

    $('#nyroModalContent > form, #nyroModalContent > div').hide();
    
    $.ajax({
        url: helperUrl,
        data: data,
        type: 'post',
        success: function(html) {
            $('#nyroModalContent').append(html);
        }
    });
}

function wiztoolrights_close(ok, valuesorig) {
    var values = [];
    for (var x in valuesorig)
        if (typeof (valuesorig[x]) != 'undefined')
            values.push(valuesorig[x]);
    if (ok) {

        DexAjax({ url: ok, data: { settings: values }, handler: function (res) {

            $('select.toolmembersetting', tms_form).each(function (i, x) {
                var found = false;
                $('option', x).each(function (j, y) {
                    if (y.value == res[i].ids)
                        found = true;
                });
                if (!found) {
                    var o = document.createElement('option');
                    o.value = res[i].ids;
                    $(o).text(res[i].names);
                    x.appendChild(o);
                }
                x.value = res[i].ids;
            });

        } 
        });
    }
    $('#nyroModalContent > div:visible').remove();
    $('#nyroModalContent > form, #nyroModalContent > div').fadeIn('fast');
}

function wiztoolrights_update(role) {
    var tr = 1;
    while ($('#tms_role' + tr).length == 1) {
        
        var sett = $('#tms_role' + tr).val().split(',');
        var members = $('#tms_members' + role);

        var group = false;
        var users = {};
        $(sett).each(function (i, s) {
            if (s.match(/^[uU]/))
                users[s.substring(1)] = s[0] == 'U';
            else if (s == '-1' || s == role)
                group = true;
        });
        if (group)
            $('#G_' + role + '_' + tr).attr('checked', 'checked');
        else
            $('#G_' + role + '_' + tr).removeAttr('checked');

        $('#tms_members' + role + ' input.tr' + tr).each(function (i, o) {
            var id = o.id.split('_');
            o.checked = users[id[1]] === true || (group && users[id[1]] !== false);
        });

        tr++;
    }
}

function wiztoolrights_setrolemembers(role, members) {
    if (typeof (tms_rolemembers) == 'undefined')
        tms_rolemembers = {};
    tms_rolemembers[role] = members;
}

/*
var tms_ucache = {};
function wiztoolrights_gname(role) {
    return $('#tms_rname' + role).text();
}
function wiztoolrights_uname(user) {
    if (typeof (tms_ucache[user]) != 'undefined')
        return tms_ucache[user];
    var n = $('#tms_uname' + user).text();
    tms_ucache[user] = n;
    return n;
}
*/

function wiztoolrights_gset(role, tr, checked) {
    var ttt = $('#tms_role' + tr).val();
    var sett = ttt == '' ? [] : ttt.split(',');
    var s = [];
    var rm = tms_rolemembers[role];
    var found = false;
    if (role == -1) {
        if (checked)
            s.push(-1);
        $('input.gtr' + tr).each(function (i, o) {
            o.checked = checked;
            var role2 = o.id.split('_')[1];
            if (checked)
                s.push(role2);
            $('#tms_members' + role2 + ' input.tr' + tr).each(function (i, o) {
                var id = o.id.split('_');
                o.checked = checked;
            });
        });
    }
    else {
        $('#G_-1_' + tr).each(function (i, o) { o.checked = false; });
        $(sett).each(function (i, v) {
            if (v[0] == (checked ? 'U' : 'u') && rm.indexOf(parseInt(v.substring(1))) >= 0)
                return;
            if (v == '-1')
                return;
            if (v != role)
                s.push(v);
            else if (v == role && checked) {
                found = true;
                s.push(v);
            }
        });
        if (checked && !found)
            s.push(role);
    }
    $('#tms_role' + tr).val(s.join(','));

    $('#tms_members' + role + ' input.tr' + tr).each(function (i, o) {
        o.checked = checked;
    });
}

function wiztoolrights_uset(group, user, tr, checked) {
    var ttt = $('#tms_role' + tr).val();
    var sett = ttt == '' ? [] : ttt.split(',');
    var s = [];
    var found = false;
    var ingroup = sett.indexOf(group.toString()) >= 0 || sett.indexOf('-1') >= 0;
    $(sett).each(function(i, v) {
        //var v = sett[i];
        if (v == 'U' + user || v == 'u' + user) {
            found = true;
            if (ingroup != checked)
                s.push((checked ? 'U' : 'u') + user);
        }
        else
            s.push(v);
    });
    if (!found && ingroup != checked)
        s.push((checked ? 'U' : 'u') + user);

    $('#tms_role' + tr).val(s.join(','));
}

function wiztoolrights_showselect() {
    $('div.customselect').show();
}

function wiztoolrights_hideselect() {
    $('div.customselect').hide();
}

function wiztoolrights_changeselect(tr) {
    var checked = $('#buttonaction_add').is(':checked');
    var list = $('#usercodes').val();

    if ($.trim(list) == '') {
        alert('A lista üres. Adjon meg felhasználókódokat (pontos)vesszővel elválasztva vagy új sorokban!')
        return false;
    }

    DexAjax({
        url: url_customselect,
        data: {
            pattern: list
        },
        handler: function (data) {
            $('#usercodes').val(data.NotFound.join('\n'));

            $(data.Found).each(function (i, e) {
                if (checked)
                    $('#U_' + e.UserId + '_' + tr).attr('checked', 'checked');
                else
                    $('#U_' + e.UserId + '_' + tr).removeAttr('checked');

                wiztoolrights_uset(e.RoleId, e.UserId, tr, checked);
            });

            if (data.NotFound.length == 0)
                wiztoolrights_hideselect();
            else {
                var msg = 'Sikeresen megjelölve: {0}\nIsmeretlen kód vagy nem tagja a színtérnek: {1}';
                msg = msg.replace(/\{0\}/g, data.Found.length);
                msg = msg.replace(/\{1\}/g, data.NotFound.length);

                alert(msg);
            }


        }
    });
}
function _t(s, textid) {
    return s;
}

/*
Uploadify v2.1.4
Release Date: November 8, 2010

Copyright (c) 2010 Ronnie Garcia, Travis Nickels

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

if(jQuery)(
	function(jQuery){
		jQuery.extend(jQuery.fn,{
			uploadify:function(options) {
				jQuery(this).each(function(){
					var settings = jQuery.extend({
					id              : jQuery(this).attr('id'), // The ID of the object being Uploadified
					uploader        : 'uploadify.swf', // The path to the uploadify swf file
					script          : 'uploadify.php', // The path to the uploadify backend upload script
					expressInstall  : null, // The path to the express install swf file
					folder          : '', // The path to the upload folder
					height          : 30, // The height of the flash button
					width           : 120, // The width of the flash button
					cancelImg       : 'cancel.png', // The path to the cancel image for the default file queue item container
					wmode           : 'opaque', // The wmode of the flash file
					scriptAccess    : 'sameDomain', // Set to "always" to allow script access across domains
					fileDataName    : 'Filedata', // The name of the file collection object in the backend upload script
					method          : 'POST', // The method for sending variables to the backend upload script
					queueSizeLimit  : 999, // The maximum size of the file queue
					simUploadLimit  : 1, // The number of simultaneous uploads allowed
					queueID         : false, // The optional ID of the queue container
					displayData     : 'percentage', // Set to "speed" to show the upload speed in the default queue item
					removeCompleted : true, // Set to true if you want the queue items to be removed when a file is done uploading
					onInit          : function() {}, // Function to run when uploadify is initialized
					onSelect        : function() {}, // Function to run when a file is selected
					onSelectOnce    : function() {}, // Function to run once when files are added to the queue
					onQueueFull     : function() {}, // Function to run when the queue reaches capacity
					onCheck         : function() {}, // Function to run when script checks for duplicate files on the server
					onCancel        : function() {}, // Function to run when an item is cleared from the queue
					onClearQueue    : function() {}, // Function to run when the queue is manually cleared
					onError         : function() {}, // Function to run when an upload item returns an error
					onProgress      : function() {}, // Function to run each time the upload progress is updated
					onComplete      : function() {}, // Function to run when an upload is completed
					onAllComplete   : function() {}  // Function to run when all uploads are completed
				}, options);
				jQuery(this).data('settings',settings);
				var pagePath = location.pathname;
				pagePath = pagePath.split('/');
				pagePath.pop();
				pagePath = pagePath.join('/') + '/';
				var data = {};
				data.uploadifyID = settings.id;
				data.pagepath = pagePath;
				if (settings.buttonImg) data.buttonImg = escape(settings.buttonImg);
				if (settings.buttonText) data.buttonText = escape(settings.buttonText);
				if (settings.rollover) data.rollover = true;
				data.script = settings.script;
				data.folder = escape(settings.folder);
				if (settings.scriptData) {
					var scriptDataString = '';
					for (var name in settings.scriptData) {
						scriptDataString += '&' + name + '=' + settings.scriptData[name];
					}
					data.scriptData = escape(scriptDataString.substr(1));
				}
				data.width          = settings.width;
				data.height         = settings.height;
				data.wmode          = settings.wmode;
				data.method         = settings.method;
				data.queueSizeLimit = settings.queueSizeLimit;
				data.simUploadLimit = settings.simUploadLimit;
				if (settings.hideButton)   data.hideButton   = true;
				if (settings.fileDesc)     data.fileDesc     = settings.fileDesc;
				if (settings.fileExt)      data.fileExt      = settings.fileExt;
				if (settings.multi)        data.multi        = true;
				if (settings.auto)         data.auto         = true;
				if (settings.sizeLimit)    data.sizeLimit    = settings.sizeLimit;
				if (settings.checkScript)  data.checkScript  = settings.checkScript;
				if (settings.fileDataName) data.fileDataName = settings.fileDataName;
				if (settings.queueID)      data.queueID      = settings.queueID;
				if (settings.onInit() !== false) {
					jQuery(this).css('display','none');
					jQuery(this).after('<div id="' + jQuery(this).attr('id') + 'Uploader"></div>');
					swfobject.embedSWF(settings.uploader, settings.id + 'Uploader', settings.width, settings.height, '9.0.24', settings.expressInstall, data, {'quality':'high','wmode':settings.wmode,'allowScriptAccess':settings.scriptAccess},{},function(event) {
						if (typeof(settings.onSWFReady) == 'function' && event.success) settings.onSWFReady();
					});
					if (settings.queueID == false) {
						jQuery("#" + jQuery(this).attr('id') + "Uploader").after('<div id="' + jQuery(this).attr('id') + 'Queue" class="uploadifyQueue"></div>');
					} else {
						jQuery("#" + settings.queueID).addClass('uploadifyQueue');
					}
				}
				if (typeof(settings.onOpen) == 'function') {
					jQuery(this).bind("uploadifyOpen", settings.onOpen);
				}
				jQuery(this).bind("uploadifySelect", {'action': settings.onSelect, 'queueID': settings.queueID}, function(event, ID, fileObj) {
					if (event.data.action(event, ID, fileObj) !== false) {
						var byteSize = Math.round(fileObj.size / 1024 * 100) * .01;
						var suffix = 'KB';
						if (byteSize > 1000) {
							byteSize = Math.round(byteSize *.001 * 100) * .01;
							suffix = 'MB';
						}
						var sizeParts = byteSize.toString().split('.');
						if (sizeParts.length > 1) {
							byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0,2);
						} else {
							byteSize = sizeParts[0];
						}
						if (fileObj.name.length > 20) {
							fileName = fileObj.name.substr(0,20) + '...';
						} else {
							fileName = fileObj.name;
						}
						queue = '#' + jQuery(this).attr('id') + 'Queue';
						if (event.data.queueID) {
							queue = '#' + event.data.queueID;
						}
						jQuery(queue).append('<div id="' + jQuery(this).attr('id') + ID + '" class="uploadifyQueueItem">\
								<div class="cancel">\
									<a href="javascript:jQuery(\'#' + jQuery(this).attr('id') + '\').uploadifyCancel(\'' + ID + '\')"><img src="' + settings.cancelImg + '" border="0" /></a>\
								</div>\
								<span class="fileName">' + fileName + ' (' + byteSize + suffix + ')</span><span class="percentage"></span>\
								<div class="uploadifyProgress">\
									<div id="' + jQuery(this).attr('id') + ID + 'ProgressBar" class="uploadifyProgressBar"><!--Progress Bar--></div>\
								</div>\
							</div>');
					}
				});
				jQuery(this).bind("uploadifySelectOnce", {'action': settings.onSelectOnce}, function(event, data) {
					event.data.action(event, data);
					if (settings.auto) {
						if (settings.checkScript) { 
							jQuery(this).uploadifyUpload(null, false);
						} else {
							jQuery(this).uploadifyUpload(null, true);
						}
					}
				});
				jQuery(this).bind("uploadifyQueueFull", {'action': settings.onQueueFull}, function(event, queueSizeLimit) {
					if (event.data.action(event, queueSizeLimit) !== false) {
						alert('The queue is full.  The max size is ' + queueSizeLimit + '.');
					}
				});
				jQuery(this).bind("uploadifyCheckExist", {'action': settings.onCheck}, function(event, checkScript, fileQueueObj, folder, single) {
					var postData = new Object();
					postData = fileQueueObj;
					postData.folder = (folder.substr(0,1) == '/') ? folder : pagePath + folder;
					if (single) {
						for (var ID in fileQueueObj) {
							var singleFileID = ID;
						}
					}
					jQuery.post(checkScript, postData, function(data) {
						for(var key in data) {
							if (event.data.action(event, data, key) !== false) {
								var replaceFile = confirm("Do you want to replace the file " + data[key] + "?");
								if (!replaceFile) {
									document.getElementById(jQuery(event.target).attr('id') + 'Uploader').cancelFileUpload(key,true,true);
								}
							}
						}
						if (single) {
							document.getElementById(jQuery(event.target).attr('id') + 'Uploader').startFileUpload(singleFileID, true);
						} else {
							document.getElementById(jQuery(event.target).attr('id') + 'Uploader').startFileUpload(null, true);
						}
					}, "json");
				});
				jQuery(this).bind("uploadifyCancel", {'action': settings.onCancel}, function(event, ID, fileObj, data, remove, clearFast) {
					if (event.data.action(event, ID, fileObj, data, clearFast) !== false) {
						if (remove) { 
							var fadeSpeed = (clearFast == true) ? 0 : 250;
							jQuery("#" + jQuery(this).attr('id') + ID).fadeOut(fadeSpeed, function() { jQuery(this).remove() });
						}
					}
				});
				jQuery(this).bind("uploadifyClearQueue", {'action': settings.onClearQueue}, function(event, clearFast) {
					var queueID = (settings.queueID) ? settings.queueID : jQuery(this).attr('id') + 'Queue';
					if (clearFast) {
						jQuery("#" + queueID).find('.uploadifyQueueItem').remove();
					}
					if (event.data.action(event, clearFast) !== false) {
						jQuery("#" + queueID).find('.uploadifyQueueItem').each(function() {
							var index = jQuery('.uploadifyQueueItem').index(this);
							jQuery(this).delay(index * 100).fadeOut(250, function() { jQuery(this).remove() });
						});
					}
				});
				var errorArray = [];
				jQuery(this).bind("uploadifyError", {'action': settings.onError}, function(event, ID, fileObj, errorObj) {
					if (event.data.action(event, ID, fileObj, errorObj) !== false) {
						var fileArray = new Array(ID, fileObj, errorObj);
						errorArray.push(fileArray);
						jQuery("#" + jQuery(this).attr('id') + ID).find('.percentage').text(" - " + errorObj.type + " Error");
						jQuery("#" + jQuery(this).attr('id') + ID).find('.uploadifyProgress').hide();
						jQuery("#" + jQuery(this).attr('id') + ID).addClass('uploadifyError');
					}
				});
				if (typeof(settings.onUpload) == 'function') {
					jQuery(this).bind("uploadifyUpload", settings.onUpload);
				}
				jQuery(this).bind("uploadifyProgress", {'action': settings.onProgress, 'toDisplay': settings.displayData}, function(event, ID, fileObj, data) {
					if (event.data.action(event, ID, fileObj, data) !== false) {
						jQuery("#" + jQuery(this).attr('id') + ID + "ProgressBar").animate({'width': data.percentage + '%'},250,function() {
							if (data.percentage == 100) {
								jQuery(this).closest('.uploadifyProgress').fadeOut(250,function() {jQuery(this).remove()});
							}
						});
						if (event.data.toDisplay == 'percentage') displayData = ' - ' + data.percentage + '%';
						if (event.data.toDisplay == 'speed') displayData = ' - ' + data.speed + 'KB/s';
						if (event.data.toDisplay == null) displayData = ' ';
						jQuery("#" + jQuery(this).attr('id') + ID).find('.percentage').text(displayData);
					}
				});
				jQuery(this).bind("uploadifyComplete", {'action': settings.onComplete}, function(event, ID, fileObj, response, data) {
					if (event.data.action(event, ID, fileObj, unescape(response), data) !== false) {
						jQuery("#" + jQuery(this).attr('id') + ID).find('.percentage').text(' - Completed');
						if (settings.removeCompleted) {
							jQuery("#" + jQuery(event.target).attr('id') + ID).fadeOut(250,function() {jQuery(this).remove()});
						}
						jQuery("#" + jQuery(event.target).attr('id') + ID).addClass('completed');
					}
				});
				if (typeof(settings.onAllComplete) == 'function') {
					jQuery(this).bind("uploadifyAllComplete", {'action': settings.onAllComplete}, function(event, data) {
						if (event.data.action(event, data) !== false) {
							errorArray = [];
						}
					});
				}
			});
		},
		uploadifySettings:function(settingName, settingValue, resetObject) {
			var returnValue = false;
			jQuery(this).each(function() {
				if (settingName == 'scriptData' && settingValue != null) {
					if (resetObject) {
						var scriptData = settingValue;
					} else {
						var scriptData = jQuery.extend(jQuery(this).data('settings').scriptData, settingValue);
					}
					var scriptDataString = '';
					for (var name in scriptData) {
						scriptDataString += '&' + name + '=' + scriptData[name];
					}
					settingValue = escape(scriptDataString.substr(1));
				}
				returnValue = document.getElementById(jQuery(this).attr('id') + 'Uploader').updateSettings(settingName, settingValue);
			});
			if (settingValue == null) {
				if (settingName == 'scriptData') {
					var returnSplit = unescape(returnValue).split('&');
					var returnObj   = new Object();
					for (var i = 0; i < returnSplit.length; i++) {
						var iSplit = returnSplit[i].split('=');
						returnObj[iSplit[0]] = iSplit[1];
					}
					returnValue = returnObj;
				}
			}
			return returnValue;
		},
		uploadifyUpload:function(ID,checkComplete) {
			jQuery(this).each(function() {
				if (!checkComplete) checkComplete = false;
				document.getElementById(jQuery(this).attr('id') + 'Uploader').startFileUpload(ID, checkComplete);
			});
		},
		uploadifyCancel:function(ID) {
			jQuery(this).each(function() {
				document.getElementById(jQuery(this).attr('id') + 'Uploader').cancelFileUpload(ID, true, true, false);
			});
		},
		uploadifyClearQueue:function() {
			jQuery(this).each(function() {
				document.getElementById(jQuery(this).attr('id') + 'Uploader').clearFileUploadQueue(false);
			});
		}
	})
})(jQuery);
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
})(jQuery);
jQuery.fn.maxLength = function (max) {
    this.each(function () {
        //Get the type of the matched element
        var type = this.tagName.toLowerCase();
        //If the type property exists, save it in lower case
        var inputType = this.type ? this.type.toLowerCase() : null;
        //Check if is a input type=text OR type=password
        if (type == "input" && inputType == "text" || inputType == "password") {
            //Apply the standard maxLength
            this.maxLength = max;
        }
        //Check if the element is a textarea
        else if (type == "textarea") {
            //Add the key press event
            this.onkeypress = function (e) {
                //Get the event object (for IE)
                var ob = e || event;
                //Get the code of key pressed
                var keyCode = ob.keyCode;
                //Check if it has a selected text
                var hasSelection = document.selection ? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                //return false if can't write more
                return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
            };
            //Add the key up event
            this.onkeyup = function () {
                //If the keypress fail and allow write more text that required, this event will remove it
                if (this.value.length > max) {
                    this.value = this.value.substring(0, max);
                }
            };
        }
    });
};
/**
* jQuery.query - Query String Modification and Creation for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/8/13
*
* @author Blair Mitchelmore
* @version 2.1.7
*
**/
new function (settings) {
    // Various Settings
    var $separator = settings.separator || '&';
    var $spaces = settings.spaces === false ? false : true;
    var $suffix = settings.suffix === false ? '' : '[]';
    var $prefix = settings.prefix === false ? false : true;
    var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
    var $numbers = settings.numbers === false ? false : true;

    jQuery.query = new function () {
        var is = function (o, t) {
            return o != undefined && o !== null && (!!t ? o.constructor == t : true);
        };
        var parse = function (path) {
            var m, rx = /\[([^[]*)\]/g, match = /^([^[]+)(\[.*\])?$/.exec(path), base = match[1], tokens = [];
            while (m = rx.exec(match[2])) tokens.push(m[1]);
            return [base, tokens];
        };
        var set = function (target, tokens, value) {
            var o, token = tokens.shift();
            if (typeof target != 'object') target = null;
            if (token === "") {
                if (!target) target = [];
                if (is(target, Array)) {
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                } else if (is(target, Object)) {
                    var i = 0;
                    while (target[i++] != null);
                    target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
                } else {
                    target = [];
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                }
            } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
                var index = parseInt(token, 10);
                if (!target) target = [];
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else if (token) {
                var index = token.replace(/^\s*|\s*$/g, "");
                if (!target) target = {};
                if (is(target, Array)) {
                    var temp = {};
                    for (var i = 0; i < target.length; ++i) {
                        temp[i] = target[i];
                    }
                    target = temp;
                }
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else {
                return value;
            }
            return target;
        };

        var queryObject = function (a) {
            var self = this;
            self.keys = {};

            if (a.queryObject) {
                jQuery.each(a.get(), function (key, val) {
                    self.SET(key, val);
                });
            } else {
                jQuery.each(arguments, function () {
                    var q = "" + this;
                    q = q.replace(/^[?#]/, ''); // remove any leading ? || #
                    q = q.replace(/[;&]$/, ''); // remove any trailing & || ;
                    if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

                    jQuery.each(q.split(/[&;]/), function () {
                        var key = decodeURIComponent(this.split('=')[0] || "");
                        var val = decodeURIComponent(this.split('=')[1] || "");

                        if (!key) return;

                        if ($numbers) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                                val = parseFloat(val);
                            else if (/^[+-]?[0-9]+$/.test(val)) // simple int regex
                                val = parseInt(val, 10);
                        }

                        val = (!val && val !== 0) ? true : val;

                        if (val !== false && val !== true && typeof val != 'number')
                            val = val;

                        self.SET(key, val);
                    });
                });
            }
            return self;
        };

        queryObject.prototype = {
            queryObject: true,
            has: function (key, type) {
                var value = this.get(key);
                return is(value, type);
            },
            GET: function (key) {
                if (!is(key)) return this.keys;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                while (target != null && tokens.length != 0) {
                    target = target[tokens.shift()];
                }
                return typeof target == 'number' ? target : target || "";
            },
            get: function (key) {
                var target = this.GET(key);
                if (is(target, Object))
                    return jQuery.extend(true, {}, target);
                else if (is(target, Array))
                    return target.slice(0);
                return target;
            },
            SET: function (key, val) {
                var value = !is(val) ? null : val;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                this.keys[base] = set(target, tokens.slice(0), value);
                return this;
            },
            set: function (key, val) {
                return this.copy().SET(key, val);
            },
            REMOVE: function (key) {
                return this.SET(key, null).COMPACT();
            },
            remove: function (key) {
                return this.copy().REMOVE(key);
            },
            EMPTY: function () {
                var self = this;
                jQuery.each(self.keys, function (key, value) {
                    delete self.keys[key];
                });
                return self;
            },
            load: function (url) {
                var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
                var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
                return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
            },
            empty: function () {
                return this.copy().EMPTY();
            },
            copy: function () {
                return new queryObject(this);
            },
            COMPACT: function () {
                function build(orig) {
                    var obj = typeof orig == "object" ? is(orig, Array) ? [] : {} : orig;
                    if (typeof orig == 'object') {
                        function add(o, key, value) {
                            if (is(o, Array))
                                o.push(value);
                            else
                                o[key] = value;
                        }
                        jQuery.each(orig, function (key, value) {
                            if (!is(value)) return true;
                            add(obj, key, build(value));
                        });
                    }
                    return obj;
                }
                this.keys = build(this.keys);
                return this;
            },
            compact: function () {
                return this.copy().COMPACT();
            },
            toString: function () {
                var i = 0, queryString = [], chunks = [], self = this;
                var encode = function (str) {
                    str = str + "";
                    if ($spaces) str = str.replace(/ /g, "+");
                    return encodeURIComponent(str);
                };
                var addFields = function (arr, key, value) {
                    if (!is(value) || value === false) return;
                    var o = [encode(key)];
                    if (value !== true) {
                        o.push("=");
                        o.push(encode(value));
                    }
                    arr.push(o.join(""));
                };
                var build = function (obj, base) {
                    var newKey = function (key) {
                        return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
                    };
                    jQuery.each(obj, function (key, value) {
                        if (typeof value == 'object')
                            build(value, newKey(key));
                        else
                            addFields(chunks, newKey(key), value);
                    });
                };

                build(this.keys);

                if (chunks.length > 0) queryString.push($hash);
                queryString.push(chunks.join($separator));

                return queryString.join("");
            }
        };

        return new queryObject(location.search, location.hash);
    };
} (jQuery.query || {}); // Pass in jQuery.query as settings object
if (typeof(window.dirty) == 'undefined')
    window.dirty = false;
if (typeof(window.dirtymsg) == 'undefined')
    window.dirtymsg = 'Figyelem! Mentés nélkül kívánja elhagyni az oldalt. Folytatja?';

history.navigationMode = 'compatible';

window.onbeforeunload = function () {
    if (dirty) {
        return window.dirtymsg;
    }
};

function confirmdirty() {

    if (dirty) {
        if (confirm(dirtymsg)) {
            dirty = false;
            return true;
        } else {
            return false;
        }
    }

    return true;
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
          this[from] === elt)
                return from;
        }
        return -1;
    };
}

if (!(window.console && console.log)) {
    console = {
        log: function () { },
        debug: function () { },
        info: function () { },
        warn: function () { },
        error: function () { }
    };
}
if (!console.debug)
    console.debug = console.log;

var advtb_cache = {};

// example: new ArrayEditor('#ae1', value, , ', ', null, 'Test1/AdvancedTextBoxAutoComplete');
function ArrayEditor(id, value, re_sep, sep, re_valid, ac_url) {

    this.o = $('#' + id);
    this.name = this.o.attr('name');
    //this.o.removeAttr('name'); // úgyis üres lesz a value-ja
    this.o.wrap('<ul class="arrayeditor"><li class="input"></li></ul>');

    if ((typeof (re_sep) == 'undefined') || (re_sep === null))
        //re_sep = /\s*(?:,|\s)\s*/;
        re_sep = /\s*,\s*/;
    if (typeof (sep) == 'undefined' || sep === null)
        sep = ', ';

    var diz = this;

    this.process = function (mode, m) {
        var o = this.o[0];
        if (typeof (m) == 'undefined')
            m = o.value.split(re_sep);

        while (m.length > mode && m[mode] != '') {
            var ms = m.shift();
            var h = $('<input type="hidden"/>').attr('name', diz.name).attr('value', ms);
            //var b1 = $('<span>[E]</span>').click(function (ev) { diz.process(0); o.value = $('input', ev.target.parentNode).val(); $(ev.target.parentNode).detach(); });
            var b2 = $('<span class="remove"></span>').click(function (ev) { $(ev.target.parentNode).detach(); });
            var x = $('<li/>').text(ms).append(h) //.append(b1).append(b2);
            //.click(function (ev) { diz.process(0); o.value = $('input', ev.target).val(); $(ev.target).detach(); o.focus(); })
                .append(b2);
            if (re_valid && !ms.match(re_valid))
                x.addClass('invalid');
            $(o.parentNode).before(x);
            o.value = m.join(sep);
        }
        return m;
    }

    this.process(0, $.isArray(value) ? value : value.split(re_sep));

    this.o /*.keydown(function (ev) {
        var o = ev.target;
        var v = o.value;
        if (ev.keyCode == 8 && v == '') {
            $(o.parentNode.previousSibling).detach();
            return;
        }
    })*/.keyup(function (ev) {
        var o = ev.target;
        var v = o.value;
        diz.process(1);
        // autocomplete
        if (ac_url && o.value != '') {
            var ac = $('div', o.parentNode);

            if (ev.keyCode == 27) {
                ac.hide();
                return false;
            }

            if (ac.length == 0) {
                ac = $('<div>...</div>');
                $(o).before(ac);
            }

            var ainit = function () {
                if ((window.innerHeight - o.offsetTop) < 200)
                    ac.css({ 'margin-top': '-' + ac.height() + 'px' });

                if (ac.children().length == 0) {
                    ac.hide();
                } else {
                    ac.show();
                }

                $('a', ac).click(function (ev2) {
                    var o2 = ev2.target;
                    //alert($(o2).text());
                    o.value = $(o2).text();
                    o.value = diz.process(0).join(sep);

                    ac.detach();
                    o.focus();
                });
            };

            if (typeof (advtb_cache[ac_url + ' ' + o.value]) == 'undefined') {
                ac.load(ac_url, [{ name: 'filter', value: o.value}], function (res) {
                    advtb_cache[ac_url + ' ' + o.value] = res;
                    ainit();
                });
            } else {
                ac.html(advtb_cache[ac_url + ' ' + o.value]);
                ainit();
            }
        }
    })/*.blur(function (ev) {
        console.debug(ev);
        window.setTimeout(function () {
        var o = ev.target;
        var tmp = diz.process(0);
        o.value = tmp.join(sep);

        // hide autocomplete
        $('div', o.parentNode).detach();
        }, 500);
    })*/;
}

/*
Stylish Select 0.4.1 - $ plugin to replace a select drop down box with a stylable unordered list
http://github.com/sko77sun/Stylish-Select

Requires: jQuery 1.3 or newer

Contributions from Justin Beasley: http://www.harvest.org/ & Anatoly Ressin: http://www.artazor.lv/

Dual licensed under the MIT and GPL licenses.

*/
(function($){
	//add class to html tag
	$('html').addClass('stylish-select');

	//create cross-browser indexOf
	Array.prototype.indexOf = function (obj, start) {
		for (var i = (start || 0); i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
	}

	//utility methods
	$.fn.extend({
		getSetSSValue: function(value){
			if (value){
				//set value and trigger change event
				$(this).val(value).change();
				return this;
			} else {
				return $(this).find(':selected').val();
			}
		},
		//added by Justin Beasley
		resetSS: function(){
			var oldOpts = $(this).data('ssOpts');
			$this = $(this);
			$this.next().remove();
			//unbind all events and redraw
			$this.unbind('.sSelect').sSelect(oldOpts);
		}
	});

	$.fn.sSelect = function(options) {

		return this.each(function(){

		var defaults = {
			defaultText: 'Please select',
			animationSpeed: 0, //set speed of dropdown
			ddMaxHeight: '', //set css max-height value of dropdown
			containerClass: '' //additional classes for container div
		};

		//initial variables
		var opts = $.extend(defaults, options),
		$input = $(this),
		$containerDivText = $('<div class="selectedTxt"></div>'),
		$containerDiv = $('<div class="newListSelected ' + opts.containerClass + '"></div>'),
		$newUl = $('<ul class="newList" style="visibility:hidden;"></ul>'),
		itemIndex = -1,
		currentIndex = -1,
		keys = [],
		prevKey = false,
		prevented = false,
		$newLi;

		//added by Justin Beasley
		$(this).data('ssOpts',options);

		//build new list
		$containerDiv.insertAfter($input);
		$containerDiv.attr("tabindex", $input.attr("tabindex") || "0");
		$containerDivText.prependTo($containerDiv);
		$newUl.appendTo($containerDiv);
		$input.hide();

		//added by Justin Beasley (used for lists initialized while hidden)
		$containerDivText.data('ssReRender',!$containerDivText.is(':visible'));

            //test for optgroup
            if ($input.children('optgroup').length == 0){
                $input.children().each(function(i){
                    var option = $(this).html();
                    var key = $(this).val();

                    //add first letter of each word to array
                    keys.push(option.charAt(0).toLowerCase());
                    if ($(this).attr('selected') == true){
                        opts.defaultText = option;
                        currentIndex = i;
                    }
                    $newUl.append($('<li><a href="JavaScript:void(0);">'+option+'</a></li>').data('key', key));

                });
                //cache list items object
                $newLi = $newUl.children().children();

            } else { //optgroup
                $input.children('optgroup').each(function(){

                    var optionTitle = $(this).attr('label'),
                    $optGroup = $('<li class="newListOptionTitle">'+optionTitle+'</li>');

                    $optGroup.appendTo($newUl);

                    var $optGroupList = $('<ul></ul>');

                    $optGroupList.appendTo($optGroup);

                    $(this).children().each(function(){
                        ++itemIndex;
                        var option = $(this).html();
                        var key = $(this).val();
                        //add first letter of each word to array
                        keys.push(option.charAt(0).toLowerCase());
                        if ($(this).attr('selected') == true){
                            opts.defaultText = option;
                            currentIndex = itemIndex;
                        }
                        $optGroupList.append($('<li><a href="JavaScript:void(0);">'+option+'</a></li>').data('key',key));
                    })
                });
                //cache list items object
                $newLi = $newUl.find('ul li a');
            }

            //get heights of new elements for use later
            var newUlHeight = $newUl.height(),
            containerHeight = $containerDiv.height(),
            newLiLength = $newLi.length;

            //check if a value is selected
            if (currentIndex != -1){
                navigateList(currentIndex, true);
            } else {
                //set placeholder text
                $containerDivText.text(opts.defaultText);
            }

            //decide if to place the new list above or below the drop-down
            function newUlPos(){
                var containerPosY = $containerDiv.offset().top,
                docHeight = jQuery(window).height(),
                scrollTop = jQuery(window).scrollTop();

                //if height of list is greater then max height, set list height to max height value
                if (newUlHeight > parseInt(opts.ddMaxHeight)) {
                    newUlHeight = parseInt(opts.ddMaxHeight);
                }

                containerPosY = containerPosY-scrollTop;
                if (containerPosY+newUlHeight >= docHeight){
                    $newUl.css({
                        top: '-'+newUlHeight+'px',
                        height: newUlHeight
                    });
                    $input.onTop = true;
                } else {
                    $newUl.css({
                        top: containerHeight+'px',
                        height: newUlHeight
                    });
                    $input.onTop = false;
                }
            }

            //run function on page load
            newUlPos();

            //run function on browser window resize
			$(window).bind('resize.sSelect scroll.sSelect', newUlPos);

            //positioning
            function positionFix(){
                $containerDiv.css('position','relative');
            }

            function positionHideFix(){
                $containerDiv.css('position','static');
            }

            $containerDivText.bind('click.sSelect',function(event){
                event.stopPropagation();

				//added by Justin Beasley
				if($(this).data('ssReRender')) {
					newUlHeight = $newUl.height('').height();
					containerHeight = $containerDiv.height();
					$(this).data('ssReRender',false);
					newUlPos();
				}

                //hide all menus apart from this one
				$('.newList').not($(this).next()).hide()
                    .parent()
                        .css('position', 'static')
                        .removeClass('newListSelFocus');

                //show/hide this menu
                $newUl.toggle();
                positionFix();
                //scroll list to selected item
                $newLi.eq(currentIndex).focus();

            });

            $newLi.bind('click.sSelect',function(e){
                var $clickedLi = $(e.target);

                //update counter
                currentIndex = $newLi.index($clickedLi);

                //remove all hilites, then add hilite to selected item
                prevented = true;
                navigateList(currentIndex);
                $newUl.hide();
                $containerDiv.css('position','static');//ie

            });

            $newLi.bind('mouseenter.sSelect',
				function(e) {
					var $hoveredLi = $(e.target);
					$hoveredLi.addClass('newListHover');
				}
			).bind('mouseleave.sSelect',
				function(e) {
					var $hoveredLi = $(e.target);
					$hoveredLi.removeClass('newListHover');
				}
			);

            function navigateList(currentIndex, init){
                $newLi.removeClass('hiLite')
                .eq(currentIndex)
                .addClass('hiLite');

                if ($newUl.is(':visible')){
                    $newLi.eq(currentIndex).focus();
                }

                var text = $newLi.eq(currentIndex).html();
                var val = $newLi.eq(currentIndex).parent().data('key');

                //page load
                if (init == true){
                    $input.val(val);
                    $containerDivText.text(text);
                    return false;
                }

		try {
		    $input.val(val)
		} catch(ex) {
		    // handle ie6 exception
		    $input[0].selectedIndex = currentIndex;
		}

                $input.change();
                $containerDivText.text(text);
            }

            $input.bind('change.sSelect',function(event){
                $targetInput = $(event.target);
                //stop change function from firing
                if (prevented == true){
                    prevented = false;
                    return false;
                }
                $currentOpt = $targetInput.find(':selected');

                //currentIndex = $targetInput.find('option').index($currentOpt);
                currentIndex = $targetInput.find('option').index($currentOpt);

                navigateList(currentIndex, true);
			});

            //handle up and down keys
            function keyPress(element) {
                //when keys are pressed
                $(element).unbind('keydown.sSelect').bind('keydown.sSelect',function(e){
                    var keycode = e.which;

                    //prevent change function from firing
                    prevented = true;

                    switch(keycode) {
                        case 40: //down
                        case 39: //right
                            incrementList();
                            return false;
                            break;
                        case 38: //up
                        case 37: //left
                            decrementList();
                            return false;
                            break;
                        case 33: //page up
                        case 36: //home
                            gotoFirst();
                            return false;
                            break;
                        case 34: //page down
                        case 35: //end
                            gotoLast();
                            return false;
                            break;
                        case 13:
                        case 27:
                            $newUl.hide();
                            positionHideFix();
                            return false;
                            break;
                    }

                    //check for keyboard shortcuts
                    keyPressed = String.fromCharCode(keycode).toLowerCase();

                    var currentKeyIndex = keys.indexOf(keyPressed);

                    if (typeof currentKeyIndex != 'undefined') { //if key code found in array
                        ++currentIndex;
                        currentIndex = keys.indexOf(keyPressed, currentIndex); //search array from current index
                        if (currentIndex == -1 || currentIndex == null || prevKey != keyPressed) currentIndex = keys.indexOf(keyPressed); //if no entry was found or new key pressed search from start of array


                        navigateList(currentIndex);
                        //store last key pressed
                        prevKey = keyPressed;
                        return false;
                    }
                });
            }

            function incrementList(){
                if (currentIndex < (newLiLength-1)) {
                    ++currentIndex;
                    navigateList(currentIndex);
                }
            }

            function decrementList(){
                if (currentIndex > 0) {
                    --currentIndex;
                    navigateList(currentIndex);
                }
            }

            function gotoFirst(){
                currentIndex = 0;
                navigateList(currentIndex);
            }

            function gotoLast(){
                currentIndex = newLiLength-1;
                navigateList(currentIndex);
            }

            $containerDiv.bind('click.sSelect',function(e){
                e.stopPropagation();
                keyPress(this);
            });

            $containerDiv.bind('focus.sSelect',function(){
                $(this).addClass('newListSelFocus');
                keyPress(this);
            });

            $containerDiv.bind('blur.sSelect',function(){
                $(this).removeClass('newListSelFocus');
            });

            //hide list on blur
            $(document).bind('click.sSelect',function(){
                $containerDiv.removeClass('newListSelFocus');
                $newUl.hide();
                positionHideFix();
            });

            //add classes on hover
            $containerDivText.bind('mouseenter.sSelect',
				function(e) {
					var $hoveredTxt = $(e.target);
					$hoveredTxt.parent().addClass('newListSelHover');
				}
			).bind('mouseleave.sSelect',
				function(e) {
					var $hoveredTxt = $(e.target);
					$hoveredTxt.parent().removeClass('newListSelHover');
				}
            );

            //reset left property and hide
            $newUl.css({
                left: '0',
                display: 'none',
                visibility: 'visible'
            });

        });

    };

})(jQuery);

window.datetimepicker_picturebase = '/$Theme-edu3$/Content/Theme/datetimepicker/';
 /*
 * Placify
 * Copyright 2011 Apps In Your Pants Corporation
 * http://github.com/appsinyourpants/jquery-plugins
 * 
 * Add support for input HTML5 placeholder attribute for legacy and modern browsers.
 *
 * Version 1.0   -   Updated: Jan. 20, 2011
 * Version 1.0e  -   Updated: Jul. 05, 2011 (drummer) - inline label, moves with input
 *
 * This AutoSuggest jQuery plug-in is licensed under a Creative Commons Attribution 3.0 Unported License. http://creativecommons.org/licenses/by/3.0/
 */

(function ($) {
	$.fn.placify = function () {
		var defaults = {
			cssClass: 'placeholder',
			fadeSpeed: 200
		};
		var opts = $.extend(defaults, arguments[0] || {});

		this.each(function () {
			if (this.placify) return;
			this.placify = true;

			var input = $(this);

			// If not an input element, then placify all child inputs with a placeholder attribute. 
			if (!input.is('input')) {
				$('input[placeholder]', input).placify(opts);
				return;
			}

			var ipos = input.position();
			var container = $('<label/>')
									.attr('for', input.attr('id'))
									.attr('class', opts.cssClass)
									.css({
										position: 'absolute',
										display: input.val().length ? 'none' : 'inline',
										width: input.width() + 'px',
										height: input.height() + 'px',
										marginLeft: input.css('margin-left'),
										marginRight: input.css('margin-right'),
										marginTop: input.css('margin-top'),
										marginBottom: input.css('margin-bottom'),
										paddingLeft: input.css('padding-left'),
										paddingRight: input.css('padding-right'),
										paddingTop: input.css('padding-top'),
										paddingBottom: input.css('padding-bottom'),
										lineHeight: input.height() + 'px'
									}).text(input.attr('placeholder'));

			input.before(container)
					 .removeAttr('placeholder') // Remove so default browser rendering is hidden
					 .focus(function () {
						 container.fadeOut(opts.fadeSpeed);
					 })
					 .blur(function () {
						 if (input.val().length == 0)
							 container.css({ display: 'inline', opacity: 0 }).animate({ opacity: 1 }, opts.fadeSpeed);
					 })
					 .change(function () {
						 if (input.val().length > 0)
							 container.fadeOut(opts.fadeSpeed);
						 else if (input.val().length == 0)
							 container.css({ display: 'inline', opacity: 0 }).animate({ opacity: 1 }, opts.fadeSpeed);
					 });
		});

		return this;
	}
})(jQuery);
(function ($) {

    // function, ami becsukja az aktuális datetimepickert (null, ha nincs aktuális)
    var closeCurrent;

    // defaultValueSelector: ha üres a saját inputja, akkor melyik másikból vegye a kezdőértéket
    // defaultValue: ha üres a saját inputja, a defaultValueSelector-ból se kapott értéket, akkor milyen dátum legyen a kezdőérték (string, YYYY-mm-dd HH:MM:ss). Ha ilyen sincs, akkor az aktuális dátum lesz.
    // startHour: az órakiválasztó alapértelmezésként melyik órától induljon (default: 7)
    // dayNames: a napok neve rövidítve (string, vesszővel elválasztott)
    // monthNames: hónapok nevei (string, vesszővel elválasztott)
    // buttonLabels: Ok és a mégsem gomb felirata vesszővel elválasztva
    // mode: 'date' vagy 'datetime' (string)
    $.fn.DexDateTimePicker = function (options) {

        var control;
        var input = this[0];
        var cancelValue;

        var currentDate = new Date();
        currentDate.setMinutes(Math.round(currentDate.getMinutes() / 5) * 5, 0, 0);
        var viewDate = new Date();
        var dayNames = (!options || typeof (options.dayNames) == 'undefined' ? "H,K,Sze,Cs,P,Szo,V" : options.dayNames).split(",");
        var monthNames = (!options || typeof (options.monthNames) == 'undefined' ? "Január,Február,Március,Április,Május,Június,Július,Augusztus,Szeptember,Október,November,December" : options.monthNames).split(",");
        var buttonLabels = (!options || typeof (options.buttonLabels) == 'undefined' ? "Ok,Mégsem,Törlés" : options.buttonLabels).split(",");
        var mode = !options || typeof (options.mode) == 'undefined' ? 'datetime' : options.mode;

        var rangemin = null;
        var rangemax = null;

        var htmlTemplate = '        <div class="DexDateTimePicker_calbtns">\
            <div class="DexDateTimePicker_head">\
                <a href="javascript:;" class="DexDateTimePicker_yright">&#160;</a>\
                <a href="javascript:;" class="DexDateTimePicker_right">&#160;</a>\
                <a href="javascript:;" class="DexDateTimePicker_yleft">&#160;</a>\
                <a href="javascript:;" class="DexDateTimePicker_left">&#160;</a>\
                <span class="curyear"></span>&#160;<span class="curmonth"></span>\
            </div>\
            <table class="DexDateTimePicker_cal" cellpadding="0" cellspacing="0" border="0">\
            <thead>\
                <tr>\
                    <th></th><th></th><th></th><th></th><th></th><th></th><th></th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
                <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\
            </tbody>\
        </table>\
        <div class="DexDateTimePicker_btns"><a href="javascript:;" class="DexDateTimePicker_ok"></a><a href="javascript:;" class="DexDateTimePicker_cancel"></a><a href="javascript:;" class="DexDateTimePicker_delete"></a></div>\
        </div>\
        <div class="DexDateTimePicker_hour">\
        <div>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
        </div>\
        <div>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
        </div>\
        <div style="clear:both;"></div>\
        </div>\
        <div class="DexDateTimePicker_min">\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
            <a href="javascript:;"></a>\
        </div>';

        var draw = function () {
            $('.DexDateTimePicker_hour a', control).each(function (i, o) {
                o.innerHTML = i;

                var doaction = true;
                if (((rangemin != null && noHours(currentDate) == noHours(rangemin)) && (i < rangemin.getHours())) ||
                    ((rangemax != null && noHours(currentDate) == noHours(rangemax)) && (i > rangemax.getHours()))) {
                    $(o).addClass('disabled');
                    doaction = false;
                } else
                    $(o).removeClass('disabled');

                if ((rangemin != null && (currentDate < rangemin) && noHours(currentDate) == noHours(rangemin)) && (i < rangemin.getHours()))
                    currentDate.setHours(rangemin.getHours());
                if ((rangemax != null && (currentDate > rangemax) && noHours(currentDate) == noHours(rangemax)) && (i > rangemax.getHours()))
                    currentDate.setHours(rangemax.getHours());

                if (currentDate.getHours() == i)
                    $(o).addClass('sel');
                else
                    $(o).removeClass('sel');

                var h = i;
                if (doaction)
                    $(o).unbind('click').click(function () { currentDate.setHours(h); currentDate.setSeconds(0); redraw(); return false; });
                else
                    $(o).unbind('click');
            });

            $('.DexDateTimePicker_min a', control).each(function (i, o) {
                var m = i * 5;
                o.innerHTML = zeropad2(m);

                var doaction = true;
                if (((rangemin != null && noHours(currentDate) == noHours(rangemin)) && (currentDate.getHours() == rangemin.getHours()) && (zeropad2(m) < rangemin.getMinutes())) ||
                    ((rangemax != null && noHours(currentDate) == noHours(rangemax)) && (currentDate.getHours() == rangemax.getHours()) && (zeropad2(m) > rangemax.getMinutes()))) {
                    $(o).addClass('disabled');
                    doaction = false;
                } else
                    $(o).removeClass('disabled');

                if ((rangemin != null && (currentDate < rangemin) && noHours(currentDate) == noHours(rangemin)) && (currentDate.getHours() == rangemin.getHours()) && (zeropad2(m) < rangemin.getMinutes()))
                    currentDate.setMinutes(rangemin.getMinutes());
                if ((rangemax != null && (currentDate > rangemax) && noHours(currentDate) == noHours(rangemax)) && (currentDate.getHours() == rangemax.getHours()) && (zeropad2(m) > rangemax.getMinutes()))
                    currentDate.setMinutes(rangemax.getMinutes());

                if (doaction)
                    $(o).unbind('click').click(function () { currentDate.setMinutes(m); currentDate.setSeconds(0); redraw(); return false; });
                else
                    $(o).unbind('click');
            });
        };

        var zeropad2 = function (v) {
            var s = '00' + v;
            return s.substr(s.length - 2, 2);
        };

        var redraw = function () {
            var s = currentDate.getFullYear() + '-' + zeropad2(1 + currentDate.getMonth()) + '-' + zeropad2(currentDate.getDate()) + (mode != 'date' ? ' ' + (zeropad2(currentDate.getHours()) + ':' + zeropad2(currentDate.getMinutes()) /* + ':' + zeropad2(currentDate.getSeconds())*/) : '');
            if (input.value != s)
                $(input).val(s).trigger('change');

            var tmp = $('.DexDateTimePicker_head span', control);
            tmp[0].innerHTML = viewDate.getFullYear();
            tmp[1].innerHTML = monthNames[viewDate.getMonth()];

            $('.DexDateTimePicker_hour a', control).each(function (i, o) {
                if (currentDate.getHours() == i)
                    $(o).addClass('sel');
                else
                    $(o).removeClass('sel');
            });
            $('.DexDateTimePicker_min a', control).each(function (i, o) {
                if (Math.round(currentDate.getMinutes() / 5) == i)
                    $(o).addClass('sel');
                else
                    $(o).removeClass('sel');
            });

            var ds = new Date(viewDate);
            var now = new Date();
            ds.setDate(1);
            var off = -((ds.getDay() + 6) % 7) + 1
            $('.DexDateTimePicker_cal td', control).each(function (i, o) {
                var jo = $(o);
                var d = new Date(viewDate);
                d.setDate(off + i);
                var dd = d.getDate();
                o.innerHTML = dd;

                var doaction = true;
                if ((rangemin != null && noHours(d) < noHours(rangemin)) ||
                    (rangemax != null && noHours(d) > noHours(rangemax))) {
                    jo.addClass('disabled');
                    doaction = false;
                }
                else
                    jo.removeClass('disabled');

                if (viewDate.getMonth() == d.getMonth())
                    jo.addClass('currmonth');
                else
                    jo.removeClass('currmonth');
                if (d.toDateString() == currentDate.toDateString())
                    jo.addClass('sel');
                else
                    jo.removeClass('sel');
                if (d.toDateString() == now.toDateString())
                    jo.addClass('now');
                else
                    jo.removeClass('now');

                if (doaction)
                    $(o).unbind('click').click(function () { currentDate.setDate(1); currentDate.setYear(d.getFullYear()); currentDate.setMonth(d.getMonth()); currentDate.setDate(d.getDate()); viewDate = new Date(currentDate); redraw(); });
                else
                    $(o).unbind('click');
            });

            if (rangemin != null || rangemax != null)
                draw();
        };

        var blur = function (ok) {
            if (ok == 'del')
                input.value = '';
            else if (ok)
                redraw(); // input.value miatt csak
            else
                $(input).val(cancelValue);//.trigger('change');
            if (control)
                $(control).remove();
            control = null;
            closeCurrent = null;
        };

        var click = function (ev) {
            if (control || input.readOnly || input.disabled)
                return;
            if (closeCurrent)
                closeCurrent();

            var o = input; // event.target;
            control = document.createElement('div');
            control.innerHTML = htmlTemplate; // document.getElementById('template').innerHTML;
            control.className = 'DexDateTimePicker' + (mode == 'date' ? ' DexDateTimePicker_dateonly' : '');

            var j = $(o);
            var jc = $(control);
            j.after(jc);
            var p = j.position();
            jc.css('top', p.top + j.outerHeight() + 2 + 'px');

            var _width = (mode == 'date' ? 200 : 300);
            if (((window.innerWidth - _width) < p.left) || ((j.closest('#nyroModalContent').width() - _width) < p.left))
                jc.css('left', p.left + j.width() - _width + 'px');
            else
                jc.css('left', p.left + 'px');

            cancelValue = input.value;
            currentDate = parseDate(input.value);

            if (isNaN(currentDate) && options && options.defaultValueSelector)
                currentDate = parseDate($(options.defaultValueSelector).val());
            if (isNaN(currentDate) && options && options.defaultValue)
                currentDate = parseDate(options.defaultValue);
            if (isNaN(currentDate)) {
                currentDate = new Date();
                currentDate.setMinutes(Math.round(currentDate.getMinutes() / 5) * 5, 0, 0);
            }

            if (options && typeof (options.DTRange) != 'undefined') {
                var rangemins = new Array();
                for (var i = 0; i < options.DTRange[0].length; i++) {
                    var el;
                    if (options.DTRange[0][i].match(/__@Now$/)) {
                        var _now = new Date();
                        _now.setTime(_now.getTime() + 5 * 60 * 1000);
                        el = new Date( _now.setMinutes(Math.round(_now.getMinutes() / 5) * 5, 0, 0) );
                    } else
                        el = new Date( parseDate($(options.DTRange[0][i]).val()) );

                    if (!isNaN(el.getTime()))
                        rangemins.push(el);
                };
                if (rangemins.length > 0)
                    rangemin = new Date(Math.max.apply(Math, rangemins));
                else
                    rangemin = null;

                var rangemaxs = new Array();
                for (var i = 0; i < options.DTRange[1].length; i++) {
                    var el;
                    if (options.DTRange[1][i].match(/__@Now$/)) {
                        var _now = new Date();
                        _now.setTime(_now.getTime() - 5 * 60 * 1000);
                        el = new Date( _now.setMinutes(Math.round(_now.getMinutes() / 5) * 5, 0, 0) );
                    } else
                        el = new Date( parseDate($(options.DTRange[1][i]).val()) );
                    if (!isNaN(el.getTime()))
                        rangemaxs.push(el);
                };
                if (rangemaxs.length > 0)
                    rangemax = new Date(Math.min.apply(Math, rangemaxs));
                else
                    rangemax = null;
            }
            if (rangemin != null && rangemax != null && rangemax < rangemin) {
                var tmp = new Date(rangemin);
                rangemin = rangemax;
                rangemax = tmp;
            }

            if (rangemin != null && currentDate < rangemin)
                currentDate = rangemin;
            if (rangemax != null && currentDate > rangemax)
                currentDate = rangemax;

            currentDate.setSeconds(0);
            viewDate = new Date(currentDate);

            $('.DexDateTimePicker_cal thead th', jc).each(function (i, o) { $(o).text(dayNames[i]); });
            $('.DexDateTimePicker_btns a', jc).each(function (i, o) { $(o).text(buttonLabels[i]); });
            draw();
            redraw();

            $('.DexDateTimePicker_cancel', jc).click(function () { blur(false); return false; });
            $('.DexDateTimePicker_ok', jc).click(function () { blur(true); return false; });
            $('.DexDateTimePicker_delete', jc).click(function () { blur('del'); return false; });

            $('.DexDateTimePicker_left', jc).click(function () { viewDate.setMonth(viewDate.getMonth() - 1); redraw(); return false; });
            $('.DexDateTimePicker_right', jc).click(function () { viewDate.setMonth(viewDate.getMonth() + 1); redraw(); return false; });
            $('.DexDateTimePicker_yleft', jc).click(function () { viewDate.setYear(viewDate.getFullYear() - 1); redraw(); return false; });
            $('.DexDateTimePicker_yright', jc).click(function () { viewDate.setYear(viewDate.getFullYear() + 1); redraw(); return false; });

            closeCurrent = function () { blur(true); };
        };

        var inputchange = function () {
            if (!control)
                return;
            var d = parseDate(input.value);

            //input mező range check
            if (isNaN(d) || (rangemin != null && d < rangemin) || (rangemax != null && rangemax < d)) {
                if (input.value != '') {
                    alert('Érvénytelen időpont!');
                    var s = currentDate.getFullYear() + '-' + zeropad2(1 + currentDate.getMonth()) + '-' + zeropad2(currentDate.getDate()) + (mode != 'date' ? ' ' + (zeropad2(currentDate.getHours()) + ':' + zeropad2(currentDate.getMinutes()) /* + ':' + zeropad2(currentDate.getSeconds())*/) : '');
                    $(input).val(s);
                }
            } else {
                viewDate = new Date(d);
                currentDate = new Date(d);
                redraw();
            }
        };

        function parseDate(v) {
            var s = new String(v);
            var a = s.split(/\.|\. |-|T|:| /);
            var d;
            try {
                if (typeof (a[3]) != 'undefined')
                    d = new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2]), Number(a[3]), Number(a[4]));
                else
                    d = new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2]));
            } catch (ex) {
            }
            return d;
        }

        function noHours(v) {
            return new Date(v).setHours(0, 0, 0, 0);
        }

        return this.click(click).change(inputchange);
    };
})(jQuery);
/*
 * jQuery SmoothDivScroll 1.1
 *
 * Copyright (c) 2010 Thomas Kahn
 * Licensed under the GPL license.
 *
 * http://www.maaki.com/thomas/SmoothDivScroll/
 *
 * Depends:
 * jquery.ui.widget.js
 *
 */
(function($) {

	$.widget("thomaskahn.smoothDivScroll", {
		// Default options
		options: {
			scrollingHotSpotLeft: "div.scrollingHotSpotLeft",
			scrollingHotSpotRight: "div.scrollingHotSpotRight",
			scrollableArea: "div.scrollableArea",
			scrollWrapper: "div.scrollWrapper",
			hiddenOnStart: false,
			ajaxContentURL: "",
			countOnlyClass: "",
			scrollStep: 15,
			scrollInterval: 10,
			mouseDownSpeedBooster: 3,
			autoScroll: "",
			autoScrollDirection: "right",
			autoScrollStep: 5,
			autoScrollInterval: 10,
			visibleHotSpots: "",
			hotSpotsVisibleTime: 5,
			startAtElementId: ""
		},
		_create: function() {

			// Set variables
			var self = this, o = this.options, el = this.element;

			el.data("scrollWrapper", el.find(o.scrollWrapper));
			el.data("scrollingHotSpotRight", el.find(o.scrollingHotSpotRight));
			el.data("scrollingHotSpotLeft", el.find(o.scrollingHotSpotLeft));
			el.data("scrollableArea", el.find(o.scrollableArea));
			el.data("speedBooster", 1);
			el.data("motherElementOffset", el.offset().left);
			el.data("scrollXPos", 0);
			el.data("hotSpotWidth", el.find(o.scrollingHotSpotLeft).width());
			el.data("scrollableAreaWidth", 0);
			el.data("startingPosition", 0);
			el.data("rightScrollInterval", null);
			el.data("leftScrollInterval", null);
			el.data("autoScrollInterval", null);
			el.data("hideHotSpotBackgroundsInterval", null);
			el.data("previousScrollLeft", 0);
			el.data("pingPongDirection", "right");
			el.data("getNextElementWidth", true);
			el.data("swapAt", null);
			el.data("startAtElementHasNotPassed", true);
			el.data("swappedElement", null);
			el.data("originalElements", el.data("scrollableArea").children(o.countOnlyClass));
			el.data("visible", true);
			el.data("initialAjaxContentLoaded", false);
			el.data("enabled", true);

			// If the user wants to have visible hotspots, here is where it's taken care of
			if (o.autoScroll !== "always") {
				switch (o.visibleHotSpots) {
					case "always":
						self.showHotSpotBackgrounds();
						break;
					case "onstart":
						self.showHotSpotBackgrounds();
						el.data("hideHotSpotBackgroundsInterval", setTimeout(function() {
							self.hideHotSpotBackgrounds("slow");
						}, (o.hotSpotsVisibleTime * 1000)));
						break;
					default:
						break;
				}
			}
			/*****************************************
			SET UP EVENTS FOR SCROLLING RIGHT
			*****************************************/
			// Check the mouse X position and calculate the relative X position inside the right hotspot
			el.data("scrollingHotSpotRight").bind("mousemove", function(e) {
				var x = e.pageX - (this.offsetLeft + el.data("motherElementOffset"));
				el.data("scrollXPos", Math.round((x / el.data("hotSpotWidth")) * o.scrollStep));
				if (el.data("scrollXPos") === Infinity) {
					el.data("scrollXPos", 0);
				}
			});

			// mouseover right hotspot - scrolling
			el.data("scrollingHotSpotRight").bind("mouseover", function() {

				// Clear autoscrolling, if it should only run on start
				if ((o.autoScroll === "onstart" && el.data("autoScrollInterval") !== null)) {
					clearInterval(el.data("autoScrollInterval"));
					el.data("autoScrollInterval", null);
					self._trigger("autoScrollIntervalStopped");
				}

				// Start the scrolling interval
				el.data("rightScrollInterval", setInterval(function() {

					if (el.data("scrollXPos") > 0 && el.data("enabled")) {
						el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + (el.data("scrollXPos") * el.data("speedBooster")));

						self._showHideHotSpots();
					}

				}, o.scrollInterval));

				// Callback
				self._trigger("mouseOverRightHotSpot");

			});

			// mouseout right hotspot
			el.data("scrollingHotSpotRight").bind("mouseout", function() {
				clearInterval(el.data("rightScrollInterval"));
				el.data("scrollXPos", 0);
			});

			// mousedown right hotspot (add scrolling speed booster)
			el.data("scrollingHotSpotRight").bind("mousedown", function() {
				el.data("speedBooster", o.mouseDownSpeedBooster);
			});

			// mouseup anywhere (stop boosting the scrolling speed)
			$("body").bind("mouseup", function() {
				el.data("speedBooster", 1);
			});

			/*****************************************
			SET UP EVENTS FOR SCROLLING LEFT
			*****************************************/
			// Check the mouse X position and calculate the relative X position inside the left hotspot
			el.data("scrollingHotSpotLeft").bind("mousemove", function(e) {
				var x = el.data("scrollingHotSpotLeft").innerWidth() - (e.pageX - el.data("motherElementOffset"));
				el.data("scrollXPos", Math.round((x / el.data("hotSpotWidth")) * o.scrollStep));
				if (el.data("scrollXPos") === Infinity) {
					el.data("scrollXPos", 0);
				}

			});

			// mouseover left hotspot
			el.data("scrollingHotSpotLeft").bind("mouseover", function() {

				// Clear autoscrolling, if it should only run on start

				if ((o.autoScroll === "onstart" && el.data("autoScrollInterval") !== null)) {
					clearInterval(el.data("autoScrollInterval"));
					el.data("autoScrollInterval", null);
					self._trigger("autoScrollIntervalStopped");
				}

				el.data("leftScrollInterval", setInterval(function() {
					if (el.data("scrollXPos") > 0 && el.data("enabled")) {
						el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() - (el.data("scrollXPos") * el.data("speedBooster")));

						self._showHideHotSpots();
					}

				}, o.scrollInterval));

				// Callback
				self._trigger("mouseOverLeftHotSpot");
			});

			// mouseout left hotspot
			el.data("scrollingHotSpotLeft").bind("mouseout", function() {
				clearInterval(el.data("leftScrollInterval"));
				el.data("scrollXPos", 0);
			});

			// mousedown left hotspot (add scrolling speed booster)
			el.data("scrollingHotSpotLeft").bind("mousedown", function() {
				el.data("speedBooster", o.mouseDownSpeedBooster);
			});

			/*****************************************
			SET UP EVENT FOR RESIZING THE BROWSER WINDOW
			*****************************************/
			$(window).bind("resize", function() {
				// If the scrollable area is not hidden on start, show/hide the hotspots
				if (!(o.hiddenOnStart)) {
					self._showHideHotSpots();
				}

				self._trigger("windowResized");
			});

			/*****************************************
			FETCHING AJAX CONTENT ON INITIALIZATION
			*****************************************/
			// If there's an ajaxContentURL in the options, 
			// fetch the content
			if (o.ajaxContentURL.length > 0) {
				self.replaceContent(o.ajaxContentURL);
			}
			else {
				self.recalculateScrollableArea();
			}

			// Should it be hidden on start?
			if (o.hiddenOnStart) {
				self.hide();
			}

			/*****************************************
			AUTOSCROLLING
			*****************************************/
			// If the user has set the option autoScroll, the scollable area will
			// start scrolling automatically. If the content is fetched using AJAX
			// the autoscroll is not started here but in recalculateScrollableArea.
			// Otherwise recalculateScrollableArea won't have the time to calculate
			// the width of the scrollable area before the autoscrolling starts.
			if ((o.autoScroll.length > 0) && !(o.hiddenOnStart) && (o.ajaxContentURL.length <= 0)) {
				self.startAutoScroll();
			}

		},
		/**********************************************************
		Hotspot functions
		**********************************************************/
		showHotSpotBackgrounds: function(fadeSpeed) {
			// Alter the CSS (SmoothDivScroll.css) if you want to customize
			// the look'n'feel of the visible hotspots
			var self = this, el = this.element;

			// Fade in the hotspot backgrounds
			if (fadeSpeed !== undefined) {
				// Before the fade-in starts, we need to make sure the opacity
				// is zero
				el.data("scrollingHotSpotLeft").css("opacity", "0.0");
				el.data("scrollingHotSpotRight").css("opacity", "0.0");

				el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");
				el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");

				// Fade in the left hotspot
				el.data("scrollingHotSpotLeft").fadeTo(fadeSpeed, 0.35);

				// Fade in the right hotspot
				el.data("scrollingHotSpotRight").fadeTo(fadeSpeed, 0.35);
			}
			// Don't fade, just show them
			else {
				// The left hotspot
				el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");
				el.data("scrollingHotSpotLeft").removeAttr("style");

				// The right hotspot
				el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");
				el.data("scrollingHotSpotRight").removeAttr("style");
			}
			self._showHideHotSpots();
		},
		hideHotSpotBackgrounds: function(fadeSpeed) {
			var el = this.element;

			// Fade out the hotspot backgrounds
			if (fadeSpeed !== undefined) {
				// Fade out the left hotspot
				el.data("scrollingHotSpotLeft").fadeTo(fadeSpeed, 0.0, function() {
					el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible");
				});

				// Fade out the right hotspot
				el.data("scrollingHotSpotRight").fadeTo(fadeSpeed, 0.0, function() {
					el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible");
				});
			}
			// Don't fade, just hide them
			else {
				el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible");
				el.data("scrollingHotSpotLeft").removeAttr("style");

				el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible");
				el.data("scrollingHotSpotRight").removeAttr("style");
			}

		},
		// Function for showing and hiding hotspots depending on the
		// offset of the scrolling
		_showHideHotSpots: function() {
			var self = this, el = this.element, o = this.options;

			// If autoscrolling is set to always, there should be no hotspots
			if (o.autoScroll !== "always") {
				// If the scrollable area is shorter than the scroll wrapper, both hotspots
				// should be hidden
				if (el.data("scrollableAreaWidth") <= (el.data("scrollWrapper").innerWidth())) {
					el.data("scrollingHotSpotLeft").hide();
					el.data("scrollingHotSpotRight").hide();
				}
				// When you can't scroll further left the left scroll hotspot should be hidden
				// and the right hotspot visible.
				else if (el.data("scrollWrapper").scrollLeft() === 0) {
					el.data("scrollingHotSpotLeft").hide();
					el.data("scrollingHotSpotRight").show();
					// Callback
					self._trigger("scrollLeftLimitReached");
					// Clear interval
					clearInterval(el.data("leftScrollInterval"));
					el.data("leftScrollInterval", null);
				}
				// When you can't scroll further right
				// the right scroll hotspot should be hidden
				// and the left hotspot visible
				else if (el.data("scrollableAreaWidth") <= (el.data("scrollWrapper").innerWidth() + el.data("scrollWrapper").scrollLeft())) {
					el.data("scrollingHotSpotLeft").show();
					el.data("scrollingHotSpotRight").hide();
					// Callback
					self._trigger("scrollRightLimitReached");
					// Clear interval
					clearInterval(el.data("rightScrollInterval"));
					el.data("rightScrollInterval", null);
				}
				// If you are somewhere in the middle of your
				// scrolling, both hotspots should be visible
				else {
					el.data("scrollingHotSpotLeft").show();
					el.data("scrollingHotSpotRight").show();
				}
			}
			else {
				el.data("scrollingHotSpotLeft").hide();
				el.data("scrollingHotSpotRight").hide();
			}
		},
		/**********************************************************
		Moving to a certain element
		**********************************************************/
		moveToElement: function(moveTo, elementNumber) {
			var self = this, el = this.element, o = this.options, tempScrollableAreaWidth = 0, foundStartAtElement = false;

			switch (moveTo) {
				case "first":
					el.data("scrollXPos", 0);
					self._trigger("movedToFirstElement");
					break;
				case "start":
					// Check to see where the start-at element is at the moment.
					// This can vary if endlessloop is used for autoscroll since it
					// swaps elements around.

					el.data("scrollableArea").children(o.countOnlyClass).each(function() {

						if ((o.startAtElementId.length > 0) && (($(this).attr("id")) === o.startAtElementId)) {
							el.data("startingPosition", tempScrollableAreaWidth);
							foundStartAtElement = true;
						}
						tempScrollableAreaWidth = tempScrollableAreaWidth + $(this).outerWidth(true);
					});

					el.data("scrollXPos", el.data("startingPosition"));
					self._trigger("movedToStartElement");
					break;
				case "last":
					el.data("scrollXPos", el.data("scrollableAreaWidth"));
					self._trigger("movedToLastElement");
					break;
				case "number":
					if (!(isNaN(elementNumber))) {
						// Get the total width of all preceding elements					
						el.data("scrollableArea").children(o.countOnlyClass).each(function(index) {
							if (index === (elementNumber - 1)) {
								el.data("scrollXPos", tempScrollableAreaWidth);
							}
							tempScrollableAreaWidth = tempScrollableAreaWidth + $(this).outerWidth(true);
						});
					}
					self._trigger("movedToElementNumber", null, { "elementNumber": elementNumber });
					break;
				default:
					break;
			}

			el.data("scrollWrapper").scrollLeft(el.data("scrollXPos"));
			self._showHideHotSpots();
		},
		/**********************************************************
		Adding or replacing content
		**********************************************************/
		addContent: function(ajaxContentURL, addWhere) {
			var self = this, el = this.element;

			$.get(ajaxContentURL, function(data) {
				// Add the loaded content first or last in the scrollable area
				if (addWhere === "first") {
					el.data("scrollableArea").children(":first").before(data);
				}
				else {
					el.data("scrollableArea").children(":last").after(data);
				}

				// Recalculate the total width of the elements inside the scrollable area
				self.recalculateScrollableArea();

				// Determine which hotspots to show
				self._showHideHotSpots();
			});
		},
		replaceContent: function(ajaxContentURL) {
			var self = this, el = this.element;

			el.data("scrollableArea").load(ajaxContentURL, function() {
				// Recalculate the total width of the elements inside the scrollable area
				self.recalculateScrollableArea();
				self.moveToElement("first");
				self._showHideHotSpots();
				el.data("startingPosition", 0);
			});
		},
		/**********************************************************
		Recalculate the scrollable area
		**********************************************************/
		recalculateScrollableArea: function() {

			var tempScrollableAreaWidth = 0, foundStartAtElement = false, o = this.options, el = this.element, self = this;

			// Add up the total width of all the items inside the scrollable area
			// and check to see if there's a specific element to start at
			el.data("scrollableArea").children(o.countOnlyClass).each(function() {
				// Check to see if the current element in the loop is the one where the scrolling should start
				if ((o.startAtElementId.length > 0) && (($(this).attr("id")) === o.startAtElementId)) {
					el.data("startingPosition", tempScrollableAreaWidth);
					foundStartAtElement = true;
				}
				tempScrollableAreaWidth = tempScrollableAreaWidth + $(this).outerWidth(true);
			});
		
			
			// If the element with the ID specified by startAtElementId
			// is not found, reset it
			if (!(foundStartAtElement)) {
				el.data("startAtElementId", "");
			}

			// Set the width of the scrollable area
			el.data("scrollableAreaWidth", tempScrollableAreaWidth);
			el.data("scrollableArea").width(el.data("scrollableAreaWidth"));

			// Move to the starting position
			el.data("scrollWrapper").scrollLeft(el.data("startingPosition"));
			el.data("scrollXPos", el.data("startingPosition"));

			// If the content of the scrollable area is fetched using AJAX
			// during initialization, it needs to be done here. After it has
			// been loaded a flag variable is set to indicate that the content
			// has been loaded already and shouldn
			if (!(el.data("initialAjaxContentLoaded"))) {
				if ((o.autoScroll.length > 0) && !(o.hiddenOnStart) && (o.ajaxContentURL.length > 0)) {
					self.startAutoScroll();
					el.data("initialAjaxContentLoaded", true);
				}
            }
            
            self._showHideHotSpots();

		},
		/**********************************************************
		Stopping, starting and doing the autoscrolling
		**********************************************************/
		stopAutoScroll: function() {
			var self = this, el = this.element;

			clearInterval(el.data("autoScrollInterval"));
			el.data("autoScrollInterval", null);

			// Check to see which hotspots should be active
			// in the position where the scroller has stopped
			self._showHideHotSpots();

			self._trigger("autoScrollStopped");

		},
		startAutoScroll: function() {
			var self = this, el = this.element, o = this.options;

			self._showHideHotSpots();

			// Stop any running interval
			clearInterval(el.data("autoScrollInterval"));
			el.data("autoScrollInterval", null);

			// Callback
			self._trigger("autoScrollStarted");

			// Start interval
			el.data("autoScrollInterval", setInterval(function() {

				// If the scroller is not visible or
				// if the scrollable area is shorter than the scroll wrapper
				// any running autoscroll interval should stop.
				if (!(el.data("visible")) || (el.data("scrollableAreaWidth") <= (el.data("scrollWrapper").innerWidth()))) {
					// Stop any running interval
					clearInterval(el.data("autoScrollInterval"));
					el.data("autoScrollInterval", null);
				}
				else {
					// Store the old scrollLeft value to see if the scrolling has reached the end
					el.data("previousScrollLeft", el.data("scrollWrapper").scrollLeft());


					switch (o.autoScrollDirection) {
						case "right":
							el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + o.autoScrollStep);
							if (el.data("previousScrollLeft") === el.data("scrollWrapper").scrollLeft()) {
								self._trigger("autoScrollRightLimitReached");
								clearInterval(el.data("autoScrollInterval"));
								el.data("autoScrollInterval", null);
								self._trigger("autoScrollIntervalStopped");
							}
							break;

						case "left":
							el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() - o.autoScrollStep);
							if (el.data("previousScrollLeft") === el.data("scrollWrapper").scrollLeft()) {
								self._trigger("autoScrollLeftLimitReached");
								clearInterval(el.data("autoScrollInterval"));
								el.data("autoScrollInterval", null);
								self._trigger("autoScrollIntervalStopped");
							}
							break;

						case "backandforth":
							if (el.data("pingPongDirection") === "right") {
								el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + (o.autoScrollStep));
							}
							else {
								el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() - (o.autoScrollStep));
							}

							// If the scrollLeft hasnt't changed it means that the scrolling has reached
							// the end and the direction should be switched
							if (el.data("previousScrollLeft") === el.data("scrollWrapper").scrollLeft()) {
								if (el.data("pingPongDirection") === "right") {
									el.data("pingPongDirection", "left");
									self._trigger("autoScrollRightLimitReached");
								}
								else {
									el.data("pingPongDirection", "right");
									self._trigger("autoScrollLeftLimitReached");
								}
							}
							break;

						case "endlessloopright":
							// Get the width of the first element. When it has scrolled out of view,
							// the element swapping should be executed. A true/false variable is used
							// as a flag variable so the swapAt value doesn't have to be recalculated
							// in each loop.

							if (el.data("getNextElementWidth")) {
								if ((o.startAtElementId.length > 0) && (el.data("startAtElementHasNotPassed"))) {
									el.data("swapAt", $("#" + o.startAtElementId).outerWidth(true));
									el.data("startAtElementHasNotPassed", false);
								}
								else {
									el.data("swapAt", el.data("scrollableArea").children(":first").outerWidth(true));
								}

								el.data("getNextElementWidth", false);
							}

							// Do the autoscrolling
							el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + o.autoScrollStep);

							// Check to see if the swap should be done
							if (el.data("swapAt") <= el.data("scrollWrapper").scrollLeft()) {
								el.data("swappedElement", el.data("scrollableArea").children(":first").detach());
								el.data("scrollableArea").append(el.data("swappedElement"));
								el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() - el.data("swappedElement").outerWidth(true));
								el.data("getNextElementWidth", true);
							}
							break;
						case "endlessloopleft":
							// Get the width of the first element. When it has scrolled out of view,
							// the element swapping should be executed. A true/false variable is used
							// as a flag variable so the swapAt value doesn't have to be recalculated
							// in each loop.

							if (el.data("getNextElementWidth")) {
								if ((o.startAtElementId.length > 0) && (el.data("startAtElementHasNotPassed"))) {
									el.data("swapAt", $("#" + o.startAtElementId).outerWidth(true));
									el.data("startAtElementHasNotPassed", false);
								}
								else {
									el.data("swapAt", el.data("scrollableArea").children(":first").outerWidth(true));
								}

								el.data("getNextElementWidth", false);
							}

							// Do the autoscrolling
							el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() - o.autoScrollStep);

							// Check to see if the swap should be done
							if (el.data("scrollWrapper").scrollLeft() === 0) {
								el.data("swappedElement", el.data("scrollableArea").children(":last").detach());
								el.data("scrollableArea").prepend(el.data("swappedElement"));
								el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + el.data("swappedElement").outerWidth(true));
								el.data("getNextElementWidth", true);
							}
							break;
						default:
							break;

					}
				}
			}, o.autoScrollInterval));

		},
		restoreOriginalElements: function() {
			var self = this, el = this.element;

			// Restore the original content of the scrollable area
			el.data("scrollableArea").html(el.data("originalElements"));
			self.recalculateScrollableArea();
			self.moveToElement("first");
		},
		show: function() {
			var el = this.element;
			el.data("visible", true);
			el.show();
		},
		hide: function() {
			var el = this.element;
			el.data("visible", false);
			el.hide();
		},
		enable: function() {
			var el = this.element;

			// Set enabled to true
			el.data("enabled", true);
		},
		disable: function() {
			var el = this.element;

			// Clear all running intervals
			clearInterval(el.data("autoScrollInterval"));
			clearInterval(el.data("rightScrollInterval"));
			clearInterval(el.data("leftScrollInterval"));
			clearInterval(el.data("hideHotSpotBackgroundsInterval"));

			// Set enabled to false
			el.data("enabled", false);
		},
		destroy: function() {
			var el = this.element;

			// Clear all running intervals
			clearInterval(el.data("autoScrollInterval"));
			clearInterval(el.data("rightScrollInterval"));
			clearInterval(el.data("leftScrollInterval"));
			clearInterval(el.data("hideHotSpotBackgroundsInterval"));

			// Remove all element specific events
			el.data("scrollingHotSpotRight").unbind("mouseover");
			el.data("scrollingHotSpotRight").unbind("mouseout");
			el.data("scrollingHotSpotRight").unbind("mousedown");

			el.data("scrollingHotSpotLeft").unbind("mouseover");
			el.data("scrollingHotSpotLeft").unbind("mouseout");
			el.data("scrollingHotSpotLeft").unbind("mousedown");

			// Restore the original content of the scrollable area
			el.data("scrollableArea").html(el.data("originalElements"));

			// Remove the width of the scrollable area
			el.data("scrollableArea").removeAttr("style");
			el.data("scrollingHotSpotRight").removeAttr("style");
			el.data("scrollingHotSpotLeft").removeAttr("style");

			el.data("scrollWrapper").scrollLeft(0);
			el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible");
			el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible");
			el.data("scrollingHotSpotRight").hide();
			el.data("scrollingHotSpotLeft").hide();

			// Call the base destroy function
			$.Widget.prototype.destroy.apply(this, arguments);

		}
	});
})(jQuery);
/**
 * http://github.com/valums/file-uploader
 * 
 * Multiple file upload component with progress-bar, drag-and-drop. 
 * (C) 2010 Andrew Valums ( andrew(at)valums.com ) 
 * 
 * Licensed under GNU GPL 2 or later and GNU LGPL 2 or later, see license.txt.
 */    

//
// Helper functions
//

// Módosítva 2014.04.15 imi

var qq = qq || {};

/**
 * Adds all missing properties from second obj to first obj
 */ 
qq.extend = function(first, second){
    for (var prop in second){
        first[prop] = second[prop];
    }
};  

/**
 * Searches for a given element in the array, returns -1 if it is not present.
 * @param {Number} [from] The index at which to begin the search
 */
qq.indexOf = function(arr, elt, from){
    if (arr.indexOf) return arr.indexOf(elt, from);
    
    from = from || 0;
    var len = arr.length;    
    
    if (from < 0) from += len;  

    for (; from < len; from++){  
        if (from in arr && arr[from] === elt){  
            return from;
        }
    }  
    return -1;  
}; 
    
qq.getUniqueId = (function(){
    var id = 0;
    return function(){ return id++; };
})();

//
// Events

qq.attach = function(element, type, fn){
    if (element.addEventListener){
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent){
        element.attachEvent('on' + type, fn);
    }
};
qq.detach = function(element, type, fn){
    if (element.removeEventListener){
        element.removeEventListener(type, fn, false);
    } else if (element.attachEvent){
        element.detachEvent('on' + type, fn);
    }
};

qq.preventDefault = function(e){
    if (e.preventDefault){
        e.preventDefault();
    } else{
        e.returnValue = false;
    }
};

//
// Node manipulations

/**
 * Insert node a before node b.
 */
qq.insertBefore = function(a, b){
    b.parentNode.insertBefore(a, b);
};
qq.remove = function(element){
    element.parentNode.removeChild(element);
};

qq.contains = function(parent, descendant){       
    // compareposition returns false in this case
    if (parent == descendant) return true;
    
    if (parent.contains){
        return parent.contains(descendant);
    } else {
        return !!(descendant.compareDocumentPosition(parent) & 8);
    }
};

/**
 * Creates and returns element from html string
 * Uses innerHTML to create an element
 */
qq.toElement = (function(){
    var div = document.createElement('div');
    return function(html){
        div.innerHTML = html;
        var element = div.firstChild;
        div.removeChild(element);
        return element;
    };
})();

//
// Node properties and attributes

/**
 * Sets styles for an element.
 * Fixes opacity in IE6-8.
 */
qq.css = function(element, styles){
    if (styles.opacity != null){
        if (typeof element.style.opacity != 'string' && typeof(element.filters) != 'undefined'){
            styles.filter = 'alpha(opacity=' + Math.round(100 * styles.opacity) + ')';
        }
    }
    qq.extend(element.style, styles);
};
qq.hasClass = function(element, name){
    var re = new RegExp('(^| )' + name + '( |$)');
    return re.test(element.className);
};
qq.addClass = function(element, name){
    if (!qq.hasClass(element, name)){
        element.className += ' ' + name;
    }
};
qq.removeClass = function(element, name){
    var re = new RegExp('(^| )' + name + '( |$)');
    element.className = element.className.replace(re, ' ').replace(/^\s+|\s+$/g, "");
};
qq.setText = function(element, text){
    element.innerText = text;
    element.textContent = text;
};

//
// Selecting elements

qq.children = function(element){
    var children = [],
    child = element.firstChild;

    while (child){
        if (child.nodeType == 1){
            children.push(child);
        }
        child = child.nextSibling;
    }

    return children;
};

qq.getByClass = function(element, className){
    if (element.querySelectorAll){
        return element.querySelectorAll('.' + className);
    }

    var result = [];
    var candidates = element.getElementsByTagName("*");
    var len = candidates.length;

    for (var i = 0; i < len; i++){
        if (qq.hasClass(candidates[i], className)){
            result.push(candidates[i]);
        }
    }
    return result;
};

/**
 * obj2url() takes a json-object as argument and generates
 * a querystring. pretty much like jQuery.param()
 * 
 * how to use:
 *
 *    `qq.obj2url({a:'b',c:'d'},'http://any.url/upload?otherParam=value');`
 *
 * will result in:
 *
 *    `http://any.url/upload?otherParam=value&a=b&c=d`
 *
 * @param  Object JSON-Object
 * @param  String current querystring-part
 * @return String encoded querystring
 */
qq.obj2url = function(obj, temp, prefixDone){
    var uristrings = [],
        prefix = '&',
        add = function(nextObj, i){
            var nextTemp = temp 
                ? (/\[\]$/.test(temp)) // prevent double-encoding
                   ? temp
                   : temp+'['+i+']'
                : i;
            if ((nextTemp != 'undefined') && (i != 'undefined')) {  
                uristrings.push(
                    (typeof nextObj === 'object') 
                        ? qq.obj2url(nextObj, nextTemp, true)
                        : (Object.prototype.toString.call(nextObj) === '[object Function]')
                            ? encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj())
                            : encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj)                                                          
                );
            }
        }; 

    if (!prefixDone && temp) {
      prefix = (/\?/.test(temp)) ? (/\?$/.test(temp)) ? '' : '&' : '?';
      uristrings.push(temp);
      uristrings.push(qq.obj2url(obj));
    } else if ((Object.prototype.toString.call(obj) === '[object Array]') && (typeof obj != 'undefined') ) {
        // we wont use a for-in-loop on an array (performance)
        for (var i = 0, len = obj.length; i < len; ++i){
            add(obj[i], i);
        }
    } else if ((typeof obj != 'undefined') && (obj !== null) && (typeof obj === "object")){
        // for anything else but a scalar, we will use for-in-loop
        for (var i in obj){
            add(obj[i], i);
        }
    } else {
        uristrings.push(encodeURIComponent(temp) + '=' + encodeURIComponent(obj));
    }

    return uristrings.join(prefix)
                     .replace(/^&/, '')
                     .replace(/%20/g, '+'); 
};

//
//
// Uploader Classes
//
//

var qq = qq || {};
    
/**
 * Creates upload button, validates upload, but doesn't create file list or dd. 
 */
qq.FileUploaderBasic = function (o) {
    this._options = {
        // set to true to see the server response
        debug: false,
        action: '/server/upload',
        params: {},
        button: null,
        button_attach: null,
        multiple: true,
        maxConnections: 3,
        // validation        
        allowedExtensions: [],
        sizeLimit: 0,
        minSizeLimit: 0,
        countLimit: 0,
        totalSizeLimit: 0,
        // events
        // return false to cancel submit
        onSubmit: function (id, fileName) { },
        onProgress: function (id, fileName, loaded, total) { },
        onComplete: function (id, fileName, responseJSON) { },
        onCancel: function (id, fileName) { },
        // messages                
        messages: {
            typeError: '{file} kiterjesztése nem megfelelő. Csak {extensions} kiterjesztések engedélyezettek.',
            sizeError: '{file} fájl túl nagy, a maximum méret {sizeLimit}.',
            minSizeError: '{file} fájl túl kicsi, a minimum méret {minSizeLimit}.',
            emptyError: '{file} fájl üres, nem tölthető fel.',
            onLeave: 'Fájlfeltöltés folyamatban, ha elhagyja az oldalt, le fog állni.',
            countError: 'Túl sok fájlt választott ki, maximum {countLimit} választható.',
            totalSizeError: 'A kijelölt fájlok összesített mérete meghaladja a maximum méretet ({totalSizeLimit}).'
        },
        showMessage: function (message) {
            alert(message);
        }
    };
    qq.extend(this._options, o);

    // number of files being uploaded
    this._filesInProgress = 0;
    this._filesTotal = 0;
    this._sizeTotal = 0;
    
    this._handler = this._createUploadHandler();

    if (this._options.button) {
        this._button = this._createUploadButton(this._options.button);
    }

    this._preventLeaveInProgress();
};

qq.FileUploaderBasic.prototype = {
    setParams: function (params) {
        this._options.params = params;
    },
    getInProgress: function () {
        return this._filesInProgress;
    },
    _createUploadButton: function (element) {
        var self = this;

        return new qq.UploadButton({
            element: element,
            accept: this._options.accept,
            multiple: this._options.multiple && qq.UploadHandlerXhr.isSupported(),
            onChange: function (input) {
                self._onInputChange(input);
            }
        });
    },
    _createUploadHandler: function () {
        var self = this,
            handlerClass;

        if (qq.UploadHandlerXhr.isSupported()) {
            handlerClass = 'UploadHandlerXhr';
        } else {
            handlerClass = 'UploadHandlerForm';
        }

        var handler = new qq[handlerClass]({
            debug: this._options.debug,
            action: this._options.action,
            maxConnections: this._options.maxConnections,
            onProgress: function (id, fileName, loaded, total) {
                self._onProgress(id, fileName, loaded, total);
                self._options.onProgress(id, fileName, loaded, total);
            },
            onComplete: function (id, fileName, result) {
                self._onComplete(id, fileName, result);
                self._options.onComplete(id, fileName, result);
            },
            onCancel: function (id, fileName) {
                self._onCancel(id, fileName);
                self._options.onCancel(id, fileName);
            }
        });

        return handler;
    },
    _createAttachButton: function (element, label, handler) {
        var a = document.createElement("a");

        a.setAttribute('href', 'javascript:;');
        a.setAttribute('onclick', handler);
        
        a.innerHTML = label;

        qq.attach(a, 'mouseover', function () {
            qq.addClass(element, 'qq-attach-button-hover');
        });
        qq.attach(a, 'mouseout', function () {
            qq.removeClass(element, 'qq-attach-button-hover');
        });
        qq.attach(a, 'focus', function () {
            qq.addClass(element, 'qq-attach-button-focus');
        });
        qq.attach(a, 'blur', function () {
            qq.removeClass(element, 'qq-attach-button-focus');
        });

        element.appendChild(a);

        return a;
    },
    _preventLeaveInProgress: function () {
        var self = this;

        qq.attach(window, 'beforeunload', function (e) {
            if (!self._filesInProgress) { return; }

            var e = e || window.event;
            // for ie, ff
            e.returnValue = self._options.messages.onLeave;
            // for webkit
            return self._options.messages.onLeave;
        });
    },
    _onSubmit: function (id, fileName) {
        this._filesInProgress++;
    },
    _onProgress: function (id, fileName, loaded, total) {
    },
    _onComplete: function (id, fileName, result) {
        this._filesInProgress--;
        if (result.error) {
            this._options.showMessage(result.error);
        } else {
            this._filesTotal++;
            this._sizeTotal += result.size;
            if (this._options.totalSizeLimit != 0 && this._sizeTotal > this._options.totalSizeLimit)
                this._error('totalSizeError', '');
        }
    },
    _onCancel: function (id, fileName) {
        this._filesInProgress--;
    },
    _onInputChange: function (input) {
        if (this._handler instanceof qq.UploadHandlerXhr) {
            this._uploadFileList(input.files);
        } else {

            if (this._deleteFile && !this._options.multiple && this._filesTotal == 1) {
                this._deleteFile(this._listElement.firstChild.qqFileId);
                if (this._validateFile(input)) {
                    this._uploadFile(input);
                }
            } else if (this._options.countLimit > 0 && 1 + this._filesInProgress + this._filesTotal > this._options.countLimit) {
                this._error('countError', '');
            } else {
                if (this._validateFile(input)) {
                    this._uploadFile(input);
                }
            }
        }
        this._button.reset();
    },
    _uploadFileList: function (files) {

        if (!this._options.multiple && this._filesTotal == 1) {
            this._deleteFile(this._listElement.firstChild.qqFileId);
        } else if (this._options.countLimit > 0 && files.length + this._filesInProgress + this._filesTotal > this._options.countLimit) {
            this._error('countError', '');
            var tmp = [];
            for (var i = 0; i < this._options.countLimit - this._filesInProgress - this._filesTotal; i++)
                tmp[i] = files[i];
            files = tmp;
        }

        for (var i = 0; i < files.length; i++) {
            if (!this._validateFile(files[i])) {
                return;
            }
        }

        for (var i = 0; i < files.length; i++) {
            this._uploadFile(files[i]);
        }
    },
    _uploadFile: function (fileContainer) {
        var id = this._handler.add(fileContainer);
        var fileName = this._handler.getName(id);

        if (this._options.onSubmit(id, fileName) !== false) {
            this._onSubmit(id, fileName);
            this._handler.upload(id, this._options.params);
        }
    },
    _validateFile: function (file) {
        var name, size;

        if (file.value) {
            // it is a file input            
            // get input value and remove path to normalize
            name = file.value.replace(/.*(\/|\\)/, "");
        } else {
            // fix missing properties in Safari
            name = file.fileName != null ? file.fileName : file.name;
            size = file.fileSize != null ? file.fileSize : file.size;
        }

        if (!this._isAllowedExtension(name)) {
            this._error('typeError', name);
            return false;

        } else if (size === 0) {
            this._error('emptyError', name);
            return false;

        } else if (size && this._options.sizeLimit && size > this._options.sizeLimit) {
            this._error('sizeError', name);
            return false;

        } else if (size && size < this._options.minSizeLimit) {
            this._error('minSizeError', name);
            return false;
        }

        return true;
    },
    _error: function (code, fileName) {
        var message = this._options.messages[code];
        function r(name, replacement) { message = message.replace(name, replacement); }

        r('{file}', this._formatFileName(fileName));
        r('{extensions}', this._options.allowedExtensions.join(', '));
        r('{sizeLimit}', this._formatSize(this._options.sizeLimit));
        r('{minSizeLimit}', this._formatSize(this._options.minSizeLimit));
        r('{countLimit}', this._options.countLimit);
        r('{totalSizeLimit}', this._formatSize(this._options.totalSizeLimit));

        this._options.showMessage(message);
    },
    _formatFileName: function (name) {
        if (name.length > 33) {
            name = name.slice(0, 19) + '...' + name.slice(-13);
        }
        return name;
    },
    _isAllowedExtension: function (fileName) {
        var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
        var allowed = this._options.allowedExtensions;

        if (!allowed.length) { return true; }

        for (var i = 0; i < allowed.length; i++) {
            if (allowed[i].toLowerCase() == ext) { return true; }
        }

        return false;
    },
    _formatSize: function (bytes) {
        var i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);

        return (Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i]).replace(/\./g, ',');
    }
};
    
       
/**
 * Class that creates upload widget with drag-and-drop and file list
 * @inherits qq.FileUploaderBasic
 */
qq.FileUploader = function(o){
    // call parent constructor
    qq.FileUploaderBasic.apply(this, arguments);
    
    // additional options    
    qq.extend(this._options, {
        element: null,
        // if set, will be used instead of qq-upload-list in template
        listElement: null,

        template: '<div class="qq-uploader">' +
                '<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>' +
                '<div class="qq-upload-button">Upload a file</div>' +
                '<ul class="qq-upload-list"></ul>' +
             '</div>',

        // template for one item in file list
        fileTemplate: '<li>' +
                '<span class="qq-upload-file"></span>' +
                '<span class="qq-upload-spinner"></span>' +
                '<span class="qq-upload-size"></span>' +
                '<a class="qq-upload-cancel" href="#">Cancel</a>' +
                '<span class="qq-upload-failed-text">Failed</span>' +
            '</li>',        
        
        classes: {
            // used to get elements from templates
            button: 'qq-upload-button',
            drop: 'qq-upload-drop-area',
            dropActive: 'qq-upload-drop-area-active',
            list: 'qq-upload-list',
                        
            file: 'qq-upload-file',
            spinner: 'qq-upload-spinner',
            size: 'qq-upload-size',
            cancel: 'qq-upload-cancel',

            // added to list item when upload completes
            // used in css to hide progress spinner
            success: 'qq-upload-success',
            fail: 'qq-upload-fail'
        }
    });
    // overwrite options with user supplied    
    qq.extend(this._options, o);       

    this._element = this._options.element;
    this._element.innerHTML = this._options.template;        
    this._listElement = this._options.listElement || this._find(this._element, 'list');
    
    this._classes = this._options.classes;
        
    this._button = this._createUploadButton(this._find(this._element, 'button'));        
    
    this._bindCancelEvent();
    this._setupDragDrop();
};

// inherit from Basic Uploader
qq.extend(qq.FileUploader.prototype, qq.FileUploaderBasic.prototype);

qq.extend(qq.FileUploader.prototype, {
    /**
    * Gets one of the elements listed in this._options.classes
    **/
    _find: function (parent, type) {
        var element = qq.getByClass(parent, this._options.classes[type])[0];
        if (!element) {
            throw new Error('element not found ' + type);
        }

        return element;
    },
    _setupDragDrop: function () {
        var self = this,
            dropArea = this._find(this._element, 'drop');

        if (navigator.userAgent.indexOf("IE") > -1) {
            dropArea.style.display = 'none';
        } else {

            var dz = new qq.UploadDropZone({
                element: dropArea,
                onEnter: function (e) {
                    qq.addClass(dropArea, self._classes.dropActive);
                    e.stopPropagation();
                },
                onLeave: function (e) {
                    e.stopPropagation();
                },
                onLeaveNotDescendants: function (e) {
                    qq.removeClass(dropArea, self._classes.dropActive);
                },
                onDrop: function (e) {
                    //dropArea.style.display = 'none';
                    qq.removeClass(dropArea, self._classes.dropActive);
                    qq.removeClass(dropArea, self._classes.dropBig);
                    self._uploadFileList(e.dataTransfer.files);
                }
            });

            //dropArea.style.display = 'none';

            qq.attach(document, 'dragenter', function (e) {
                if (!dz._isValidFileDrag(e)) return;
                qq.addClass(dropArea, self._classes.dropBig);

                //dropArea.style.display = 'block';
            });
            qq.attach(document, 'dragleave', function (e) {
                if (!dz._isValidFileDrag(e)) return;

                var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
                // only fire when leaving document out
                if (!relatedTarget || relatedTarget.nodeName == "HTML") {
                    //dropArea.style.display = 'none';
                    qq.removeClass(dropArea, self._classes.dropBig);
                }
            });
        }
    },
    _onSubmit: function (id, fileName) {
        qq.FileUploaderBasic.prototype._onSubmit.apply(this, arguments);
        this._addToList(id, fileName);
    },
    _onProgress: function (id, fileName, loaded, total) {
        qq.FileUploaderBasic.prototype._onProgress.apply(this, arguments);

        var item = this._getItemByFileId(id);
        var size = this._find(item, 'size');
        size.style.display = 'inline';

        var text;
        if (loaded != total) {
            text = Math.round(loaded / total * 100) + '% / ' + this._formatSize(total);
        } else {
            text = this._formatSize(total);
        }

        qq.setText(size, text);
    },
    _onComplete: function (id, fileName, result) {
        qq.FileUploaderBasic.prototype._onComplete.apply(this, arguments);

        // mark completed
        var item = this._getItemByFileId(id);
        qq.remove(this._find(item, 'cancel'));
        this._find(item, 'remove').style.display = 'block';
        //qq.remove(this._find(item, 'spinner'));

        if (result.success) {
            qq.addClass(item, this._classes.success);
        } else {
            qq.addClass(item, this._classes.fail);
        }
    },
    _addToList: function (id, fileName) {
        var item = qq.toElement(this._options.fileTemplate);
        item.qqFileId = id;

        var fileElement = this._find(item, 'file');
        qq.setText(fileElement, this._formatFileName(fileName));
        this._find(item, 'size').style.display = 'none';

        this._listElement.appendChild(item);
    },
    _getItemByFileId: function (id) {
        var item = this._listElement.firstChild;

        // there can't be txt nodes in dynamically created list
        // and we can  use nextSibling
        while (item) {
            if (item.qqFileId == id) return item;
            item = item.nextSibling;
        }
    },
    /**
    * delegate click event for cancel link 
    **/
    _bindCancelEvent: function () {
        var self = this,
            list = this._listElement;

        qq.attach(list, 'click', function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;

            if (qq.hasClass(target, self._classes.cancel)) {
                qq.preventDefault(e);

                var item = target.parentNode.parentNode;
                self._handler.cancel(item.qqFileId);
                qq.remove(item);
            }
        });
    }
});

/*********/

qq.FileUploaderDex = function (o) {
    // call parent constructor
    qq.FileUploaderBasic.apply(this, arguments);

    // additional options    
    qq.extend(this._options, {
        element: null,
        // if set, will be used instead of qq-upload-list in template
        listElement: null,
        // if set, will be used instead of qq-upload-button in template
        buttonElement: null,
        // if set, will be used instead of qq-attach-button in template
        insert_handler: null,

        existingFiles: [],

        template: '<div class="qq-uploader">' +
                (o.buttonElement == null
                    ? '<div class="qq-upload-button"><span class="label">' + (o && o.label_upload ? o.label_upload : 'fájl csatolás') + '</span></div>'
                    : '') +
                (o.insert_handler != null
                    ? '<div class="qq-attach-button"></div>'
                    : '') +
                '<div class="qq-upload-drop-area"><span>' + (o && o.dndLabel ? o.dndLabel : 'kérem, húzza ide a fájlokat a feltöltéshez') + '</span></div>' +
                (o.listElement == null
                    ? '<ul class="qq-upload-list"></ul>'
                    : '') +
             '</div>',

        // template for one item in file list
        fileTemplate: '<li>' +
                '<div class="qq-upload-data">' +
                    '<span class="qq-upload-progress"><span></span></span>' +
                    '<span class="qq-upload-size"></span>' +
                    '<span class="qq-upload-failed-text">' + 'Sikertelen' + '</span>' +
                    '<div style="clear:both;"></div>' +
                '</div>' +
                '<div class="qq-upload-spinner"></div>' +
                '<div class="qq-upload-file"></div>' +
                '<div class="qq-upload-btn">' +
                    '<a class="qq-upload-cancel" href="#" title="' + 'Mégsem' + '"></a>' +
                    '<a class="qq-upload-remove" href="#" title="' + 'Törlés' + '"></a>' +
                '</div>' +
                '<div style="clear:both;"></div>' +
                '<input class="qq-upload-input" type="hidden" />' +
                '<input class="qq-upload-input-name" name="hiddenname" type="hidden" />' +
                '<input class="qq-upload-input-size" name="hiddensize" type="hidden" />' +
                '<input class="qq-upload-input-url" name="hiddenurl" type="hidden" />' +
                '<input class="qq-upload-input-icon" name="hiddenicon" type="hidden" />' +
            '</li>',

        classes: {
            // used to get elements from templates
            button: 'qq-upload-button',
            button_attach: 'qq-attach-button',
            drop: 'qq-upload-drop-area',
            dropActive: 'qq-upload-drop-area-active',
            dropBig: 'qq-upload-drop-area-big',
            list: 'qq-upload-list',

            icon: 'qq-upload-spinner',
            file: 'qq-upload-file',
            spinner: 'qq-upload-spinner',
            size: 'qq-upload-size',
            cancel: 'qq-upload-cancel',

            input: 'qq-upload-input',
            input_name: 'qq-upload-input-name',
            input_size: 'qq-upload-input-size',
            input_url: 'qq-upload-input-url',
            input_icon: 'qq-upload-input-icon',

            // added to list item when upload completes
            // used in css to hide progress spinner
            success: 'qq-upload-success',
            fail: 'qq-upload-fail',

            remove: 'qq-upload-remove',
            progress: 'qq-upload-progress'
        },

        inputName: 'files',

        onCompleteAllHandler: null,
        onStartUploadHandler: null,
        onAutoSaveHandler: null
    });

    if (!o.multiple)
        o.countLimit = 1;
    if (o.countLimit == 1)
        o.multiple = false;

    // overwrite options with user supplied    
    qq.extend(this._options, o);

    this._options.element.FileUploader = this;

    this._element = this._options.element;
    this._element.innerHTML = this._options.template;
    this._listElement = this._options.listElement || this._find(this._element, 'list');

    this._classes = this._options.classes;

    this._button = this._createUploadButton(this._options.buttonElement || this._find(this._element, 'button'));

    if (o.insert_handler != null)
        this._button_attach = this._createAttachButton(this._find(this._element, 'button_attach'), (o && o.label_attach ? o.label_attach : 'csatolás coospaceből'), o.insert_handler);

    for (var i = 0; i < this._options.existingFiles.length; i++) {
        var f = this._options.existingFiles[i];
        this._addItem(f.id, f.name, f.size, f.icon, f.url);
    }

    if (this._options.onCompleteAllHandler) {
        if (!this.onCompleteAllHandlers)
            this.onCompleteAllHandlers = [];
        this.onCompleteAllHandlers.push(this._options.onCompleteAllHandler);
    }

    if (this._options.onAutoSaveHandler) {
        if (!this.onCompleteAllHandlers)
            this.onCompleteAllHandlers = [];
        this.onCompleteAllHandlers.push(this._options.onAutoSaveHandler);
    }

    this._bindCancelEvent();
    this._setupDragDrop();
};

// inherit from Uploader
qq.extend(qq.FileUploaderDex.prototype, qq.FileUploader.prototype);
qq.extend(qq.FileUploaderDex.prototype, {

    executeIfReady: function (func) {
        if (this._filesInProgress == 0)
            func();
        else {
            if (!this.onCompleteAllHandlers)
                this.onCompleteAllHandlers = [];
            this.onCompleteAllHandlers.push(func);
        }
    },

    addExistingFiles: function (data, idprefix) {
        if (!data)
            return false;
        if (this._options.countLimit > 0 && data.length + this._filesInProgress + this._filesTotal > this._options.countLimit) {
            this._error('countError', '');
            return false;
        }
        if (typeof (idprefix) == 'undefined')
            idprefix = '';
        for (var i = 0; i < data.length; i++) {
            this._addItem(idprefix + data[i].id, data[i].name, data[i].size, data[i].icon, data[i].url);
        }
        
        if (this._options.onAutoSaveHandler) {
            this._options.onAutoSaveHandler();
        }

        return true;
    },

    addExistingFile: function (id, name, size, icon, url) {
        if (this._options.countLimit > 0 && 1 + this._filesInProgress + this._filesTotal > this._options.countLimit) {
            this._error('countError', '');
            return;
        }
        this._addItem(id, name, size, icon, url);
    },

    _addItem: function (id, name, size, icon, url) {
        var item = qq.toElement(this._options.fileTemplate);
        item.qqFileId = 'existing-' + qq.getUniqueId();

        this._find(item, 'file').innerHTML = this._fileNameHtml(name, url);
        qq.setText(this._find(item, 'size'), this._formatSize(size));
        this._find(item, 'icon').style.backgroundImage = 'none';
        if (icon)
            this._find(item, 'file').style.backgroundImage = 'url(' + icon + ')';
        this._find(item, 'progress').style.display = 'none';
        this._find(item, 'cancel').style.display = 'none';
        this._find(item, 'remove').style.display = 'block';
        var inp = this._find(item, 'input');
        inp.value = id;
        inp.name = this._options.inputName;

        this._find(item, 'input_name').value = name;
        this._find(item, 'input_size').value = size;
        this._find(item, 'input_icon').value = icon;
        if (url)
            this._find(item, 'input_url').value = url;

        this._listElement.appendChild(item);

        this._filesTotal += 1;
        this._sizeTotal += size;

        this._initRemove(item, null, size);

    },

    _initRemove: function (item, url, size) {
        var a = this._find(item, 'remove');
        a.style.display = 'inline-block';
        var self = this;
        qq.attach(a, 'click', function (e) {
            qq.preventDefault(e);

            if (confirm('Biztosan törli a fájlt?')) {
                if (url) {
                    var xhr = new XMLHttpRequest();

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            self._filesTotal--;
                            self._sizeTotal -= size;
                            qq.remove(item);
                        }
                    };

                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.send();
                } else {
                    self._filesTotal--;
                    self._sizeTotal -= size;
                    qq.remove(item);
                    //törlés után fut FIXME: feltöltetlen fájl törlésekor ne fusson !!!!!
                    if (self._options.onAutoSaveHandler) {
                        self._options.onAutoSaveHandler();
                    }
                }
            }
        });
    },

    _onCompleteAll: function () {
        if (this.onCompleteAllHandlers) {
            for (var i in this.onCompleteAllHandlers) {
                if (isNaN(parseInt(i)))
                    continue;
                this.onCompleteAllHandlers[i]();
            }
            //delete this.onCompleteAllHandlers;
        }
    },

    _deleteFile: function (id) {
        var item = this._getItemByFileId(id);
        var a = this._find(item, 'remove');
        a.click();
    },

    _onSubmit: function (id, fileName) {
        qq.FileUploader.prototype._onSubmit.apply(this, arguments);

        if (this._options.onStartUploadHandler) {
            this._options.onStartUploadHandler();
        }
    },

    _onComplete: function (id, fileName, result) {
        qq.FileUploader.prototype._onComplete.apply(this, arguments);

        var item = this._getItemByFileId(id);
        this._find(item, 'progress').style.display = 'none';

        if (result.delurl && result.id) {

            var h = this._find(item, 'input');
            h.name = this._options.inputName;
            h.value = result.id;

            this._initRemove(item, result.delurl, result.size);

            var size = this._find(item, 'size');
            if (result.size) {
                size.style.display = 'inline';
                qq.setText(size, this._formatSize(result.size));
            }

            /*var icon = this._find(item, 'icon');
            if (result.icon) {
            icon.style.backgroundImage = 'url(' + result.icon + ')';
            } else {
            icon.style.backgroundImage = 'none';
            }*/
            this._find(item, 'icon').style.backgroundImage = 'none';

            if (result.icon)
                this._find(item, 'file').style.backgroundImage = 'url(' + result.icon + ')';

            this._find(item, 'input_name').value = fileName;
            this._find(item, 'input_size').value = result.size;
            this._find(item, 'input_icon').value = result.icon;
            if (result.url) {
                this._find(item, 'input_url').value = result.url;
                this._find(item, 'file').innerHTML = this._fileNameHtml(fileName, result.url);
            }
        }

        if (this._filesInProgress == 0) {
            this._onCompleteAll();
            if (typeof this._options.onCompleteAll == 'function')
                this._options.onCompleteAll();
        }
    },

    _onProgress: function (id, fileName, loaded, total) {
        qq.FileUploader.prototype._onProgress.apply(this, arguments);

        var item = this._getItemByFileId(id);
        var progress = this._find(item, 'progress');
        progress.style.display = 'inline-block';
        var inner = progress.getElementsByTagName('span')[0];
        this._find(item, 'remove').style.display = 'none';
        this._find(item, 'cancel').style.display = 'block';

        if (loaded != total) {
            inner.style.width = Math.round(loaded / total * 100) + '%';
        } else {
            progress.style.display = 'none';
        }
    },

    reset: function () {
        this._listElement.innerHTML = '';

        this._filesInProgress = 0;
        this._filesTotal = 0;
        this._sizeTotal = 0;

    },

    _fileNameHtml: function (label, url) {
        if (url == null)
            return '<span>' + this._formatFileName(label) + '</span>';
        else if (url.match(/^javascript:/))
            return '<a href="javascript:;" onclick="' + url.substr(11) + '">' + this._formatFileName(label) + '</a>';
        else
            return '<a href="' + url + '" target="_blank">' + this._formatFileName(label) + '</a>';
    }
});

qq.FileUploaderDex.executeIfAllReady = function (formid, func) {
    var f = document.getElementById(formid);
    var nodes = f.getElementsByTagName('div');
    for (var i = 0; i < nodes.length; i++) {
        var e = nodes[i];
        if (e.FileUploader) {
            (function (ff, ee) {
                func = function () { ee.FileUploader.executeIfReady(ff); };
            })(func, e);
        }
    }
    func();
};

     
/*********/
    
qq.UploadDropZone = function(o){
    this._options = {
        element: null,  
        onEnter: function(e){},
        onLeave: function(e){},  
        // is not fired when leaving element by hovering descendants   
        onLeaveNotDescendants: function(e){},   
        onDrop: function(e){}                       
    };
    qq.extend(this._options, o); 
    
    this._element = this._options.element;
    
    this._disableDropOutside();
    this._attachEvents();   
};

qq.UploadDropZone.prototype = {
    _disableDropOutside: function (e) {
        // run only once for all instances
        if (!qq.UploadDropZone.dropOutsideDisabled) {

            qq.attach(document, 'dragover', function (e) {
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'none';
                    e.preventDefault();
                }
            });

            qq.UploadDropZone.dropOutsideDisabled = true;
        }
    },
    _attachEvents: function () {
        var self = this;

        qq.attach(self._element, 'dragover', function (e) {
            if (!self._isValidFileDrag(e)) return;

            var effect;
            try {
                effect = e.dataTransfer.effectAllowed;
            }
            catch (e) { }
            if (effect == 'move' || effect == 'linkMove') {
                e.dataTransfer.dropEffect = 'move'; // for FF (only move allowed)    
            } else {
                e.dataTransfer.dropEffect = 'copy'; // for Chrome
            }

            e.stopPropagation();
            e.preventDefault();
        });

        qq.attach(self._element, 'dragenter', function (e) {
            if (!self._isValidFileDrag(e)) return;

            self._options.onEnter(e);
        });

        qq.attach(self._element, 'dragleave', function (e) {
            if (!self._isValidFileDrag(e)) return;

            self._options.onLeave(e);

            var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
            // do not fire when moving a mouse over a descendant
            if (qq.contains(this, relatedTarget)) return;

            self._options.onLeaveNotDescendants(e);
        });

        qq.attach(self._element, 'drop', function (e) {
            if (!self._isValidFileDrag(e)) return;

            e.preventDefault();
            self._options.onDrop(e);
        });
    },
    _isValidFileDrag: function (e) {
        var dt = e.dataTransfer,
        // do not check dt.types.contains in webkit, because it crashes safari 4            
            isWebkit = navigator.userAgent.indexOf("AppleWebKit") > -1;

        var ea = true;
        try {
            ea = dt.effectAllowed;
        }
        catch (e) { }

        // dt.effectAllowed is none in Safari 5
        // dt.types.contains check is for firefox            
        return dt && ea && ea != 'none' &&
            (dt.files || (!isWebkit && dt.types.contains && dt.types.contains('Files')));

    }
}; 

qq.UploadButton = function(o){
    this._options = {
        element: null,  
        // if set to true adds multiple attribute to file input      
        multiple: false,
        accept: null,
        // name attribute of file input
        name: '', // Ăźres, hogy ha form-on belĂźlre rakjuk az uploadgombot, akkor IE-ben ne legyen egy Ăźres ilyen nevĹą mezĹ pluszba
        onChange: function(input){},
        hoverClass: 'qq-upload-button-hover',
        focusClass: 'qq-upload-button-focus'                       
    };
    
    qq.extend(this._options, o);
        
    this._element = this._options.element;
    
    // make button suitable container for input
    qq.css(this._element, {
        position: 'relative',
        overflow: 'hidden',
        // Make sure browse button is in the right side
        // in Internet Explorer
        direction: 'ltr'
    });   
    
    this._input = this._createInput();
};

qq.UploadButton.prototype = {
    /* returns file input element */
    getInput: function () {
        return this._input;
    },
    /* cleans/recreates the file input */
    reset: function () {
        if (this._input.parentNode) {
            qq.remove(this._input);
        }

        qq.removeClass(this._element, this._options.focusClass);
        this._input = this._createInput();
    },
    _createInput: function () {
        var input = document.createElement("input");

        if (this._options.multiple)
            input.setAttribute("multiple", "multiple");
        if (this._options.accept)
            input.setAttribute("accept", this._options.accept);

        input.setAttribute("type", "file");
        input.setAttribute("name", this._options.name);

        qq.css(input, {
            position: 'absolute',
            // in Opera only 'browse' button
            // is clickable and it is located at
            // the right side of the input
            right: 0,
            top: 0,
            fontFamily: 'Arial',
            // 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
            fontSize: '118px',
            margin: 0,
            padding: 0,
            cursor: 'pointer',
            opacity: 0
        });

        this._element.appendChild(input);

        var self = this;
        qq.attach(input, 'change', function () {
            self._options.onChange(input);
        });

        qq.attach(input, 'mouseover', function () {
            qq.addClass(self._element, self._options.hoverClass);
        });
        qq.attach(input, 'mouseout', function () {
            qq.removeClass(self._element, self._options.hoverClass);
        });
        qq.attach(input, 'focus', function () {
            qq.addClass(self._element, self._options.focusClass);
        });
        qq.attach(input, 'blur', function () {
            qq.removeClass(self._element, self._options.focusClass);
        });

        // IE and Opera, unfortunately have 2 tab stops on file input
        // which is unacceptable in our case, disable keyboard access
        if (window.attachEvent) {
            // it is IE or Opera
            input.setAttribute('tabIndex', "-1");
        }

        return input;
    }
};

/**
 * Class for uploading files, uploading itself is handled by child classes
 */
qq.UploadHandlerAbstract = function(o){
    this._options = {
        debug: false,
        action: '/upload.php',
        // maximum number of concurrent uploads        
        maxConnections: 999,
        onProgress: function(id, fileName, loaded, total){},
        onComplete: function(id, fileName, response){},
        onCancel: function(id, fileName){}
    };
    qq.extend(this._options, o);    
    
    this._queue = [];
    // params for files in queue
    this._params = [];
};
qq.UploadHandlerAbstract.prototype = {
    log: function(str){
        if (this._options.debug && window.console) console.log('[uploader] ' + str);        
    },
    /**
     * Adds file or file input to the queue
     * @returns id
     **/    
    add: function(file){},
    /**
     * Sends the file identified by id and additional query params to the server
     */
    upload: function(id, params){
        var len = this._queue.push(id);

        var copy = {};        
        qq.extend(copy, params);
        this._params[id] = copy;        
                
        // if too many active uploads, wait...
        if (len <= this._options.maxConnections){               
            this._upload(id, this._params[id]);
        }
    },
    /**
     * Cancels file upload by id
     */
    cancel: function(id){
        this._cancel(id);
        this._dequeue(id);
    },
    /**
     * Cancells all uploads
     */
    cancelAll: function(){
        for (var i=0; i<this._queue.length; i++){
            this._cancel(this._queue[i]);
        }
        this._queue = [];
    },
    /**
     * Returns name of the file identified by id
     */
    getName: function(id){},
    /**
     * Returns size of the file identified by id
     */          
    getSize: function(id){},
    /**
     * Returns id of files being uploaded or
     * waiting for their turn
     */
    getQueue: function(){
        return this._queue;
    },
    /**
     * Actual upload method
     */
    _upload: function(id){},
    /**
     * Actual cancel method
     */
    _cancel: function(id){},     
    /**
     * Removes element from queue, starts upload of next
     */
    _dequeue: function(id){
        var i = qq.indexOf(this._queue, id);
        this._queue.splice(i, 1);
                
        var max = this._options.maxConnections;
        
        if (this._queue.length >= max && i < max){
            var nextId = this._queue[max-1];
            this._upload(nextId, this._params[nextId]);
        }
    }        
};

/**
 * Class for uploading files using form and iframe
 * @inherits qq.UploadHandlerAbstract
 */
qq.UploadHandlerForm = function(o){
    qq.UploadHandlerAbstract.apply(this, arguments);
       
    this._inputs = {};
};
// @inherits qq.UploadHandlerAbstract
qq.extend(qq.UploadHandlerForm.prototype, qq.UploadHandlerAbstract.prototype);

qq.extend(qq.UploadHandlerForm.prototype, {
    add: function(fileInput){
        fileInput.setAttribute('name', 'qqfile');
        var id = 'qq-upload-handler-iframe' + qq.getUniqueId();       
        
        this._inputs[id] = fileInput;
        
        // remove file input from DOM
        if (fileInput.parentNode){
            qq.remove(fileInput);
        }
                
        return id;
    },
    getName: function(id){
        // get input value and remove path to normalize
        return this._inputs[id].value.replace(/.*(\/|\\)/, "");
    },    
    _cancel: function(id){
        this._options.onCancel(id, this.getName(id));
        
        delete this._inputs[id];        

        var iframe = document.getElementById(id);
        if (iframe){
            // to cancel request set src to something else
            // we use src="javascript:false;" because it doesn't
            // trigger ie6 prompt on https
            iframe.setAttribute('src', 'javascript:false;');

            qq.remove(iframe);
        }
    },     
    _upload: function(id, params){                        
        var input = this._inputs[id];
        
        if (!input){
            throw new Error('file with passed id was not added, or already uploaded or cancelled');
        }                

        var fileName = this.getName(id);
                
        var iframe = this._createIframe(id);
        var form = this._createForm(iframe, params);
        form.appendChild(input);

        var self = this;
        this._attachLoadEvent(iframe, function(){                                 
            self.log('iframe loaded');
            
            var response = self._getIframeContentJSON(iframe);

            self._options.onComplete(id, fileName, response);
            self._dequeue(id);
            
            delete self._inputs[id];
            // timeout added to fix busy state in FF3.6
            setTimeout(function(){
                qq.remove(iframe);
            }, 1);
        });

        form.submit();        
        qq.remove(form);        
        
        return id;
    }, 
    _attachLoadEvent: function(iframe, callback){
        qq.attach(iframe, 'load', function(){
            // when we remove iframe from dom
            // the request stops, but in IE load
            // event fires
            if (!iframe.parentNode){
                return;
            }

            // fixing Opera 10.53
            if (iframe.contentDocument &&
                iframe.contentDocument.body &&
                iframe.contentDocument.body.innerHTML == "false"){
                // In Opera event is fired second time
                // when body.innerHTML changed from false
                // to server response approx. after 1 sec
                // when we upload file with iframe
                return;
            }

            callback();
        });
    },
    /**
     * Returns json object received by iframe from server.
     */
    _getIframeContentJSON: function(iframe){
        // iframe.contentWindow.document - for IE<7
        var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
            response;
        
        this.log("converting iframe's innerHTML to JSON");
        this.log("innerHTML = " + doc.body.innerHTML);
                        
        try {
            response = eval("(" + doc.body.innerHTML + ")");
        } catch(err){
            response = {};
        }        

        return response;
    },
    /**
     * Creates iframe with unique name
     */
    _createIframe: function(id){
        // We can't use following code as the name attribute
        // won't be properly registered in IE6, and new window
        // on form submit will open
        // var iframe = document.createElement('iframe');
        // iframe.setAttribute('name', id);

        var iframe = qq.toElement('<iframe src="javascript:false;" name="' + id + '" />');
        // src="javascript:false;" removes ie6 prompt on https

        iframe.setAttribute('id', id);

        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        return iframe;
    },
    /**
     * Creates form, that will be submitted to iframe
     */
    _createForm: function(iframe, params){
        // We can't use the following code in IE6
        // var form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.setAttribute('enctype', 'multipart/form-data');
        // Because in this case file won't be attached to request
        var form = qq.toElement('<form method="post" enctype="multipart/form-data"></form>');

        var queryString = qq.obj2url(params, this._options.action);

        form.setAttribute('action', queryString);
        form.setAttribute('target', iframe.name);
        form.style.display = 'none';
        document.body.appendChild(form);

        return form;
    }
});

/**
 * Class for uploading files using xhr
 * @inherits qq.UploadHandlerAbstract
 */
qq.UploadHandlerXhr = function(o){
    qq.UploadHandlerAbstract.apply(this, arguments);

    this._files = [];
    this._xhrs = [];
    
    // current loaded size in bytes for each file 
    this._loaded = [];
};

// static method
qq.UploadHandlerXhr.isSupported = function(){
    var input = document.createElement('input');
    input.type = 'file';        
    
    return (
        'multiple' in input &&
        typeof File != "undefined" &&
        typeof (new XMLHttpRequest()).upload != "undefined" );       
};

// @inherits qq.UploadHandlerAbstract
qq.extend(qq.UploadHandlerXhr.prototype, qq.UploadHandlerAbstract.prototype)

qq.extend(qq.UploadHandlerXhr.prototype, {
    /**
     * Adds file to the queue
     * Returns id to use with upload, cancel
     **/    
    add: function(file){
        if (!(file instanceof File)){
            throw new Error('Passed obj in not a File (in qq.UploadHandlerXhr)');
        }
                
        return this._files.push(file) - 1;        
    },
    getName: function(id){        
        var file = this._files[id];
        // fix missing name in Safari 4
        return file.fileName != null ? file.fileName : file.name;       
    },
    getSize: function(id){
        var file = this._files[id];
        return file.fileSize != null ? file.fileSize : file.size;
    },    
    /**
     * Returns uploaded bytes for file identified by id 
     */    
    getLoaded: function(id){
        return this._loaded[id] || 0; 
    },
    /**
     * Sends the file identified by id and additional query params to the server
     * @param {Object} params name-value string pairs
     */    
    _upload: function(id, params){
        var file = this._files[id],
            name = this.getName(id),
            size = this.getSize(id);
                
        this._loaded[id] = 0;
                                
        var xhr = this._xhrs[id] = new XMLHttpRequest();
        var self = this;
                                        
        xhr.upload.onprogress = function(e){
            if (e.lengthComputable){
                self._loaded[id] = e.loaded;
                self._options.onProgress(id, name, e.loaded, e.total);
            }
        };

        xhr.onreadystatechange = function(){            
            if (xhr.readyState == 4){
                self._onComplete(id, xhr);                    
            }
        };

        // build query string
        params = params || {};
        params['qqfile'] = name;
        var queryString = qq.obj2url(params, this._options.action);

        xhr.open("POST", queryString, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(file);
    },
    _onComplete: function(id, xhr){
        // the request was aborted/cancelled
        if (!this._files[id]) return;
        
        var name = this.getName(id);
        var size = this.getSize(id);
        
        this._options.onProgress(id, name, size, size);
                
        if (xhr.status == 200){
            this.log("xhr - server response received");
            this.log("responseText = " + xhr.responseText);
                        
            var response;
                    
            try {
                response = eval("(" + xhr.responseText + ")");
            } catch(err){
                response = {};
            }
            
            this._options.onComplete(id, name, response);
                        
        } else {                   
            this._options.onComplete(id, name, {});
        }
                
        this._files[id] = null;
        this._xhrs[id] = null;    
        this._dequeue(id);                    
    },
    _cancel: function(id){
        this._options.onCancel(id, this.getName(id));
        
        this._files[id] = null;
        
        if (this._xhrs[id]){
            this._xhrs[id].abort();
            this._xhrs[id] = null;                                   
        }
    }
});

