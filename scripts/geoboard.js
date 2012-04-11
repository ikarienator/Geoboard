/*!
 * jQuery JavaScript Library v1.7.1
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
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
  var document = window.document,
    navigator = window.navigator,
    location = window.location;
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
      // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
      quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

      // Check if a string has a non-whitespace character in it
      rnotwhite = /\S/,

      // Used for trimming whitespace
      trimLeft = /^\s+/,
      trimRight = /\s+$/,

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

      // Matches dashed string for camelizing
      rdashAlpha = /-([a-z]|[0-9])/ig,
      rmsPrefix = /^-ms-/,

      // Used by jQuery.camelCase as callback to replace()
      fcamelCase = function( all, letter ) {
        return ( letter + "" ).toUpperCase();
      },

      // Keep a UserAgent string for use with jQuery.browser
      userAgent = navigator.userAgent,

      // For matching the engine and version of the browser
      browserMatch,

      // The deferred used on DOM ready
      readyList,

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
          this.selector = selector;
          this.length = 1;
          return this;
        }

        // Handle HTML strings
        if ( typeof selector === "string" ) {
          // Are we dealing with HTML string or an ID?
          if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
            // Assume that strings that start and end with <> are HTML and skip the regex check
            match = [ null, selector, null ];

          } else {
            match = quickExpr.exec( selector );
          }

          // Verify a match, and that no context was specified for #id
          if ( match && (match[1] || !context) ) {

            // HANDLE: $(html) -> $(array)
            if ( match[1] ) {
              context = context instanceof jQuery ? context[0] : context;
              doc = ( context ? context.ownerDocument || context : document );

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
                selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
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
            return ( context || rootjQuery ).find( selector );

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

        if ( selector.selector !== undefined ) {
          this.selector = selector.selector;
          this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
      },

      // Start with an empty selector
      selector: "",

      // The current version of jQuery being used
      jquery: "1.7.1",

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
          ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
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
        readyList.add( fn );

        return this;
      },

      eq: function( i ) {
        i = +i;
        return i === -1 ?
          this.slice( i ) :
          this.slice( i, i + 1 );
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
        if ( window.$ === jQuery ) {
          window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
          window.jQuery = _jQuery;
        }

        return jQuery;
      },

      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: false,

      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,

      // Hold (or release) the ready event
      holdReady: function( hold ) {
        if ( hold ) {
          jQuery.readyWait++;
        } else {
          jQuery.ready( true );
        }
      },

      // Handle when the DOM is ready
      ready: function( wait ) {
        // Either a released hold or an DOMready/load event and not yet ready
        if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
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
          readyList.fireWith( document, [ jQuery ] );

          // Trigger any bound ready events
          if ( jQuery.fn.trigger ) {
            jQuery( document ).trigger( "ready" ).off( "ready" );
          }
        }
      },

      bindReady: function() {
        if ( readyList ) {
          return;
        }

        readyList = jQuery.Callbacks( "once memory" );

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
          document.attachEvent( "onreadystatechange", DOMContentLoaded );

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

      isNumeric: function( obj ) {
        return !isNaN( parseFloat(obj) ) && isFinite( obj );
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

        try {
          // Not own constructor property must be Object
          if ( obj.constructor &&
            !hasOwn.call(obj, "constructor") &&
            !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
            return false;
          }
        } catch ( e ) {
          // IE8,9 Will throw exceptions on certain host objects #9897
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
        throw new Error( msg );
      },

      parseJSON: function( data ) {
        if ( typeof data !== "string" || !data ) {
          return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim( data );

        // Attempt to parse using the native JSON parser first
        if ( window.JSON && window.JSON.parse ) {
          return window.JSON.parse( data );
        }

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
          .replace( rvalidtokens, "]" )
          .replace( rvalidbraces, "")) ) {

          return ( new Function( "return " + data ) )();

        }
        jQuery.error( "Invalid JSON: " + data );
      },

      // Cross-browser xml parsing
      parseXML: function( data ) {
        var xml, tmp;
        try {
          if ( window.DOMParser ) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString( data , "text/xml" );
          } else { // IE
            xml = new ActiveXObject( "Microsoft.XMLDOM" );
            xml.async = "false";
            xml.loadXML( data );
          }
        } catch( e ) {
          xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
          jQuery.error( "Invalid XML: " + data );
        }
        return xml;
      },

      noop: function() {},

      // Evaluates a script in a global context
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function( data ) {
        if ( data && rnotwhite.test( data ) ) {
          // We use execScript on Internet Explorer
          // We use an anonymous function so that context is window
          // rather than jQuery in Firefox
          ( window.execScript || function( data ) {
            window[ "eval" ].call( window, data );
          } )( data );
        }
      },

      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
      },

      nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
      },

      // args is for internal usage only
      each: function( object, callback, args ) {
        var name, i = 0,
          length = object.length,
          isObj = length === undefined || jQuery.isFunction( object );

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
            for ( ; i < length; ) {
              if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                break;
              }
            }
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
          // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
          var type = jQuery.type( array );

          if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
            push.call( ret, array );
          } else {
            jQuery.merge( ret, array );
          }
        }

        return ret;
      },

      inArray: function( elem, array, i ) {
        var len;

        if ( array ) {
          if ( indexOf ) {
            return indexOf.call( array, elem, i );
          }

          len = array.length;
          i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

          for ( ; i < len; i++ ) {
            // Skip accessing in sparse arrays
            if ( i in array && array[ i ] === elem ) {
              return i;
            }
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
        var value, key, ret = [],
          i = 0,
          length = elems.length,
          // jquery objects are treated as arrays
          isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

        // Go through the array, translating each of the items to their
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
              ret[ ret.length ] = value;
            }
          }

          // Go through every key on the object,
        } else {
          for ( key in elems ) {
            value = callback( elems[ key ], key, arg );

            if ( value != null ) {
              ret[ ret.length ] = value;
            }
          }
        }

        // Flatten any nested arrays
        return ret.concat.apply( [], ret );
      },

      // A global GUID counter for objects
      guid: 1,

      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function( fn, context ) {
        if ( typeof context === "string" ) {
          var tmp = fn[ context ];
          context = fn;
          fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) {
          return undefined;
        }

        // Simulated bind
        var args = slice.call( arguments, 2 ),
          proxy = function() {
            return fn.apply( context, args.concat( slice.call( arguments ) ) );
          };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

        return proxy;
      },

      // Mutifunctional method to get and set values to a collection
      // The value/s can optionally be executed if it's a function
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
        return ( new Date() ).getTime();
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
        function jQuerySub( selector, context ) {
          return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
          if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
            context = jQuerySub( context );
          }

          return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
      },

      browser: {}
    });

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

    return jQuery;

  })();


// String to Object flags format cache
  var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
  function createFlags( flags ) {
    var object = flagsCache[ flags ] = {},
      i, length;
    flags = flags.split( /\s+/ );
    for ( i = 0, length = flags.length; i < length; i++ ) {
      object[ flags[i] ] = true;
    }
    return object;
  }

  /*
   * Create a callback list using the following parameters:
   *
   *	flags:	an optional list of space-separated flags that will change how
   *			the callback list behaves
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible flags:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */
  jQuery.Callbacks = function( flags ) {

    // Convert flags from String-formatted to Object-formatted
    // (we check in cache first)
    flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

    var // Actual callback list
      list = [],
      // Stack of fire calls for repeatable lists
      stack = [],
      // Last fire value (for non-forgettable lists)
      memory,
      // Flag to know if list is currently firing
      firing,
      // First callback to fire (used internally by add and fireWith)
      firingStart,
      // End of the loop when firing
      firingLength,
      // Index of currently firing callback (modified by remove if needed)
      firingIndex,
      // Add one or several callbacks to the list
      add = function( args ) {
        var i,
          length,
          elem,
          type,
          actual;
        for ( i = 0, length = args.length; i < length; i++ ) {
          elem = args[ i ];
          type = jQuery.type( elem );
          if ( type === "array" ) {
            // Inspect recursively
            add( elem );
          } else if ( type === "function" ) {
            // Add if not in unique mode and callback is not in
            if ( !flags.unique || !self.has( elem ) ) {
              list.push( elem );
            }
          }
        }
      },
      // Fire callbacks
      fire = function( context, args ) {
        args = args || [];
        memory = !flags.memory || [ context, args ];
        firing = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        for ( ; list && firingIndex < firingLength; firingIndex++ ) {
          if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
            memory = true; // Mark as halted
            break;
          }
        }
        firing = false;
        if ( list ) {
          if ( !flags.once ) {
            if ( stack && stack.length ) {
              memory = stack.shift();
              self.fireWith( memory[ 0 ], memory[ 1 ] );
            }
          } else if ( memory === true ) {
            self.disable();
          } else {
            list = [];
          }
        }
      },
      // Actual Callbacks object
      self = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          if ( list ) {
            var length = list.length;
            add( arguments );
            // Do we need to add the callbacks to the
            // current firing batch?
            if ( firing ) {
              firingLength = list.length;
              // With memory, if we're not firing then
              // we should call right away, unless previous
              // firing was halted (stopOnFalse)
            } else if ( memory && memory !== true ) {
              firingStart = length;
              fire( memory[ 0 ], memory[ 1 ] );
            }
          }
          return this;
        },
        // Remove a callback from the list
        remove: function() {
          if ( list ) {
            var args = arguments,
              argIndex = 0,
              argLength = args.length;
            for ( ; argIndex < argLength ; argIndex++ ) {
              for ( var i = 0; i < list.length; i++ ) {
                if ( args[ argIndex ] === list[ i ] ) {
                  // Handle firingIndex and firingLength
                  if ( firing ) {
                    if ( i <= firingLength ) {
                      firingLength--;
                      if ( i <= firingIndex ) {
                        firingIndex--;
                      }
                    }
                  }
                  // Remove the element
                  list.splice( i--, 1 );
                  // If we have some unicity property then
                  // we only need to do this once
                  if ( flags.unique ) {
                    break;
                  }
                }
              }
            }
          }
          return this;
        },
        // Control if a given callback is in the list
        has: function( fn ) {
          if ( list ) {
            var i = 0,
              length = list.length;
            for ( ; i < length; i++ ) {
              if ( fn === list[ i ] ) {
                return true;
              }
            }
          }
          return false;
        },
        // Remove all callbacks from the list
        empty: function() {
          list = [];
          return this;
        },
        // Have the list do nothing anymore
        disable: function() {
          list = stack = memory = undefined;
          return this;
        },
        // Is it disabled?
        disabled: function() {
          return !list;
        },
        // Lock the list in its current state
        lock: function() {
          stack = undefined;
          if ( !memory || memory === true ) {
            self.disable();
          }
          return this;
        },
        // Is it locked?
        locked: function() {
          return !stack;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function( context, args ) {
          if ( stack ) {
            if ( firing ) {
              if ( !flags.once ) {
                stack.push( [ context, args ] );
              }
            } else if ( !( flags.once && memory ) ) {
              fire( context, args );
            }
          }
          return this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          self.fireWith( this, arguments );
          return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!memory;
        }
      };

    return self;
  };




  var // Static reference to slice
    sliceDeferred = [].slice;

  jQuery.extend({

    Deferred: function( func ) {
      var doneList = jQuery.Callbacks( "once memory" ),
        failList = jQuery.Callbacks( "once memory" ),
        progressList = jQuery.Callbacks( "memory" ),
        state = "pending",
        lists = {
          resolve: doneList,
          reject: failList,
          notify: progressList
        },
        promise = {
          done: doneList.add,
          fail: failList.add,
          progress: progressList.add,

          state: function() {
            return state;
          },

          // Deprecated
          isResolved: doneList.fired,
          isRejected: failList.fired,

          then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
            deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
            return this;
          },
          always: function() {
            deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
            return this;
          },
          pipe: function( fnDone, fnFail, fnProgress ) {
            return jQuery.Deferred(function( newDefer ) {
              jQuery.each( {
                done: [ fnDone, "resolve" ],
                fail: [ fnFail, "reject" ],
                progress: [ fnProgress, "notify" ]
              }, function( handler, data ) {
                var fn = data[ 0 ],
                  action = data[ 1 ],
                  returned;
                if ( jQuery.isFunction( fn ) ) {
                  deferred[ handler ](function() {
                    returned = fn.apply( this, arguments );
                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                      returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                    } else {
                      newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                    }
                  });
                } else {
                  deferred[ handler ]( newDefer[ action ] );
                }
              });
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function( obj ) {
            if ( obj == null ) {
              obj = promise;
            } else {
              for ( var key in promise ) {
                obj[ key ] = promise[ key ];
              }
            }
            return obj;
          }
        },
        deferred = promise.promise({}),
        key;

      for ( key in lists ) {
        deferred[ key ] = lists[ key ].fire;
        deferred[ key + "With" ] = lists[ key ].fireWith;
      }

      // Handle state
      deferred.done( function() {
        state = "resolved";
      }, failList.disable, progressList.lock ).fail( function() {
          state = "rejected";
        }, doneList.disable, progressList.lock );

      // Call given func if any
      if ( func ) {
        func.call( deferred, deferred );
      }

      // All done!
      return deferred;
    },

    // Deferred helper
    when: function( firstParam ) {
      var args = sliceDeferred.call( arguments, 0 ),
        i = 0,
        length = args.length,
        pValues = new Array( length ),
        count = length,
        pCount = length,
        deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
          firstParam :
          jQuery.Deferred(),
        promise = deferred.promise();
      function resolveFunc( i ) {
        return function( value ) {
          args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
          if ( !( --count ) ) {
            deferred.resolveWith( deferred, args );
          }
        };
      }
      function progressFunc( i ) {
        return function( value ) {
          pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
          deferred.notifyWith( promise, pValues );
        };
      }
      if ( length > 1 ) {
        for ( ; i < length; i++ ) {
          if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
            args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
          } else {
            --count;
          }
        }
        if ( !count ) {
          deferred.resolveWith( deferred, args );
        }
      } else if ( deferred !== firstParam ) {
        deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
      }
      return promise;
    }
  });




  jQuery.support = (function() {

    var support,
      all,
      a,
      select,
      opt,
      input,
      marginDiv,
      fragment,
      tds,
      events,
      eventName,
      i,
      isSupported,
      div = document.createElement( "div" ),
      documentElement = document.documentElement;

    // Preliminary tests
    div.setAttribute("className", "t");
    div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

    all = div.getElementsByTagName( "*" );
    a = div.getElementsByTagName( "a" )[ 0 ];

    // Can't get basic test support
    if ( !all || !all.length || !a ) {
      return {};
    }

    // First batch of supports tests
    select = document.createElement( "select" );
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName( "input" )[ 0 ];

    support = {
      // IE strips leading whitespace when .innerHTML is used
      leadingWhitespace: ( div.firstChild.nodeType === 3 ),

      // Make sure that tbody elements aren't automatically inserted
      // IE will insert them into empty tables
      tbody: !div.getElementsByTagName("tbody").length,

      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      htmlSerialize: !!div.getElementsByTagName("link").length,

      // Get the style information from getAttribute
      // (IE uses .cssText instead)
      style: /top/.test( a.getAttribute("style") ),

      // Make sure that URLs aren't manipulated
      // (IE normalizes it by default)
      hrefNormalized: ( a.getAttribute("href") === "/a" ),

      // Make sure that element opacity exists
      // (IE uses filter instead)
      // Use a regex to work around a WebKit issue. See #5145
      opacity: /^0.55/.test( a.style.opacity ),

      // Verify style float existence
      // (IE uses styleFloat instead of cssFloat)
      cssFloat: !!a.style.cssFloat,

      // Make sure that if no value is specified for a checkbox
      // that it defaults to "on".
      // (WebKit defaults to "" instead)
      checkOn: ( input.value === "on" ),

      // Make sure that a selected-by-default option has a working selected property.
      // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
      optSelected: opt.selected,

      // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
      getSetAttribute: div.className !== "t",

      // Tests for enctype support on a form(#6743)
      enctype: !!document.createElement("form").enctype,

      // Makes sure cloning an html5 element does not cause problems
      // Where outerHTML is undefined, this still works
      html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

      // Will be defined later
      submitBubbles: true,
      changeBubbles: true,
      focusinBubbles: false,
      deleteExpando: true,
      noCloneEvent: true,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableMarginRight: true
    };

    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
      delete div.test;
    } catch( e ) {
      support.deleteExpando = false;
    }

    if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
      div.attachEvent( "onclick", function() {
        // Cloning a node shouldn't copy over any
        // bound event handlers (IE does this)
        support.noCloneEvent = false;
      });
      div.cloneNode( true ).fireEvent( "onclick" );
    }

    // Check if a radio maintains its value
    // after being appended to the DOM
    input = document.createElement("input");
    input.value = "t";
    input.setAttribute("type", "radio");
    support.radioValue = input.value === "t";

    input.setAttribute("checked", "checked");
    div.appendChild( input );
    fragment = document.createDocumentFragment();
    fragment.appendChild( div.lastChild );

    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;

    fragment.removeChild( input );
    fragment.appendChild( div );

    div.innerHTML = "";

    // Check if div with explicit width and no margin-right incorrectly
    // gets computed margin-right based on width of container. For more
    // info see bug #3333
    // Fails in WebKit before Feb 2011 nightlies
    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    if ( window.getComputedStyle ) {
      marginDiv = document.createElement( "div" );
      marginDiv.style.width = "0";
      marginDiv.style.marginRight = "0";
      div.style.width = "2px";
      div.appendChild( marginDiv );
      support.reliableMarginRight =
        ( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
    }

    // Technique from Juriy Zaytsev
    // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
    // We only care about the case where non-standard event systems
    // are used, namely in IE. Short-circuiting here helps us to
    // avoid an eval call (in setAttribute) which can cause CSP
    // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
    if ( div.attachEvent ) {
      for( i in {
        submit: 1,
        change: 1,
        focusin: 1
      }) {
        eventName = "on" + i;
        isSupported = ( eventName in div );
        if ( !isSupported ) {
          div.setAttribute( eventName, "return;" );
          isSupported = ( typeof div[ eventName ] === "function" );
        }
        support[ i + "Bubbles" ] = isSupported;
      }
    }

    fragment.removeChild( div );

    // Null elements to avoid leaks in IE
    fragment = select = opt = marginDiv = div = input = null;

    // Run tests that need a body at doc ready
    jQuery(function() {
      var container, outer, inner, table, td, offsetSupport,
        conMarginTop, ptlm, vb, style, html,
        body = document.getElementsByTagName("body")[0];

      if ( !body ) {
        // Return for frameset docs that don't have a body
        return;
      }

      conMarginTop = 1;
      ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
      vb = "visibility:hidden;border:0;";
      style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
      html = "<div " + style + "><div></div></div>" +
        "<table " + style + " cellpadding='0' cellspacing='0'>" +
        "<tr><td></td></tr></table>";

      container = document.createElement("div");
      container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
      body.insertBefore( container, body.firstChild );

      // Construct the test element
      div = document.createElement("div");
      container.appendChild( div );

      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      // (only IE 8 fails this test)
      div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName( "td" );
      isSupported = ( tds[ 0 ].offsetHeight === 0 );

      tds[ 0 ].style.display = "";
      tds[ 1 ].style.display = "none";

      // Check if empty table cells still have offsetWidth/Height
      // (IE <= 8 fail this test)
      support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

      // Figure out if the W3C box model works as expected
      div.innerHTML = "";
      div.style.width = div.style.paddingLeft = "1px";
      jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

      if ( typeof div.style.zoom !== "undefined" ) {
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        // (IE < 8 does this)
        div.style.display = "inline";
        div.style.zoom = 1;
        support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

        // Check if elements with layout shrink-wrap their children
        // (IE 6 does this)
        div.style.display = "";
        div.innerHTML = "<div style='width:4px;'></div>";
        support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
      }

      div.style.cssText = ptlm + vb;
      div.innerHTML = html;

      outer = div.firstChild;
      inner = outer.firstChild;
      td = outer.nextSibling.firstChild.firstChild;

      offsetSupport = {
        doesNotAddBorder: ( inner.offsetTop !== 5 ),
        doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
      };

      inner.style.position = "fixed";
      inner.style.top = "20px";

      // safari subtracts parent border width here which is 5px
      offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
      inner.style.position = inner.style.top = "";

      outer.style.overflow = "hidden";
      outer.style.position = "relative";

      offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
      offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

      body.removeChild( container );
      div  = container = null;

      jQuery.extend( support, offsetSupport );
    });

    return support;
  })();




  var rbrace = /^(?:\{.*\}|\[.*\])$/,
    rmultiDash = /([A-Z])/g;

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

      var privateCache, thisCache, ret,
        internalKey = jQuery.expando,
        getByName = typeof name === "string",

        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
        isNode = elem.nodeType,

        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
        cache = isNode ? jQuery.cache : elem,

        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
        id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
        isEvents = name === "events";

      // Avoid doing any more work than we need to when trying to get data on an
      // object that has no data at all
      if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
        return;
      }

      if ( !id ) {
        // Only DOM nodes need a new unique ID for each element since their data
        // ends up in the global cache
        if ( isNode ) {
          elem[ internalKey ] = id = ++jQuery.uuid;
        } else {
          id = internalKey;
        }
      }

      if ( !cache[ id ] ) {
        cache[ id ] = {};

        // Avoids exposing jQuery metadata on plain JS objects when the object
        // is serialized using JSON.stringify
        if ( !isNode ) {
          cache[ id ].toJSON = jQuery.noop;
        }
      }

      // An object can be passed to jQuery.data instead of a key/value pair; this gets
      // shallow copied over onto the existing cache
      if ( typeof name === "object" || typeof name === "function" ) {
        if ( pvt ) {
          cache[ id ] = jQuery.extend( cache[ id ], name );
        } else {
          cache[ id ].data = jQuery.extend( cache[ id ].data, name );
        }
      }

      privateCache = thisCache = cache[ id ];

      // jQuery data() is stored in a separate object inside the object's internal data
      // cache in order to avoid key collisions between internal data and user-defined
      // data.
      if ( !pvt ) {
        if ( !thisCache.data ) {
          thisCache.data = {};
        }

        thisCache = thisCache.data;
      }

      if ( data !== undefined ) {
        thisCache[ jQuery.camelCase( name ) ] = data;
      }

      // Users should not attempt to inspect the internal events object using jQuery.data,
      // it is undocumented and subject to change. But does anyone listen? No.
      if ( isEvents && !thisCache[ name ] ) {
        return privateCache.events;
      }

      // Check for both converted-to-camel and non-converted data property names
      // If a data property was specified
      if ( getByName ) {

        // First Try to find as-is property data
        ret = thisCache[ name ];

        // Test for null|undefined property data
        if ( ret == null ) {

          // Try to find the camelCased property
          ret = thisCache[ jQuery.camelCase( name ) ];
        }
      } else {
        ret = thisCache;
      }

      return ret;
    },

    removeData: function( elem, name, pvt /* Internal Use Only */ ) {
      if ( !jQuery.acceptData( elem ) ) {
        return;
      }

      var thisCache, i, l,

        // Reference to internal data cache key
        internalKey = jQuery.expando,

        isNode = elem.nodeType,

        // See jQuery.data for more information
        cache = isNode ? jQuery.cache : elem,

        // See jQuery.data for more information
        id = isNode ? elem[ internalKey ] : internalKey;

      // If there is already no cache entry for this object, there is no
      // purpose in continuing
      if ( !cache[ id ] ) {
        return;
      }

      if ( name ) {

        thisCache = pvt ? cache[ id ] : cache[ id ].data;

        if ( thisCache ) {

          // Support array or space separated string names for data keys
          if ( !jQuery.isArray( name ) ) {

            // try the string as a key before any manipulation
            if ( name in thisCache ) {
              name = [ name ];
            } else {

              // split the camel cased version by spaces unless a key with the spaces exists
              name = jQuery.camelCase( name );
              if ( name in thisCache ) {
                name = [ name ];
              } else {
                name = name.split( " " );
              }
            }
          }

          for ( i = 0, l = name.length; i < l; i++ ) {
            delete thisCache[ name[i] ];
          }

          // If there is no data left in the cache, we want to continue
          // and let the cache object itself get destroyed
          if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
            return;
          }
        }
      }

      // See jQuery.data for more information
      if ( !pvt ) {
        delete cache[ id ].data;

        // Don't destroy the parent cache unless the internal data object
        // had been the only thing left in it
        if ( !isEmptyDataObject(cache[ id ]) ) {
          return;
        }
      }

      // Browsers that fail expando deletion also refuse to delete expandos on
      // the window, but it will allow it on all other JS objects; other browsers
      // don't care
      // Ensure that `cache` is not a window object #10080
      if ( jQuery.support.deleteExpando || !cache.setInterval ) {
        delete cache[ id ];
      } else {
        cache[ id ] = null;
      }

      // We destroyed the cache and need to eliminate the expando on the node to avoid
      // false lookups in the cache for entries that no longer exist
      if ( isNode ) {
        // IE does not allow us to delete expando properties from nodes,
        // nor does it have a removeAttribute function on Document nodes;
        // we must handle all of these cases
        if ( jQuery.support.deleteExpando ) {
          delete elem[ internalKey ];
        } else if ( elem.removeAttribute ) {
          elem.removeAttribute( internalKey );
        } else {
          elem[ internalKey ] = null;
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
      var parts, attr, name,
        data = null;

      if ( typeof key === "undefined" ) {
        if ( this.length ) {
          data = jQuery.data( this[0] );

          if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
            attr = this[0].attributes;
            for ( var i = 0, l = attr.length; i < l; i++ ) {
              name = attr[i].name;

              if ( name.indexOf( "data-" ) === 0 ) {
                name = jQuery.camelCase( name.substring(5) );

                dataAttr( this[0], name, data[ name ] );
              }
            }
            jQuery._data( this[0], "parsedAttrs", true );
          }
        }

        return data;

      } else if ( typeof key === "object" ) {
        return this.each(function() {
          jQuery.data( this, key );
        });
      }

      parts = key.split(".");
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
          var self = jQuery( this ),
            args = [ parts[0], value ];

          self.triggerHandler( "setData" + parts[1] + "!", args );
          jQuery.data( this, key, value );
          self.triggerHandler( "changeData" + parts[1] + "!", args );
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

      var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

      data = elem.getAttribute( name );

      if ( typeof data === "string" ) {
        try {
          data = data === "true" ? true :
            data === "false" ? false :
              data === "null" ? null :
                jQuery.isNumeric( data ) ? parseFloat( data ) :
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

// checks a cache object for emptiness
  function isEmptyDataObject( obj ) {
    for ( var name in obj ) {

      // if the public data object is empty, the private is still empty
      if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
        continue;
      }
      if ( name !== "toJSON" ) {
        return false;
      }
    }

    return true;
  }




  function handleQueueMarkDefer( elem, type, src ) {
    var deferDataKey = type + "defer",
      queueDataKey = type + "queue",
      markDataKey = type + "mark",
      defer = jQuery._data( elem, deferDataKey );
    if ( defer &&
      ( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
      ( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
      // Give room for hard-coded callbacks to fire first
      // and eventually mark/queue something else on the element
      setTimeout( function() {
        if ( !jQuery._data( elem, queueDataKey ) &&
          !jQuery._data( elem, markDataKey ) ) {
          jQuery.removeData( elem, deferDataKey, true );
          defer.fire();
        }
      }, 0 );
    }
  }

  jQuery.extend({

    _mark: function( elem, type ) {
      if ( elem ) {
        type = ( type || "fx" ) + "mark";
        jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
      }
    },

    _unmark: function( force, elem, type ) {
      if ( force !== true ) {
        type = elem;
        elem = force;
        force = false;
      }
      if ( elem ) {
        type = type || "fx";
        var key = type + "mark",
          count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
        if ( count ) {
          jQuery._data( elem, key, count );
        } else {
          jQuery.removeData( elem, key, true );
          handleQueueMarkDefer( elem, type, "mark" );
        }
      }
    },

    queue: function( elem, type, data ) {
      var q;
      if ( elem ) {
        type = ( type || "fx" ) + "queue";
        q = jQuery._data( elem, type );

        // Speed up dequeue by getting out quickly if this is just a lookup
        if ( data ) {
          if ( !q || jQuery.isArray(data) ) {
            q = jQuery._data( elem, type, jQuery.makeArray(data) );
          } else {
            q.push( data );
          }
        }
        return q || [];
      }
    },

    dequeue: function( elem, type ) {
      type = type || "fx";

      var queue = jQuery.queue( elem, type ),
        fn = queue.shift(),
        hooks = {};

      // If the fx queue is dequeued, always remove the progress sentinel
      if ( fn === "inprogress" ) {
        fn = queue.shift();
      }

      if ( fn ) {
        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if ( type === "fx" ) {
          queue.unshift( "inprogress" );
        }

        jQuery._data( elem, type + ".run", hooks );
        fn.call( elem, function() {
          jQuery.dequeue( elem, type );
        }, hooks );
      }

      if ( !queue.length ) {
        jQuery.removeData( elem, type + "queue " + type + ".run", true );
        handleQueueMarkDefer( elem, type, "queue" );
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
      return this.each(function() {
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
      time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
      type = type || "fx";

      return this.queue( type, function( next, hooks ) {
        var timeout = setTimeout( next, time );
        hooks.stop = function() {
          clearTimeout( timeout );
        };
      });
    },
    clearQueue: function( type ) {
      return this.queue( type || "fx", [] );
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, object ) {
      if ( typeof type !== "string" ) {
        object = type;
        type = undefined;
      }
      type = type || "fx";
      var defer = jQuery.Deferred(),
        elements = this,
        i = elements.length,
        count = 1,
        deferDataKey = type + "defer",
        queueDataKey = type + "queue",
        markDataKey = type + "mark",
        tmp;
      function resolve() {
        if ( !( --count ) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      }
      while( i-- ) {
        if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
          ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
            jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
            jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
          count++;
          tmp.add( resolve );
        }
      }
      resolve();
      return defer.promise();
    }
  });




  var rclass = /[\n\t\r]/g,
    rspace = /\s+/,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea)?$/i,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute,
    nodeHook, boolHook, fixSpecified;

  jQuery.fn.extend({
    attr: function( name, value ) {
      return jQuery.access( this, name, value, true, jQuery.attr );
    },

    removeAttr: function( name ) {
      return this.each(function() {
        jQuery.removeAttr( this, name );
      });
    },

    prop: function( name, value ) {
      return jQuery.access( this, name, value, true, jQuery.prop );
    },

    removeProp: function( name ) {
      name = jQuery.propFix[ name ] || name;
      return this.each(function() {
        // try/catch handles cases where IE balks (such as removing a property on window)
        try {
          this[ name ] = undefined;
          delete this[ name ];
        } catch( e ) {}
      });
    },

    addClass: function( value ) {
      var classNames, i, l, elem,
        setClass, c, cl;

      if ( jQuery.isFunction( value ) ) {
        return this.each(function( j ) {
          jQuery( this ).addClass( value.call(this, j, this.className) );
        });
      }

      if ( value && typeof value === "string" ) {
        classNames = value.split( rspace );

        for ( i = 0, l = this.length; i < l; i++ ) {
          elem = this[ i ];

          if ( elem.nodeType === 1 ) {
            if ( !elem.className && classNames.length === 1 ) {
              elem.className = value;

            } else {
              setClass = " " + elem.className + " ";

              for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                  setClass += classNames[ c ] + " ";
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
      var classNames, i, l, elem, className, c, cl;

      if ( jQuery.isFunction( value ) ) {
        return this.each(function( j ) {
          jQuery( this ).removeClass( value.call(this, j, this.className) );
        });
      }

      if ( (value && typeof value === "string") || value === undefined ) {
        classNames = ( value || "" ).split( rspace );

        for ( i = 0, l = this.length; i < l; i++ ) {
          elem = this[ i ];

          if ( elem.nodeType === 1 && elem.className ) {
            if ( value ) {
              className = (" " + elem.className + " ").replace( rclass, " " );
              for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                className = className.replace(" " + classNames[ c ] + " ", " ");
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
        return this.each(function( i ) {
          jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
        });
      }

      return this.each(function() {
        if ( type === "string" ) {
          // toggle individual class names
          var className,
            i = 0,
            self = jQuery( this ),
            state = stateVal,
            classNames = value.split( rspace );

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
      var className = " " + selector + " ",
        i = 0,
        l = this.length;
      for ( ; i < l; i++ ) {
        if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
          return true;
        }
      }

      return false;
    },

    val: function( value ) {
      var hooks, ret, isFunction,
        elem = this[0];

      if ( !arguments.length ) {
        if ( elem ) {
          hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

          if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
            return ret;
          }

          ret = elem.value;

          return typeof ret === "string" ?
            // handle most common string cases
            ret.replace(rreturn, "") :
            // handle cases where value is null/undef or number
            ret == null ? "" : ret;
        }

        return;
      }

      isFunction = jQuery.isFunction( value );

      return this.each(function( i ) {
        var self = jQuery(this), val;

        if ( this.nodeType !== 1 ) {
          return;
        }

        if ( isFunction ) {
          val = value.call( this, i, self.val() );
        } else {
          val = value;
        }

        // Treat null/undefined as ""; convert numbers to string
        if ( val == null ) {
          val = "";
        } else if ( typeof val === "number" ) {
          val += "";
        } else if ( jQuery.isArray( val ) ) {
          val = jQuery.map(val, function ( value ) {
            return value == null ? "" : value + "";
          });
        }

        hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

        // If set returns undefined, fall back to normal setting
        if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
          this.value = val;
        }
      });
    }
  });

  jQuery.extend({
    valHooks: {
      option: {
        get: function( elem ) {
          // attributes.value is undefined in Blackberry 4.7 but
          // uses .value. See #6932
          var val = elem.attributes.value;
          return !val || val.specified ? elem.value : elem.text;
        }
      },
      select: {
        get: function( elem ) {
          var value, i, max, option,
            index = elem.selectedIndex,
            values = [],
            options = elem.options,
            one = elem.type === "select-one";

          // Nothing was selected
          if ( index < 0 ) {
            return null;
          }

          // Loop through all the selected options
          i = one ? index : 0;
          max = one ? index + 1 : options.length;
          for ( ; i < max; i++ ) {
            option = options[ i ];

            // Don't return options that are disabled or in a disabled optgroup
            if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

              // Get the specific value for the option
              value = jQuery( option ).val();

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
        },

        set: function( elem, value ) {
          var values = jQuery.makeArray( value );

          jQuery(elem).find("option").each(function() {
            this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
          });

          if ( !values.length ) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    },

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
      var ret, hooks, notxml,
        nType = elem.nodeType;

      // don't get/set attributes on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
        return;
      }

      if ( pass && name in jQuery.attrFn ) {
        return jQuery( elem )[ name ]( value );
      }

      // Fallback to prop when attributes are not supported
      if ( typeof elem.getAttribute === "undefined" ) {
        return jQuery.prop( elem, name, value );
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

      // All attributes are lowercase
      // Grab necessary hook if one is defined
      if ( notxml ) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
      }

      if ( value !== undefined ) {

        if ( value === null ) {
          jQuery.removeAttr( elem, name );
          return;

        } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
          return ret;

        } else {
          elem.setAttribute( name, "" + value );
          return value;
        }

      } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {

        ret = elem.getAttribute( name );

        // Non-existent attributes return null, we normalize to undefined
        return ret === null ?
          undefined :
          ret;
      }
    },

    removeAttr: function( elem, value ) {
      var propName, attrNames, name, l,
        i = 0;

      if ( value && elem.nodeType === 1 ) {
        attrNames = value.toLowerCase().split( rspace );
        l = attrNames.length;

        for ( ; i < l; i++ ) {
          name = attrNames[ i ];

          if ( name ) {
            propName = jQuery.propFix[ name ] || name;

            // See #9699 for explanation of this approach (setting first, then removal)
            jQuery.attr( elem, name, "" );
            elem.removeAttribute( getSetAttribute ? name : propName );

            // Set corresponding property to false for boolean attributes
            if ( rboolean.test( name ) && propName in elem ) {
              elem[ propName ] = false;
            }
          }
        }
      }
    },

    attrHooks: {
      type: {
        set: function( elem, value ) {
          // We can't allow the type property to be changed (since it causes problems in IE)
          if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
            jQuery.error( "type property can't be changed" );
          } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
            // Setting the type on a radio button after the value resets the value in IE6-9
            // Reset value to it's default in case type is set after value
            // This is for element creation
            var val = elem.value;
            elem.setAttribute( "type", value );
            if ( val ) {
              elem.value = val;
            }
            return value;
          }
        }
      },
      // Use the value property for back compat
      // Use the nodeHook for button elements in IE6/7 (#1954)
      value: {
        get: function( elem, name ) {
          if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
            return nodeHook.get( elem, name );
          }
          return name in elem ?
            elem.value :
            null;
        },
        set: function( elem, value, name ) {
          if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
            return nodeHook.set( elem, value, name );
          }
          // Does not return so that setAttribute is also used
          elem.value = value;
        }
      }
    },

    propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      "for": "htmlFor",
      "class": "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },

    prop: function( elem, name, value ) {
      var ret, hooks, notxml,
        nType = elem.nodeType;

      // don't get/set properties on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
        return;
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

      if ( notxml ) {
        // Fix name and attach hooks
        name = jQuery.propFix[ name ] || name;
        hooks = jQuery.propHooks[ name ];
      }

      if ( value !== undefined ) {
        if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
          return ret;

        } else {
          return ( elem[ name ] = value );
        }

      } else {
        if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
          return ret;

        } else {
          return elem[ name ];
        }
      }
    },

    propHooks: {
      tabIndex: {
        get: function( elem ) {
          // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
          // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
          var attributeNode = elem.getAttributeNode("tabindex");

          return attributeNode && attributeNode.specified ?
            parseInt( attributeNode.value, 10 ) :
            rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
              0 :
              undefined;
        }
      }
    }
  });

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
  jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
  boolHook = {
    get: function( elem, name ) {
      // Align boolean attributes with corresponding properties
      // Fall back to attribute presence where some booleans are not supported
      var attrNode,
        property = jQuery.prop( elem, name );
      return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
        name.toLowerCase() :
        undefined;
    },
    set: function( elem, value, name ) {
      var propName;
      if ( value === false ) {
        // Remove boolean attributes when set to false
        jQuery.removeAttr( elem, name );
      } else {
        // value is true since we know at this point it's type boolean and not false
        // Set boolean attributes to the same name and set the DOM property
        propName = jQuery.propFix[ name ] || name;
        if ( propName in elem ) {
          // Only set the IDL specifically if it already exists on the element
          elem[ propName ] = true;
        }

        elem.setAttribute( name, name.toLowerCase() );
      }
      return name;
    }
  };

// IE6/7 do not support getting/setting some attributes with get/setAttribute
  if ( !getSetAttribute ) {

    fixSpecified = {
      name: true,
      id: true
    };

    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
      get: function( elem, name ) {
        var ret;
        ret = elem.getAttributeNode( name );
        return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
          ret.nodeValue :
          undefined;
      },
      set: function( elem, value, name ) {
        // Set the existing or create a new attribute node
        var ret = elem.getAttributeNode( name );
        if ( !ret ) {
          ret = document.createAttribute( name );
          elem.setAttributeNode( ret );
        }
        return ( ret.nodeValue = value + "" );
      }
    };

    // Apply the nodeHook to tabindex
    jQuery.attrHooks.tabindex.set = nodeHook.set;

    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([ "width", "height" ], function( i, name ) {
      jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
        set: function( elem, value ) {
          if ( value === "" ) {
            elem.setAttribute( name, "auto" );
            return value;
          }
        }
      });
    });

    // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
      get: nodeHook.get,
      set: function( elem, value, name ) {
        if ( value === "" ) {
          value = "false";
        }
        nodeHook.set( elem, value, name );
      }
    };
  }


// Some attributes require a special call on IE
  if ( !jQuery.support.hrefNormalized ) {
    jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
      jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
        get: function( elem ) {
          var ret = elem.getAttribute( name, 2 );
          return ret === null ? undefined : ret;
        }
      });
    });
  }

  if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
      get: function( elem ) {
        // Return undefined in the case of empty string
        // Normalize to lowercase since IE uppercases css property names
        return elem.style.cssText.toLowerCase() || undefined;
      },
      set: function( elem, value ) {
        return ( elem.style.cssText = "" + value );
      }
    };
  }

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
  if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
      get: function( elem ) {
        var parent = elem.parentNode;

        if ( parent ) {
          parent.selectedIndex;

          // Make sure that it also works with optgroups, see #5701
          if ( parent.parentNode ) {
            parent.parentNode.selectedIndex;
          }
        }
        return null;
      }
    });
  }

// IE6/7 call enctype encoding
  if ( !jQuery.support.enctype ) {
    jQuery.propFix.enctype = "encoding";
  }

// Radios and checkboxes getter/setter
  if ( !jQuery.support.checkOn ) {
    jQuery.each([ "radio", "checkbox" ], function() {
      jQuery.valHooks[ this ] = {
        get: function( elem ) {
          // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
          return elem.getAttribute("value") === null ? "on" : elem.value;
        }
      };
    });
  }
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
      set: function( elem, value ) {
        if ( jQuery.isArray( value ) ) {
          return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
        }
      }
    });
  });




  var rformElems = /^(?:textarea|input|select)$/i,
    rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
    rhoverHack = /\bhover(\.\S+)?\b/,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    quickParse = function( selector ) {
      var quick = rquickIs.exec( selector );
      if ( quick ) {
        //   0  1    2   3
        // [ _, tag, id, class ]
        quick[1] = ( quick[1] || "" ).toLowerCase();
        quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
      }
      return quick;
    },
    quickIs = function( elem, m ) {
      var attrs = elem.attributes || {};
      return (
        (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
          (!m[2] || (attrs.id || {}).value === m[2]) &&
          (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
        );
    },
    hoverHack = function( events ) {
      return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
    };

  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */
  jQuery.event = {

    add: function( elem, types, handler, data, selector ) {

      var elemData, eventHandle, events,
        t, tns, type, namespaces, handleObj,
        handleObjIn, quick, handlers, special;

      // Don't attach events to noData or text/comment nodes (allow plain objects tho)
      if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
        return;
      }

      // Caller can pass in an object of custom data in lieu of the handler
      if ( handler.handler ) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
      }

      // Make sure that the handler has a unique ID, used to find/remove it later
      if ( !handler.guid ) {
        handler.guid = jQuery.guid++;
      }

      // Init the element's event structure and main handler, if this is the first
      events = elemData.events;
      if ( !events ) {
        elemData.events = events = {};
      }
      eventHandle = elemData.handle;
      if ( !eventHandle ) {
        elemData.handle = eventHandle = function( e ) {
          // Discard the second event of a jQuery.event.trigger() and
          // when an event is called after a page has unloaded
          return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
            jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
            undefined;
        };
        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
        eventHandle.elem = elem;
      }

      // Handle multiple events separated by a space
      // jQuery(...).bind("mouseover mouseout", fn);
      types = jQuery.trim( hoverHack(types) ).split( " " );
      for ( t = 0; t < types.length; t++ ) {

        tns = rtypenamespace.exec( types[t] ) || [];
        type = tns[1];
        namespaces = ( tns[2] || "" ).split( "." ).sort();

        // If event changes its type, use the special event handlers for the changed type
        special = jQuery.event.special[ type ] || {};

        // If selector defined, determine special event api type, otherwise given type
        type = ( selector ? special.delegateType : special.bindType ) || type;

        // Update special based on newly reset type
        special = jQuery.event.special[ type ] || {};

        // handleObj is passed to all event handlers
        handleObj = jQuery.extend({
          type: type,
          origType: tns[1],
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          quick: quickParse( selector ),
          namespace: namespaces.join(".")
        }, handleObjIn );

        // Init the event handler queue if we're the first
        handlers = events[ type ];
        if ( !handlers ) {
          handlers = events[ type ] = [];
          handlers.delegateCount = 0;

          // Only use addEventListener/attachEvent if the special events handler returns false
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

        // Add to the element's handler list, delegates in front
        if ( selector ) {
          handlers.splice( handlers.delegateCount++, 0, handleObj );
        } else {
          handlers.push( handleObj );
        }

        // Keep track of which events have ever been used, for event optimization
        jQuery.event.global[ type ] = true;
      }

      // Nullify elem to prevent memory leaks in IE
      elem = null;
    },

    global: {},

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, selector, mappedTypes ) {

      var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
        t, tns, type, origType, namespaces, origCount,
        j, events, special, handle, eventType, handleObj;

      if ( !elemData || !(events = elemData.events) ) {
        return;
      }

      // Once for each type.namespace in types; type may be omitted
      types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
      for ( t = 0; t < types.length; t++ ) {
        tns = rtypenamespace.exec( types[t] ) || [];
        type = origType = tns[1];
        namespaces = tns[2];

        // Unbind all events (on this namespace, if provided) for the element
        if ( !type ) {
          for ( type in events ) {
            jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
          }
          continue;
        }

        special = jQuery.event.special[ type ] || {};
        type = ( selector? special.delegateType : special.bindType ) || type;
        eventType = events[ type ] || [];
        origCount = eventType.length;
        namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

        // Remove matching events
        for ( j = 0; j < eventType.length; j++ ) {
          handleObj = eventType[ j ];

          if ( ( mappedTypes || origType === handleObj.origType ) &&
            ( !handler || handler.guid === handleObj.guid ) &&
            ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
            ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
            eventType.splice( j--, 1 );

            if ( handleObj.selector ) {
              eventType.delegateCount--;
            }
            if ( special.remove ) {
              special.remove.call( elem, handleObj );
            }
          }
        }

        // Remove generic event handler if we removed something and no more handlers exist
        // (avoids potential for endless recursion during removal of special event handlers)
        if ( eventType.length === 0 && origCount !== eventType.length ) {
          if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
            jQuery.removeEvent( elem, type, elemData.handle );
          }

          delete events[ type ];
        }
      }

      // Remove the expando if it's no longer used
      if ( jQuery.isEmptyObject( events ) ) {
        handle = elemData.handle;
        if ( handle ) {
          handle.elem = null;
        }

        // removeData also checks for emptiness and clears the expando if empty
        // so use it instead of delete
        jQuery.removeData( elem, [ "events", "handle" ], true );
      }
    },

    // Events that are safe to short-circuit if no handlers are attached.
    // Native DOM events should not be added, they may have inline handlers.
    customEvent: {
      "getData": true,
      "setData": true,
      "changeData": true
    },

    trigger: function( event, data, elem, onlyHandlers ) {
      // Don't do events on text and comment nodes
      if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
        return;
      }

      // Event object or event type
      var type = event.type || event,
        namespaces = [],
        cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

      // focus/blur morphs to focusin/out; ensure we're not firing them right now
      if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
        return;
      }

      if ( type.indexOf( "!" ) >= 0 ) {
        // Exclusive events trigger only for the exact event (no namespaces)
        type = type.slice(0, -1);
        exclusive = true;
      }

      if ( type.indexOf( "." ) >= 0 ) {
        // Namespaced trigger; create a regexp to match event type in handle()
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }

      if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
        // No jQuery handlers for this event type, and it can't have inline handlers
        return;
      }

      // Caller can pass in an Event, Object, or just an event type string
      event = typeof event === "object" ?
        // jQuery.Event object
        event[ jQuery.expando ] ? event :
          // Object literal
          new jQuery.Event( type, event ) :
        // Just the event type (string)
        new jQuery.Event( type );

      event.type = type;
      event.isTrigger = true;
      event.exclusive = exclusive;
      event.namespace = namespaces.join( "." );
      event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
      ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

      // Handle a global trigger
      if ( !elem ) {

        // TODO: Stop taunting the data cache; remove global events and always attach to document
        cache = jQuery.cache;
        for ( i in cache ) {
          if ( cache[ i ].events && cache[ i ].events[ type ] ) {
            jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
          }
        }
        return;
      }

      // Clean up the event in case it is being reused
      event.result = undefined;
      if ( !event.target ) {
        event.target = elem;
      }

      // Clone any incoming data and prepend the event, creating the handler arg list
      data = data != null ? jQuery.makeArray( data ) : [];
      data.unshift( event );

      // Allow special events to draw outside the lines
      special = jQuery.event.special[ type ] || {};
      if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
        return;
      }

      // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      eventPath = [[ elem, special.bindType || type ]];
      if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

        bubbleType = special.delegateType || type;
        cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
        old = null;
        for ( ; cur; cur = cur.parentNode ) {
          eventPath.push([ cur, bubbleType ]);
          old = cur;
        }

        // Only add window if we got to document (e.g., not plain obj or detached DOM)
        if ( old && old === elem.ownerDocument ) {
          eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
        }
      }

      // Fire handlers on the event path
      for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

        cur = eventPath[i][0];
        event.type = eventPath[i][1];

        handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
        if ( handle ) {
          handle.apply( cur, data );
        }
        // Note that this is a bare JS function and not a jQuery handler
        handle = ontype && cur[ ontype ];
        if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
          event.preventDefault();
        }
      }
      event.type = type;

      // If nobody prevented the default action, do it now
      if ( !onlyHandlers && !event.isDefaultPrevented() ) {

        if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
          !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

          // Call a native DOM method on the target with the same name name as the event.
          // Can't use an .isFunction() check here because IE6/7 fails that test.
          // Don't do default actions on window, that's where global variables be (#6170)
          // IE<9 dies on focus/blur to hidden element (#1486)
          if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

            // Don't re-trigger an onFOO event when we call its FOO() method
            old = elem[ ontype ];

            if ( old ) {
              elem[ ontype ] = null;
            }

            // Prevent re-triggering of the same event, since we already bubbled it above
            jQuery.event.triggered = type;
            elem[ type ]();
            jQuery.event.triggered = undefined;

            if ( old ) {
              elem[ ontype ] = old;
            }
          }
        }
      }

      return event.result;
    },

    dispatch: function( event ) {

      // Make a writable jQuery.Event from the native event object
      event = jQuery.event.fix( event || window.event );

      var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
        delegateCount = handlers.delegateCount,
        args = [].slice.call( arguments, 0 ),
        run_all = !event.exclusive && !event.namespace,
        handlerQueue = [],
        i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

      // Use the fix-ed jQuery.Event rather than the (read-only) native event
      args[0] = event;
      event.delegateTarget = this;

      // Determine handlers that should run if there are delegated events
      // Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
      if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

        // Pregenerate a single jQuery object for reuse with .is()
        jqcur = jQuery(this);
        jqcur.context = this.ownerDocument || this;

        for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
          selMatch = {};
          matches = [];
          jqcur[0] = cur;
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];
            sel = handleObj.selector;

            if ( selMatch[ sel ] === undefined ) {
              selMatch[ sel ] = (
                handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
                );
            }
            if ( selMatch[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, matches: matches });
          }
        }
      }

      // Add the remaining (directly-bound) handlers
      if ( handlers.length > delegateCount ) {
        handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
      }

      // Run delegates first; they may want to stop propagation beneath us
      for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
        matched = handlerQueue[ i ];
        event.currentTarget = matched.elem;

        for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
          handleObj = matched.matches[ j ];

          // Triggered event must either 1) be non-exclusive and have no namespace, or
          // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
          if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

            event.data = handleObj.data;
            event.handleObj = handleObj;

            ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

            if ( ret !== undefined ) {
              event.result = ret;
              if ( ret === false ) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }

      return event.result;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
    props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

    fixHooks: {},

    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function( event, original ) {

        // Add which for key events
        if ( event.which == null ) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }

        return event;
      }
    },

    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function( event, original ) {
        var eventDoc, doc, body,
          button = original.button,
          fromElement = original.fromElement;

        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && original.clientX != null ) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
          event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Add relatedTarget, if necessary
        if ( !event.relatedTarget && fromElement ) {
          event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
        }

        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if ( !event.which && button !== undefined ) {
          event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
        }

        return event;
      }
    },

    fix: function( event ) {
      if ( event[ jQuery.expando ] ) {
        return event;
      }

      // Create a writable copy of the event object and normalize some properties
      var i, prop,
        originalEvent = event,
        fixHook = jQuery.event.fixHooks[ event.type ] || {},
        copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

      event = jQuery.Event( originalEvent );

      for ( i = copy.length; i; ) {
        prop = copy[ --i ];
        event[ prop ] = originalEvent[ prop ];
      }

      // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
      if ( !event.target ) {
        event.target = originalEvent.srcElement || document;
      }

      // Target should not be a text node (#504, Safari)
      if ( event.target.nodeType === 3 ) {
        event.target = event.target.parentNode;
      }

      // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
      if ( event.metaKey === undefined ) {
        event.metaKey = event.ctrlKey;
      }

      return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
    },

    special: {
      ready: {
        // Make sure the ready event is setup
        setup: jQuery.bindReady
      },

      load: {
        // Prevent triggered image.load events from bubbling to window.load
        noBubble: true
      },

      focus: {
        delegateType: "focusin"
      },
      blur: {
        delegateType: "focusout"
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
    },

    simulate: function( type, elem, event, bubble ) {
      // Piggyback on a donor event to simulate a different one.
      // Fake originalEvent to avoid donor's stopPropagation, but if the
      // simulated event prevents default then we do the same on the donor.
      var e = jQuery.extend(
        new jQuery.Event(),
        event,
        { type: type,
          isSimulated: true,
          originalEvent: {}
        }
      );
      if ( bubble ) {
        jQuery.event.trigger( e, null, elem );
      } else {
        jQuery.event.dispatch.call( elem, e );
      }
      if ( e.isDefaultPrevented() ) {
        event.preventDefault();
      }
    }
  };

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
  jQuery.event.handle = jQuery.event.dispatch;

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

  jQuery.Event = function( src, props ) {
    // Allow instantiation without the 'new' keyword
    if ( !(this instanceof jQuery.Event) ) {
      return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
      this.originalEvent = src;
      this.type = src.type;

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
        src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

      // Event type
    } else {
      this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
      jQuery.extend( this, props );
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

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

// Create mouseenter/leave events using mouseover/out and event-time checks
  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
      delegateType: fix,
      bindType: fix,

      handle: function( event ) {
        var target = this,
          related = event.relatedTarget,
          handleObj = event.handleObj,
          selector = handleObj.selector,
          ret;

        // For mousenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window
        if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply( this, arguments );
          event.type = fix;
        }
        return ret;
      }
    };
  });

// IE submit delegation
  if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
      setup: function() {
        // Only need this for delegated form submit events
        if ( jQuery.nodeName( this, "form" ) ) {
          return false;
        }

        // Lazy-add a submit handler when a descendant form may potentially be submitted
        jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
          // Node name check avoids a VML-related crash in IE (#9807)
          var elem = e.target,
            form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
          if ( form && !form._submit_attached ) {
            jQuery.event.add( form, "submit._submit", function( event ) {
              // If form was submitted by the user, bubble the event up the tree
              if ( this.parentNode && !event.isTrigger ) {
                jQuery.event.simulate( "submit", this.parentNode, event, true );
              }
            });
            form._submit_attached = true;
          }
        });
        // return undefined since we don't need an event listener
      },

      teardown: function() {
        // Only need this for delegated form submit events
        if ( jQuery.nodeName( this, "form" ) ) {
          return false;
        }

        // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
        jQuery.event.remove( this, "._submit" );
      }
    };
  }

// IE change delegation and checkbox/radio fix
  if ( !jQuery.support.changeBubbles ) {

    jQuery.event.special.change = {

      setup: function() {

        if ( rformElems.test( this.nodeName ) ) {
          // IE doesn't fire change on a check/radio until blur; trigger it on click
          // after a propertychange. Eat the blur-change in special.change.handle.
          // This still fires onchange a second time for check/radio after blur.
          if ( this.type === "checkbox" || this.type === "radio" ) {
            jQuery.event.add( this, "propertychange._change", function( event ) {
              if ( event.originalEvent.propertyName === "checked" ) {
                this._just_changed = true;
              }
            });
            jQuery.event.add( this, "click._change", function( event ) {
              if ( this._just_changed && !event.isTrigger ) {
                this._just_changed = false;
                jQuery.event.simulate( "change", this, event, true );
              }
            });
          }
          return false;
        }
        // Delegated event; lazy-add a change handler on descendant inputs
        jQuery.event.add( this, "beforeactivate._change", function( e ) {
          var elem = e.target;

          if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
            jQuery.event.add( elem, "change._change", function( event ) {
              if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                jQuery.event.simulate( "change", this.parentNode, event, true );
              }
            });
            elem._change_attached = true;
          }
        });
      },

      handle: function( event ) {
        var elem = event.target;

        // Swallow native change events from checkbox/radio, we already triggered them above
        if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
          return event.handleObj.handler.apply( this, arguments );
        }
      },

      teardown: function() {
        jQuery.event.remove( this, "._change" );

        return rformElems.test( this.nodeName );
      }
    };
  }

// Create "bubbling" focus and blur events
  if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

      // Attach a single capturing handler while someone wants focusin/focusout
      var attaches = 0,
        handler = function( event ) {
          jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
        };

      jQuery.event.special[ fix ] = {
        setup: function() {
          if ( attaches++ === 0 ) {
            document.addEventListener( orig, handler, true );
          }
        },
        teardown: function() {
          if ( --attaches === 0 ) {
            document.removeEventListener( orig, handler, true );
          }
        }
      };
    });
  }

  jQuery.fn.extend({

    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
      var origFn, type;

      // Types can be a map of types/handlers
      if ( typeof types === "object" ) {
        // ( types-Object, selector, data )
        if ( typeof selector !== "string" ) {
          // ( types-Object, data )
          data = selector;
          selector = undefined;
        }
        for ( type in types ) {
          this.on( type, selector, data, types[ type ], one );
        }
        return this;
      }

      if ( data == null && fn == null ) {
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
      } else if ( fn == null ) {
        if ( typeof selector === "string" ) {
          // ( types, selector, fn )
          fn = data;
          data = undefined;
        } else {
          // ( types, data, fn )
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if ( fn === false ) {
        fn = returnFalse;
      } else if ( !fn ) {
        return this;
      }

      if ( one === 1 ) {
        origFn = fn;
        fn = function( event ) {
          // Can use an empty set, since event contains the info
          jQuery().off( event );
          return origFn.apply( this, arguments );
        };
        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
      }
      return this.each( function() {
        jQuery.event.add( this, types, fn, data, selector );
      });
    },
    one: function( types, selector, data, fn ) {
      return this.on.call( this, types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
      if ( types && types.preventDefault && types.handleObj ) {
        // ( event )  dispatched jQuery.Event
        var handleObj = types.handleObj;
        jQuery( types.delegateTarget ).off(
          handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if ( typeof types === "object" ) {
        // ( types-object [, selector] )
        for ( var type in types ) {
          this.off( type, selector, types[ type ] );
        }
        return this;
      }
      if ( selector === false || typeof selector === "function" ) {
        // ( types [, fn] )
        fn = selector;
        selector = undefined;
      }
      if ( fn === false ) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove( this, types, fn, selector );
      });
    },

    bind: function( types, data, fn ) {
      return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
      return this.off( types, null, fn );
    },

    live: function( types, data, fn ) {
      jQuery( this.context ).on( types, this.selector, data, fn );
      return this;
    },
    die: function( types, fn ) {
      jQuery( this.context ).off( types, this.selector || "**", fn );
      return this;
    },

    delegate: function( selector, types, data, fn ) {
      return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
    },

    trigger: function( type, data ) {
      return this.each(function() {
        jQuery.event.trigger( type, data, this );
      });
    },
    triggerHandler: function( type, data ) {
      if ( this[0] ) {
        return jQuery.event.trigger( type, data, this[0], true );
      }
    },

    toggle: function( fn ) {
      // Save reference to arguments for access in closure
      var args = arguments,
        guid = fn.guid || jQuery.guid++,
        i = 0,
        toggler = function( event ) {
          // Figure out which function to execute
          var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
          jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

          // Make sure that clicks stop
          event.preventDefault();

          // and execute the function
          return args[ lastToggle ].apply( this, arguments ) || false;
        };

      // link all the functions, so any of them can unbind this click handler
      toggler.guid = guid;
      while ( i < args.length ) {
        args[ i++ ].guid = guid;
      }

      return this.click( toggler );
    },

    hover: function( fnOver, fnOut ) {
      return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
  });

  jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
      if ( fn == null ) {
        fn = data;
        data = null;
      }

      return arguments.length > 0 ?
        this.on( name, null, data, fn ) :
        this.trigger( name );
    };

    if ( jQuery.attrFn ) {
      jQuery.attrFn[ name ] = true;
    }

    if ( rkeyEvent.test( name ) ) {
      jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
    }

    if ( rmouseEvent.test( name ) ) {
      jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
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
      expando = "sizcache" + (Math.random() + '').replace('.', ''),
      done = 0,
      toString = Object.prototype.toString,
      hasDuplicate = false,
      baseHasDuplicate = true,
      rBackslash = /\\/g,
      rReturn = /\r\n/g,
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
          set = posProcess( parts[0] + parts[1], context, seed );

        } else {
          set = Expr.relative[ parts[0] ] ?
            [ context ] :
            Sizzle( parts.shift(), context );

          while ( parts.length ) {
            selector = parts.shift();

            if ( Expr.relative[ selector ] ) {
              selector += parts.shift();
            }

            set = posProcess( selector, set, seed );
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
      var set, i, len, match, type, left;

      if ( !expr ) {
        return [];
      }

      for ( i = 0, len = Expr.order.length; i < len; i++ ) {
        type = Expr.order[i];

        if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
          left = match[1];
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
        type, found, item, filter, left,
        i, pass,
        old = expr,
        result = [],
        curLoop = set,
        isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

      while ( expr && set.length ) {
        for ( type in Expr.filter ) {
          if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
            filter = Expr.filter[ type ];
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
              for ( i = 0; (item = curLoop[i]) != null; i++ ) {
                if ( item ) {
                  found = filter( item, match, i, curLoop );
                  pass = not ^ found;

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
      throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Utility function for retreiving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    var getText = Sizzle.getText = function( elem ) {
      var i, node,
        nodeType = elem.nodeType,
        ret = "";

      if ( nodeType ) {
        if ( nodeType === 1 || nodeType === 9 ) {
          // Use textContent || innerText for elements
          if ( typeof elem.textContent === 'string' ) {
            return elem.textContent;
          } else if ( typeof elem.innerText === 'string' ) {
            // Replace IE's carriage returns
            return elem.innerText.replace( rReturn, '' );
          } else {
            // Traverse it's children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText( elem );
            }
          }
        } else if ( nodeType === 3 || nodeType === 4 ) {
          return elem.nodeValue;
        }
      } else {

        // If no nodeType, this is expected to be an array
        for ( i = 0; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          if ( node.nodeType !== 8 ) {
            ret += getText( node );
          }
        }
      }
      return ret;
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
          var attr = elem.getAttribute( "type" ), type = elem.type;
          // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
          // use getAttribute instead to test this case
          return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
        },

        radio: function( elem ) {
          return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
        },

        checkbox: function( elem ) {
          return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
        },

        file: function( elem ) {
          return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
        },

        password: function( elem ) {
          return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
        },

        submit: function( elem ) {
          var name = elem.nodeName.toLowerCase();
          return (name === "input" || name === "button") && "submit" === elem.type;
        },

        image: function( elem ) {
          return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
        },

        reset: function( elem ) {
          var name = elem.nodeName.toLowerCase();
          return (name === "input" || name === "button") && "reset" === elem.type;
        },

        button: function( elem ) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && "button" === elem.type || name === "button";
        },

        input: function( elem ) {
          return (/input|select|textarea|button/i).test( elem.nodeName );
        },

        focus: function( elem ) {
          return elem === elem.ownerDocument.activeElement;
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
            return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

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
          var first, last,
            doneName, parent, cache,
            count, diff,
            type = match[1],
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
              first = match[2];
              last = match[3];

              if ( first === 1 && last === 0 ) {
                return true;
              }

              doneName = match[0];
              parent = elem.parentNode;

              if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
                count = 0;

                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                  if ( node.nodeType === 1 ) {
                    node.nodeIndex = ++count;
                  }
                }

                parent[ expando ] = doneName;
              }

              diff = elem.nodeIndex - last;

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
          return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
        },

        CLASS: function( elem, match ) {
          return (" " + (elem.className || elem.getAttribute("class")) + " ")
            .indexOf( match ) > -1;
        },

        ATTR: function( elem, match ) {
          var name = match[1],
            result = Sizzle.attr ?
              Sizzle.attr( elem, name ) :
              Expr.attrHandle[ name ] ?
                Expr.attrHandle[ name ]( elem ) :
                elem[ name ] != null ?
                  elem[ name ] :
                  elem.getAttribute( name ),
            value = result + "",
            type = match[2],
            check = match[4];

          return result == null ?
            type === "!=" :
            !type && Sizzle.attr ?
              result != null :
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
        // The nodes are identical, we can exit early
        if ( a === b ) {
          hasDuplicate = true;
          return 0;

          // Fallback to using sourceIndex (in IE) if it's available on both nodes
        } else if ( a.sourceIndex && b.sourceIndex ) {
          return a.sourceIndex - b.sourceIndex;
        }

        var al, bl,
          ap = [],
          bp = [],
          aup = a.parentNode,
          bup = b.parentNode,
          cur = aup;

        // If the nodes are siblings (or identical) we can do a quick check
        if ( aup === bup ) {
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
        matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

      if ( matches ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9 fails this)
        var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
          pseudoWorks = false;

        try {
          // This should fail with an exception
          // Gecko does not error, returns false instead
          matches.call( document.documentElement, "[test!='']:sizzle" );

        } catch( pseudoError ) {
          pseudoWorks = true;
        }

        Sizzle.matchesSelector = function( node, expr ) {
          // Make sure that attribute selectors are quoted
          expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

          if ( !Sizzle.isXML( node ) ) {
            try {
              if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                var ret = matches.call( node, expr );

                // IE 9's matchesSelector returns false on disconnected nodes
                if ( ret || !disconnectedMatch ||
                  // As well, disconnected nodes are said to be in a document
                  // fragment in IE 9, so check for that
                  node.document && node.document.nodeType !== 11 ) {
                  return ret;
                }
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
            if ( elem[ expando ] === doneName ) {
              match = checkSet[elem.sizset];
              break;
            }

            if ( elem.nodeType === 1 && !isXML ){
              elem[ expando ] = doneName;
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
            if ( elem[ expando ] === doneName ) {
              match = checkSet[elem.sizset];
              break;
            }

            if ( elem.nodeType === 1 ) {
              if ( !isXML ) {
                elem[ expando ] = doneName;
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

    var posProcess = function( selector, context, seed ) {
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
        Sizzle( selector, root[i], tmpSet, seed );
      }

      return Sizzle.filter( later, tmpSet );
    };

// EXPOSE
// Override sizzle attribute retrieval
    Sizzle.attr = jQuery.attr;
    Sizzle.selectors.attrMap = {};
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
      var self = this,
        i, l;

      if ( typeof selector !== "string" ) {
        return jQuery( selector ).filter(function() {
          for ( i = 0, l = self.length; i < l; i++ ) {
            if ( jQuery.contains( self[ i ], this ) ) {
              return true;
            }
          }
        });
      }

      var ret = this.pushStack( "", "find", selector ),
        length, n, r;

      for ( i = 0, l = this.length; i < l; i++ ) {
        length = ret.length;
        jQuery.find( selector, this[i], ret );

        if ( i > 0 ) {
          // Make sure that the results are unique
          for ( n = length; n < ret.length; n++ ) {
            for ( r = 0; r < length; r++ ) {
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
      return !!selector && (
        typeof selector === "string" ?
          // If this is a positional selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          POS.test( selector ) ?
            jQuery( selector, this.context ).index( this[0] ) >= 0 :
            jQuery.filter( selector, this ).length > 0 :
          this.filter( selector ).length > 0 );
    },

    closest: function( selectors, context ) {
      var ret = [], i, l, cur = this[0];

      // Array (deprecated as of jQuery 1.7)
      if ( jQuery.isArray( selectors ) ) {
        var level = 1;

        while ( cur && cur.ownerDocument && cur !== context ) {
          for ( i = 0; i < selectors.length; i++ ) {

            if ( jQuery( cur ).is( selectors[ i ] ) ) {
              ret.push({ selector: selectors[ i ], elem: cur, level: level });
            }
          }

          cur = cur.parentNode;
          level++;
        }

        return ret;
      }

      // String
      var pos = POS.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

      for ( i = 0, l = this.length; i < l; i++ ) {
        cur = this[i];

        while ( cur ) {
          if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
            ret.push( cur );
            break;

          } else {
            cur = cur.parentNode;
            if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
              break;
            }
          }
        }
      }

      ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

      return this.pushStack( ret, "closest", selectors );
    },

    // Determine the position of an element within
    // the matched set of elements
    index: function( elem ) {

      // No argument, return index in parent
      if ( !elem ) {
        return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
      }

      // index in selector
      if ( typeof elem === "string" ) {
        return jQuery.inArray( this[0], jQuery( elem ) );
      }

      // Locate the position of the desired element
      return jQuery.inArray(
        // If it receives a jQuery object, the first element is used
        elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
      var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
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
      var ret = jQuery.map( this, fn, until );

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

      return this.pushStack( ret, name, slice.call( arguments ).join(",") );
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

    // Can't pass null or undefined to indexOf in Firefox 4
    // Set to 0 to skip string check
    qualifier = qualifier || 0;

    if ( jQuery.isFunction( qualifier ) ) {
      return jQuery.grep(elements, function( elem, i ) {
        var retVal = !!qualifier.call( elem, i, elem );
        return retVal === keep;
      });

    } else if ( qualifier.nodeType ) {
      return jQuery.grep(elements, function( elem, i ) {
        return ( elem === qualifier ) === keep;
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
      return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
    });
  }




  function createSafeFragment( document ) {
    var list = nodeNames.split( "|" ),
      safeFrag = document.createDocumentFragment();

    if ( safeFrag.createElement ) {
      while ( list.length ) {
        safeFrag.createElement(
          list.pop()
        );
      }
    }
    return safeFrag;
  }

  var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style)/i,
    rnocache = /<(?:script|object|embed|option|style)/i,
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
    wrapMap = {
      option: [ 1, "<select multiple='multiple'>", "</select>" ],
      legend: [ 1, "<fieldset>", "</fieldset>" ],
      thead: [ 1, "<table>", "</table>" ],
      tr: [ 2, "<table><tbody>", "</tbody></table>" ],
      td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      area: [ 1, "<map>", "</map>" ],
      _default: [ 0, "", "" ]
    },
    safeFragment = createSafeFragment( document );

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
        }).append( this );
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
      var isFunction = jQuery.isFunction( html );

      return this.each(function(i) {
        jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
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
        var set = jQuery.clean( arguments );
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
        set.push.apply( set, jQuery.clean(arguments) );
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
      } else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
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
        return this.length ?
          this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
          this;
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
              results.cacheable || ( l > 1 && i < lastIndex ) ?
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

    var type, i, l,
      oldData = jQuery._data( src ),
      curData = jQuery._data( dest, oldData ),
      events = oldData.events;

    if ( events ) {
      delete curData.handle;
      curData.events = {};

      for ( type in events ) {
        for ( i = 0, l = events[ type ].length; i < l; i++ ) {
          jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
        }
      }
    }

    // make the cloned public data object a copy from the original
    if ( curData.data ) {
      curData.data = jQuery.extend( {}, curData.data );
    }
  }

  function cloneFixAttributes( src, dest ) {
    var nodeName;

    // We do not need to do anything for non-Elements
    if ( dest.nodeType !== 1 ) {
      return;
    }

    // clearAttributes removes the attributes, which we don't want,
    // but also removes the attachEvent events, which we *do* want
    if ( dest.clearAttributes ) {
      dest.clearAttributes();
    }

    // mergeAttributes, in contrast, only merges back on the
    // original attributes, not the events
    if ( dest.mergeAttributes ) {
      dest.mergeAttributes( src );
    }

    nodeName = dest.nodeName.toLowerCase();

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
    var fragment, cacheable, cacheresults, doc,
      first = args[ 0 ];

    // nodes may contain either an explicit document object,
    // a jQuery collection or context object.
    // If nodes[0] contains a valid object to assign to doc
    if ( nodes && nodes[0] ) {
      doc = nodes[0].ownerDocument || nodes[0];
    }

    // Ensure that an attr object doesn't incorrectly stand in as a document object
    // Chrome and Firefox seem to allow this to occur and will throw exception
    // Fixes #8950
    if ( !doc.createDocumentFragment ) {
      doc = document;
    }

    // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
    if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
      first.charAt(0) === "<" && !rnocache.test( first ) &&
      (jQuery.support.checkClone || !rchecked.test( first )) &&
      (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

      cacheable = true;

      cacheresults = jQuery.fragments[ first ];
      if ( cacheresults && cacheresults !== 1 ) {
        fragment = cacheresults;
      }
    }

    if ( !fragment ) {
      fragment = doc.createDocumentFragment();
      jQuery.clean( args, doc, fragment, scripts );
    }

    if ( cacheable ) {
      jQuery.fragments[ first ] = cacheresults ? fragment : 1;
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
          var elems = ( i > 0 ? this.clone(true) : this ).get();
          jQuery( insert[i] )[ original ]( elems );
          ret = ret.concat( elems );
        }

        return this.pushStack( ret, name, insert.selector );
      }
    };
  });

  function getAll( elem ) {
    if ( typeof elem.getElementsByTagName !== "undefined" ) {
      return elem.getElementsByTagName( "*" );

    } else if ( typeof elem.querySelectorAll !== "undefined" ) {
      return elem.querySelectorAll( "*" );

    } else {
      return [];
    }
  }

// Used in clean, fixes the defaultChecked property
  function fixDefaultChecked( elem ) {
    if ( elem.type === "checkbox" || elem.type === "radio" ) {
      elem.defaultChecked = elem.checked;
    }
  }
// Finds all inputs and passes them to fixDefaultChecked
  function findInputs( elem ) {
    var nodeName = ( elem.nodeName || "" ).toLowerCase();
    if ( nodeName === "input" ) {
      fixDefaultChecked( elem );
      // Skip scripts, get other children
    } else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
      jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
    }
  }

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
  function shimCloneNode( elem ) {
    var div = document.createElement( "div" );
    safeFragment.appendChild( div );

    div.innerHTML = elem.outerHTML;
    return div.firstChild;
  }

  jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
      var srcElements,
        destElements,
        i,
        // IE<=8 does not properly clone detached, unknown element nodes
        clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
          elem.cloneNode( true ) :
          shimCloneNode( elem );

      if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
        // IE copies events bound via attachEvent when using cloneNode.
        // Calling detachEvent on the clone will also remove the events
        // from the original. In order to get around this, we use some
        // proprietary methods to clear the events. Thanks to MooTools
        // guys for this hotness.

        cloneFixAttributes( elem, clone );

        // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
        srcElements = getAll( elem );
        destElements = getAll( clone );

        // Weird iteration because IE will replace the length property
        // with an element if you are cloning the body and one of the
        // elements on the page has a name or id of "length"
        for ( i = 0; srcElements[i]; ++i ) {
          // Ensure that the destination node is not null; Fixes #9587
          if ( destElements[i] ) {
            cloneFixAttributes( srcElements[i], destElements[i] );
          }
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

      srcElements = destElements = null;

      // Return the cloned set
      return clone;
    },

    clean: function( elems, context, fragment, scripts ) {
      var checkScriptType;

      context = context || document;

      // !context.createElement fails in IE with an error but returns typeof 'object'
      if ( typeof context.createElement === "undefined" ) {
        context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
      }

      var ret = [], j;

      for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
        if ( typeof elem === "number" ) {
          elem += "";
        }

        if ( !elem ) {
          continue;
        }

        // Convert html string into DOM nodes
        if ( typeof elem === "string" ) {
          if ( !rhtml.test( elem ) ) {
            elem = context.createTextNode( elem );
          } else {
            // Fix "XHTML"-style tags in all browsers
            elem = elem.replace(rxhtmlTag, "<$1></$2>");

            // Trim whitespace, otherwise indexOf won't work as expected
            var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
              wrap = wrapMap[ tag ] || wrapMap._default,
              depth = wrap[0],
              div = context.createElement("div");

            // Append wrapper element to unknown element safe doc fragment
            if ( context === document ) {
              // Use the fragment we've already created for this document
              safeFragment.appendChild( div );
            } else {
              // Use a fragment created with the owner document
              createSafeFragment( context ).appendChild( div );
            }

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

              for ( j = tbody.length - 1; j >= 0 ; --j ) {
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
        }

        // Resets defaultChecked for any radios and checkboxes
        // about to be appended to the DOM in IE 6/7 (#8060)
        var len;
        if ( !jQuery.support.appendChecked ) {
          if ( elem[0] && typeof (len = elem.length) === "number" ) {
            for ( j = 0; j < len; j++ ) {
              findInputs( elem[j] );
            }
          } else {
            findInputs( elem );
          }
        }

        if ( elem.nodeType ) {
          ret.push( elem );
        } else {
          ret = jQuery.merge( ret, elem );
        }
      }

      if ( fragment ) {
        checkScriptType = function( elem ) {
          return !elem.type || rscriptType.test( elem.type );
        };
        for ( i = 0; ret[i]; i++ ) {
          if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
            scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

          } else {
            if ( ret[i].nodeType === 1 ) {
              var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

              ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
            }
            fragment.appendChild( ret[i] );
          }
        }
      }

      return ret;
    },

    cleanData: function( elems ) {
      var data, id,
        cache = jQuery.cache,
        special = jQuery.event.special,
        deleteExpando = jQuery.support.deleteExpando;

      for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
        if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
          continue;
        }

        id = elem[ jQuery.expando ];

        if ( id ) {
          data = cache[ id ];

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
      jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
    }

    if ( elem.parentNode ) {
      elem.parentNode.removeChild( elem );
    }
  }




  var ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    // fixed for IE9, see #8346
    rupper = /([A-Z]|^ms)/g,
    rnumpx = /^-?\d+(?:px)?$/i,
    rnum = /^-?\d/,
    rrelNum = /^([\-+])=([\-+.\de]+)/,

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssWidth = [ "Left", "Right" ],
    cssHeight = [ "Top", "Bottom" ],
    curCSS,

    getComputedStyle,
    currentStyle;

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
      "fillOpacity": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
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
      var ret, type, origName = jQuery.camelCase( name ),
        style = elem.style, hooks = jQuery.cssHooks[ origName ];

      name = jQuery.cssProps[ origName ] || origName;

      // Check if we're setting a value
      if ( value !== undefined ) {
        type = typeof value;

        // convert relative number strings (+= or -=) to relative numbers. #7345
        if ( type === "string" && (ret = rrelNum.exec( value )) ) {
          value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
          // Fixes bug #9237
          type = "number";
        }

        // Make sure that NaN and null values aren't set. See: #7116
        if ( value == null || type === "number" && isNaN( value ) ) {
          return;
        }

        // If a number was passed in, add 'px' to the (except for certain CSS properties)
        if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
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
      var ret, hooks;

      // Make sure that we're working with the right name
      name = jQuery.camelCase( name );
      hooks = jQuery.cssHooks[ name ];
      name = jQuery.cssProps[ name ] || name;

      // cssFloat needs a special treatment
      if ( name === "cssFloat" ) {
        name = "float";
      }

      // If a hook was provided get the computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
        return ret;

        // Otherwise, if a way to get the computed value exists, use that
      } else if ( curCSS ) {
        return curCSS( elem, name );
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
            return getWH( elem, name, extra );
          } else {
            jQuery.swap( elem, cssShow, function() {
              val = getWH( elem, name, extra );
            });
          }

          return val;
        }
      },

      set: function( elem, value ) {
        if ( rnumpx.test( value ) ) {
          // ignore negative width and height values #1599
          value = parseFloat( value );

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
        return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
          ( parseFloat( RegExp.$1 ) / 100 ) + "" :
          computed ? "1" : "";
      },

      set: function( elem, value ) {
        var style = elem.style,
          currentStyle = elem.currentStyle,
          opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
          filter = currentStyle && currentStyle.filter || style.filter || "";

        // IE has trouble with opacity if it does not have layout
        // Force it by setting the zoom level
        style.zoom = 1;

        // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
        if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

          // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
          // if "filter:" is present at all, clearType is disabled, we want to avoid this
          // style.removeAttribute is IE Only, but so apparently is this code path...
          style.removeAttribute( "filter" );

          // if there there is no filter style applied in a css rule, we are done
          if ( currentStyle && !currentStyle.filter ) {
            return;
          }
        }

        // otherwise, set new filter values
        style.filter = ralpha.test( filter ) ?
          filter.replace( ralpha, opacity ) :
          filter + " " + opacity;
      }
    };
  }

  jQuery(function() {
    // This hook cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    if ( !jQuery.support.reliableMarginRight ) {
      jQuery.cssHooks.marginRight = {
        get: function( elem, computed ) {
          // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
          // Work around by temporarily setting element display to inline-block
          var ret;
          jQuery.swap( elem, { "display": "inline-block" }, function() {
            if ( computed ) {
              ret = curCSS( elem, "margin-right", "marginRight" );
            } else {
              ret = elem.style.marginRight;
            }
          });
          return ret;
        }
      };
    }
  });

  if ( document.defaultView && document.defaultView.getComputedStyle ) {
    getComputedStyle = function( elem, name ) {
      var ret, defaultView, computedStyle;

      name = name.replace( rupper, "-$1" ).toLowerCase();

      if ( (defaultView = elem.ownerDocument.defaultView) &&
        (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
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
      var left, rsLeft, uncomputed,
        ret = elem.currentStyle && elem.currentStyle[ name ],
        style = elem.style;

      // Avoid setting ret to empty string here
      // so we don't default to auto
      if ( ret === null && style && (uncomputed = style[ name ]) ) {
        ret = uncomputed;
      }

      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

        // Remember the original values
        left = style.left;
        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

        // Put in the new values to get a computed value out
        if ( rsLeft ) {
          elem.runtimeStyle.left = elem.currentStyle.left;
        }
        style.left = name === "fontSize" ? "1em" : ( ret || 0 );
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

    // Start with offset property
    var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      which = name === "width" ? cssWidth : cssHeight,
      i = 0,
      len = which.length;

    if ( val > 0 ) {
      if ( extra !== "border" ) {
        for ( ; i < len; i++ ) {
          if ( !extra ) {
            val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
          }
          if ( extra === "margin" ) {
            val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
          } else {
            val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
          }
        }
      }

      return val + "px";
    }

    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, name );
    if ( val < 0 || val == null ) {
      val = elem.style[ name ] || 0;
    }
    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;

    // Add padding, border, margin
    if ( extra ) {
      for ( ; i < len; i++ ) {
        val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
        if ( extra !== "padding" ) {
          val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
        }
        if ( extra === "margin" ) {
          val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
        }
      }
    }

    return val + "px";
  }

  if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
      var width = elem.offsetWidth,
        height = elem.offsetHeight;

      return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
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
    rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rselectTextarea = /^(?:select|textarea)/i,
    rspacesAjax = /\s+/,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

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
    ajaxLocParts,

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
  try {
    ajaxLocation = location.href;
  } catch( e ) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

// Segment location into parts
  ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

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
        for ( ; i < length; i++ ) {
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

// Base inspection function for prefilters and transports
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

    for ( ; i < length && ( executeOnly || !selection ); i++ ) {
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

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
  function ajaxExtend( target, src ) {
    var key, deep,
      flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for ( key in src ) {
      if ( src[ key ] !== undefined ) {
        ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
      }
    }
    if ( deep ) {
      jQuery.extend( true, target, deep );
    }
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
      return this.on( o, f );
    };
  });

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
  });

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
    ajaxSetup: function( target, settings ) {
      if ( settings ) {
        // Building a settings object
        ajaxExtend( target, jQuery.ajaxSettings );
      } else {
        // Extending ajaxSettings
        settings = target;
        target = jQuery.ajaxSettings;
      }
      ajaxExtend( target, settings );
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
       */

      accepts: {
        xml: "application/xml, text/xml",
        html: "text/html",
        text: "text/plain",
        json: "application/json, text/javascript",
        "*": allTypes
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
      },

      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        context: true,
        url: true
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
        completeDeferred = jQuery.Callbacks( "once memory" ),
        // Status-dependent callbacks
        statusCode = s.statusCode || {},
        // ifModified key
        ifModifiedKey,
        // Headers (they are sent all at once)
        requestHeaders = {},
        requestHeadersNames = {},
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
              var lname = name.toLowerCase();
              name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
              requestHeaders[ name ] = value;
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
      function done( status, nativeStatusText, responses, headers ) {

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
        jqXHR.readyState = status > 0 ? 4 : 0;

        var isSuccess,
          success,
          error,
          statusText = nativeStatusText,
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
          if ( !statusText || status ) {
            statusText = "error";
            if ( status < 0 ) {
              status = 0;
            }
          }
        }

        // Set data for the fake xhr object
        jqXHR.status = status;
        jqXHR.statusText = "" + ( nativeStatusText || statusText );

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
        completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

        if ( fireGlobals ) {
          globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
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
      jqXHR.complete = completeDeferred.add;

      // Status-dependent callbacks
      jqXHR.statusCode = function( map ) {
        if ( map ) {
          var tmp;
          if ( state < 2 ) {
            for ( tmp in map ) {
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
      if ( s.crossDomain == null ) {
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
          // #9682: remove data so that it's not used in an eventual retry
          delete s.data;
        }

        // Get ifModifiedKey before adding the anti-cache parameter
        ifModifiedKey = s.url;

        // Add anti-cache in url if needed
        if ( s.cache === false ) {

          var ts = jQuery.now(),
            // try replacing _= if it is there
            ret = s.url.replace( rts, "$1_=" + ts );

          // if nothing was replaced, add timestamp to the end
          s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
        }
      }

      // Set the correct header, if data is being sent
      if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
        jqXHR.setRequestHeader( "Content-Type", s.contentType );
      }

      // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      if ( s.ifModified ) {
        ifModifiedKey = ifModifiedKey || s.url;
        if ( jQuery.lastModified[ ifModifiedKey ] ) {
          jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
        }
        if ( jQuery.etag[ ifModifiedKey ] ) {
          jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
        }
      }

      // Set the Accepts header for the server, depending on the dataType
      jqXHR.setRequestHeader(
        "Accept",
        s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
          s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
          s.accepts[ "*" ]
      );

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
          if ( state < 2 ) {
            done( -1, e );
            // Simply rethrow otherwise
          } else {
            throw e;
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
        });

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
    if ( jQuery.isArray( obj ) ) {
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
      // Serialize object item.
      for ( var name in obj ) {
        buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
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
    for ( type in responseFields ) {
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
    for ( i = 1; i < length; i++ ) {

      // Create converters map
      // with lowercased keys
      if ( i === 1 ) {
        for ( key in s.converters ) {
          if ( typeof key === "string" ) {
            converters[ key.toLowerCase() ] = s.converters[ key ];
          }
        }
      }

      // Get the dataTypes
      prev = current;
      current = dataTypes[ i ];

      // If current is auto dataType, update it to prev
      if ( current === "*" ) {
        current = prev;
        // If no auto and dataTypes are actually different
      } else if ( prev !== "*" && prev !== current ) {

        // Get the converter
        conversion = prev + " " + current;
        conv = converters[ conversion ] || converters[ "* " + current ];

        // If there is no direct converter, search transitively
        if ( !conv ) {
          conv2 = undefined;
          for ( conv1 in converters ) {
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
    jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      return jQuery.expando + "_" + ( jsc++ );
    }
  });

// Detect, normalize options and install callbacks for jsonp requests
  jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
      ( typeof s.data === "string" );

    if ( s.dataTypes[ 0 ] === "jsonp" ||
      s.jsonp !== false && ( jsre.test( s.url ) ||
        inspectData && jsre.test( s.data ) ) ) {

      var responseContainer,
        jsonpCallback = s.jsonpCallback =
          jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
        previous = window[ jsonpCallback ],
        url = s.url,
        data = s.data,
        replace = "$1" + jsonpCallback + "$2";

      if ( s.jsonp !== false ) {
        url = url.replace( jsre, replace );
        if ( s.url === url ) {
          if ( inspectData ) {
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

      // Clean-up function
      jqXHR.always(function() {
        // Set callback back to previous value
        window[ jsonpCallback ] = previous;
        // Call if it was a function and we have a response
        if ( responseContainer && jQuery.isFunction( previous ) ) {
          window[ jsonpCallback ]( responseContainer[ 0 ] );
        }
      });

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
  });




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
  });

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

            if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

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
  });




  var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject ? function() {
      // Abort all pending requests
      for ( var key in xhrCallbacks ) {
        xhrCallbacks[ key ]( 0, 1 );
      }
    } : false,
    xhrId = 0,
    xhrCallbacks;

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

// Determine support properties
  (function( xhr ) {
    jQuery.extend( jQuery.support, {
      ajax: !!xhr,
      cors: !!xhr && ( "withCredentials" in xhr )
    });
  })( jQuery.ajaxSettings.xhr() );

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

            // X-Requested-With header
            // For cross-domain requests, seeing as conditions for a preflight are
            // akin to a jigsaw puzzle, we simply never set it to be sure.
            // (it can always be set on a per-request basis or even using ajaxSetup)
            // For same-domain requests, won't change header if already provided.
            if ( !s.crossDomain && !headers["X-Requested-With"] ) {
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
                    if ( xhrOnUnloadAbort ) {
                      delete xhrCallbacks[ handle ];
                    }
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
              handle = ++xhrId;
              if ( xhrOnUnloadAbort ) {
                // Create the active xhrs callbacks list if needed
                // and attach the unload handler
                if ( !xhrCallbacks ) {
                  xhrCallbacks = {};
                  jQuery( window ).unload( xhrOnUnloadAbort );
                }
                // Add to list of active xhrs callbacks
                xhrCallbacks[ handle ] = callback;
              }
              xhr.onreadystatechange = callback;
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
    iframe, iframeDoc,
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
    ],
    fxNow;

  jQuery.fn.extend({
    show: function( speed, easing, callback ) {
      var elem, display;

      if ( speed || speed === 0 ) {
        return this.animate( genFx("show", 3), speed, easing, callback );

      } else {
        for ( var i = 0, j = this.length; i < j; i++ ) {
          elem = this[ i ];

          if ( elem.style ) {
            display = elem.style.display;

            // Reset the inline display of this element to learn if it is
            // being hidden by cascaded rules or not
            if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
              display = elem.style.display = "";
            }

            // Set elements which have been overridden with display: none
            // in a stylesheet to whatever the default browser style is
            // for such an element
            if ( display === "" && jQuery.css(elem, "display") === "none" ) {
              jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
            }
          }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( i = 0; i < j; i++ ) {
          elem = this[ i ];

          if ( elem.style ) {
            display = elem.style.display;

            if ( display === "" || display === "none" ) {
              elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
            }
          }
        }

        return this;
      }
    },

    hide: function( speed, easing, callback ) {
      if ( speed || speed === 0 ) {
        return this.animate( genFx("hide", 3), speed, easing, callback);

      } else {
        var elem, display,
          i = 0,
          j = this.length;

        for ( ; i < j; i++ ) {
          elem = this[i];
          if ( elem.style ) {
            display = jQuery.css( elem, "display" );

            if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
              jQuery._data( elem, "olddisplay", display );
            }
          }
        }

        // Set the display of the elements in a second loop
        // to avoid the constant reflow
        for ( i = 0; i < j; i++ ) {
          if ( this[i].style ) {
            this[i].style.display = "none";
          }
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
      var optall = jQuery.speed( speed, easing, callback );

      if ( jQuery.isEmptyObject( prop ) ) {
        return this.each( optall.complete, [ false ] );
      }

      // Do not change referenced properties as per-property easing will be lost
      prop = jQuery.extend( {}, prop );

      function doAnimation() {
        // XXX 'this' does not always have a nodeName when running the
        // test suite

        if ( optall.queue === false ) {
          jQuery._mark( this );
        }

        var opt = jQuery.extend( {}, optall ),
          isElement = this.nodeType === 1,
          hidden = isElement && jQuery(this).is(":hidden"),
          name, val, p, e,
          parts, start, end, unit,
          method;

        // will store per property easing and be used to determine when an animation is complete
        opt.animatedProperties = {};

        for ( p in prop ) {

          // property name normalization
          name = jQuery.camelCase( p );
          if ( p !== name ) {
            prop[ name ] = prop[ p ];
            delete prop[ p ];
          }

          val = prop[ name ];

          // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
          if ( jQuery.isArray( val ) ) {
            opt.animatedProperties[ name ] = val[ 1 ];
            val = prop[ name ] = val[ 0 ];
          } else {
            opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
          }

          if ( val === "hide" && hidden || val === "show" && !hidden ) {
            return opt.complete.call( this );
          }

          if ( isElement && ( name === "height" || name === "width" ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( jQuery.css( this, "display" ) === "inline" &&
              jQuery.css( this, "float" ) === "none" ) {

              // inline-level elements accept inline-block;
              // block-level elements need to be inline with layout
              if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
                this.style.display = "inline-block";

              } else {
                this.style.zoom = 1;
              }
            }
          }
        }

        if ( opt.overflow != null ) {
          this.style.overflow = "hidden";
        }

        for ( p in prop ) {
          e = new jQuery.fx( this, opt, p );
          val = prop[ p ];

          if ( rfxtypes.test( val ) ) {

            // Tracks whether to show or hide based on private
            // data attached to the element
            method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
            if ( method ) {
              jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
              e[ method ]();
            } else {
              e[ val ]();
            }

          } else {
            parts = rfxnum.exec( val );
            start = e.cur();

            if ( parts ) {
              end = parseFloat( parts[2] );
              unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

              // We need to compute starting value
              if ( unit !== "px" ) {
                jQuery.style( this, p, (end || 1) + unit);
                start = ( (end || 1) / e.cur() ) * start;
                jQuery.style( this, p, start + unit);
              }

              // If a +=/-= token was provided, we're doing a relative animation
              if ( parts[1] ) {
                end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
              }

              e.custom( start, end, unit );

            } else {
              e.custom( start, val, "" );
            }
          }
        }

        // For JS strict compliance
        return true;
      }

      return optall.queue === false ?
        this.each( doAnimation ) :
        this.queue( optall.queue, doAnimation );
    },

    stop: function( type, clearQueue, gotoEnd ) {
      if ( typeof type !== "string" ) {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if ( clearQueue && type !== false ) {
        this.queue( type || "fx", [] );
      }

      return this.each(function() {
        var index,
          hadTimers = false,
          timers = jQuery.timers,
          data = jQuery._data( this );

        // clear marker counters if we know they won't be
        if ( !gotoEnd ) {
          jQuery._unmark( true, this );
        }

        function stopQueue( elem, data, index ) {
          var hooks = data[ index ];
          jQuery.removeData( elem, index, true );
          hooks.stop( gotoEnd );
        }

        if ( type == null ) {
          for ( index in data ) {
            if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
              stopQueue( this, data, index );
            }
          }
        } else if ( data[ index = type + ".run" ] && data[ index ].stop ){
          stopQueue( this, data, index );
        }

        for ( index = timers.length; index--; ) {
          if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
            if ( gotoEnd ) {

              // force the next step to be the last
              timers[ index ]( true );
            } else {
              timers[ index ].saveState();
            }
            hadTimers = true;
            timers.splice( index, 1 );
          }
        }

        // start the next in the queue if the last step wasn't forced
        // timers currently will call their complete callbacks, which will dequeue
        // but only if they were gotoEnd
        if ( !( gotoEnd && hadTimers ) ) {
          jQuery.dequeue( this, type );
        }
      });
    }

  });

// Animations created synchronously will run synchronously
  function createFxNow() {
    setTimeout( clearFxNow, 0 );
    return ( fxNow = jQuery.now() );
  }

  function clearFxNow() {
    fxNow = undefined;
  }

// Generate parameters to create a standard animation
  function genFx( type, num ) {
    var obj = {};

    jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
      obj[ this ] = type;
    });

    return obj;
  }

// Generate shortcuts for custom animations
  jQuery.each({
    slideDown: genFx( "show", 1 ),
    slideUp: genFx( "hide", 1 ),
    slideToggle: genFx( "toggle", 1 ),
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
      var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
        complete: fn || !fn && easing ||
          jQuery.isFunction( speed ) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
      };

      opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
        opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

      // normalize opt.queue - true/undefined/null -> "fx"
      if ( opt.queue == null || opt.queue === true ) {
        opt.queue = "fx";
      }

      // Queueing
      opt.old = opt.complete;

      opt.complete = function( noUnmark ) {
        if ( jQuery.isFunction( opt.old ) ) {
          opt.old.call( this );
        }

        if ( opt.queue ) {
          jQuery.dequeue( this, opt.queue );
        } else if ( noUnmark !== false ) {
          jQuery._unmark( this );
        }
      };

      return opt;
    },

    easing: {
      linear: function( p, n, firstNum, diff ) {
        return firstNum + diff * p;
      },
      swing: function( p, n, firstNum, diff ) {
        return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
      }
    },

    timers: [],

    fx: function( elem, options, prop ) {
      this.options = options;
      this.elem = elem;
      this.prop = prop;

      options.orig = options.orig || {};
    }

  });

  jQuery.fx.prototype = {
    // Simple function for setting a style value
    update: function() {
      if ( this.options.step ) {
        this.options.step.call( this.elem, this.now, this );
      }

      ( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
    },

    // Get the current size
    cur: function() {
      if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
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

      this.startTime = fxNow || createFxNow();
      this.end = to;
      this.now = this.start = from;
      this.pos = this.state = 0;
      this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

      function t( gotoEnd ) {
        return self.step( gotoEnd );
      }

      t.queue = this.options.queue;
      t.elem = this.elem;
      t.saveState = function() {
        if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
          jQuery._data( self.elem, "fxshow" + self.prop, self.start );
        }
      };

      if ( t() && jQuery.timers.push(t) && !timerId ) {
        timerId = setInterval( fx.tick, fx.interval );
      }
    },

    // Simple 'show' function
    show: function() {
      var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

      // Remember where we started, so that we can go back to it later
      this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
      this.options.show = true;

      // Begin the animation
      // Make sure that we start at a small width/height to avoid any flash of content
      if ( dataShow !== undefined ) {
        // This show is picking up where a previous hide or show left off
        this.custom( this.cur(), dataShow );
      } else {
        this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
      }

      // Start by showing the element
      jQuery( this.elem ).show();
    },

    // Simple 'hide' function
    hide: function() {
      // Remember where we started, so that we can go back to it later
      this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
      this.options.hide = true;

      // Begin the animation
      this.custom( this.cur(), 0 );
    },

    // Each step of an animation
    step: function( gotoEnd ) {
      var p, n, complete,
        t = fxNow || createFxNow(),
        done = true,
        elem = this.elem,
        options = this.options;

      if ( gotoEnd || t >= options.duration + this.startTime ) {
        this.now = this.end;
        this.pos = this.state = 1;
        this.update();

        options.animatedProperties[ this.prop ] = true;

        for ( p in options.animatedProperties ) {
          if ( options.animatedProperties[ p ] !== true ) {
            done = false;
          }
        }

        if ( done ) {
          // Reset the overflow
          if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

            jQuery.each( [ "", "X", "Y" ], function( index, value ) {
              elem.style[ "overflow" + value ] = options.overflow[ index ];
            });
          }

          // Hide the element if the "hide" operation was done
          if ( options.hide ) {
            jQuery( elem ).hide();
          }

          // Reset the properties, if the item has been hidden or shown
          if ( options.hide || options.show ) {
            for ( p in options.animatedProperties ) {
              jQuery.style( elem, p, options.orig[ p ] );
              jQuery.removeData( elem, "fxshow" + p, true );
              // Toggle data is no longer needed
              jQuery.removeData( elem, "toggle" + p, true );
            }
          }

          // Execute the complete function
          // in the event that the complete function throws an exception
          // we must ensure it won't be called twice. #5684

          complete = options.complete;
          if ( complete ) {

            options.complete = false;
            complete.call( elem );
          }
        }

        return false;

      } else {
        // classical easing cannot be used with an Infinity duration
        if ( options.duration == Infinity ) {
          this.now = t;
        } else {
          n = t - this.startTime;
          this.state = n / options.duration;

          // Perform the easing function, defaults to swing
          this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
          this.now = this.start + ( (this.end - this.start) * this.pos );
        }
        // Perform the next step of the animation
        this.update();
      }

      return true;
    }
  };

  jQuery.extend( jQuery.fx, {
    tick: function() {
      var timer,
        timers = jQuery.timers,
        i = 0;

      for ( ; i < timers.length; i++ ) {
        timer = timers[ i ];
        // Checks the timer has not already been removed
        if ( !timer() && timers[ i ] === timer ) {
          timers.splice( i--, 1 );
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
          fx.elem.style[ fx.prop ] = fx.now + fx.unit;
        } else {
          fx.elem[ fx.prop ] = fx.now;
        }
      }
    }
  });

// Adds width/height step functions
// Do not set anything below 0
  jQuery.each([ "width", "height" ], function( i, prop ) {
    jQuery.fx.step[ prop ] = function( fx ) {
      jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
    };
  });

  if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
      return jQuery.grep(jQuery.timers, function( fn ) {
        return elem === fn.elem;
      }).length;
    };
  }

// Try to restore the default display value of an element
  function defaultDisplay( nodeName ) {

    if ( !elemdisplay[ nodeName ] ) {

      var body = document.body,
        elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
        display = elem.css( "display" );
      elem.remove();

      // If the simple way fails,
      // get element's real default display by attaching it to a temp iframe
      if ( display === "none" || display === "" ) {
        // No iframe to use yet, so create it
        if ( !iframe ) {
          iframe = document.createElement( "iframe" );
          iframe.frameBorder = iframe.width = iframe.height = 0;
        }

        body.appendChild( iframe );

        // Create a cacheable copy of the iframe document on first call.
        // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
        // document to it; WebKit & Firefox won't allow reusing the iframe document.
        if ( !iframeDoc || !iframe.createElement ) {
          iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
          iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
          iframeDoc.close();
        }

        elem = iframeDoc.createElement( nodeName );

        iframeDoc.body.appendChild( elem );

        display = jQuery.css( elem, "display" );
        body.removeChild( iframe );
      }

      // Store the correct default display
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
        scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
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
        if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
          break;
        }

        computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
        top  -= elem.scrollTop;
        left -= elem.scrollLeft;

        if ( elem === offsetParent ) {
          top  += elem.offsetTop;
          left += elem.offsetLeft;

          if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
            top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
            left += parseFloat( computedStyle.borderLeftWidth ) || 0;
          }

          prevOffsetParent = offsetParent;
          offsetParent = elem.offsetParent;
        }

        if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
          top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
          left += parseFloat( computedStyle.borderLeftWidth ) || 0;
        }

        prevComputedStyle = computedStyle;
      }

      if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
        top  += body.offsetTop;
        left += body.offsetLeft;
      }

      if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
        top  += Math.max( docElem.scrollTop, body.scrollTop );
        left += Math.max( docElem.scrollLeft, body.scrollLeft );
      }

      return { top: top, left: left };
    };
  }

  jQuery.offset = {

    bodyOffset: function( body ) {
      var top = body.offsetTop,
        left = body.offsetLeft;

      if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
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
        calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
        props = {}, curPosition = {}, curTop, curLeft;

      // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      if ( calculatePosition ) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat( curCSSTop ) || 0;
        curLeft = parseFloat( curCSSLeft ) || 0;
      }

      if ( jQuery.isFunction( options ) ) {
        options = options.call( elem, i, curOffset );
      }

      if ( options.top != null ) {
        props.top = ( options.top - curOffset.top ) + curTop;
      }
      if ( options.left != null ) {
        props.left = ( options.left - curOffset.left ) + curLeft;
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

    jQuery.fn[ method ] = function( val ) {
      var elem, win;

      if ( val === undefined ) {
        elem = this[ 0 ];

        if ( !elem ) {
          return null;
        }

        win = getWindow( elem );

        // Return the scroll offset
        return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
          jQuery.support.boxModel && win.document.documentElement[ method ] ||
            win.document.body[ method ] :
          elem[ method ];
      }

      // Set the scroll offset
      return this.each(function() {
        win = getWindow( this );

        if ( win ) {
          win.scrollTo(
            !i ? val : jQuery( win ).scrollLeft(),
            i ? val : jQuery( win ).scrollTop()
          );

        } else {
          this[ method ] = val;
        }
      });
    };
  });

  function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
      elem :
      elem.nodeType === 9 ?
        elem.defaultView || elem.parentWindow :
        false;
  }




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
  jQuery.each([ "Height", "Width" ], function( i, name ) {

    var type = name.toLowerCase();

    // innerHeight and innerWidth
    jQuery.fn[ "inner" + name ] = function() {
      var elem = this[0];
      return elem ?
        elem.style ?
          parseFloat( jQuery.css( elem, type, "padding" ) ) :
          this[ type ]() :
        null;
    };

    // outerHeight and outerWidth
    jQuery.fn[ "outer" + name ] = function( margin ) {
      var elem = this[0];
      return elem ?
        elem.style ?
          parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
          this[ type ]() :
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
        var docElemProp = elem.document.documentElement[ "client" + name ],
          body = elem.document.body;
        return elem.document.compatMode === "CSS1Compat" && docElemProp ||
          body && body[ "client" + name ] || docElemProp;

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

        return jQuery.isNumeric( ret ) ? ret : orig;

        // Set the width or height on the element (default to pixels if value is unitless)
      } else {
        return this.css( type, typeof size === "string" ? size : size + "px" );
      }
    };

  });




// Expose jQuery to the global object
  window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
  if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
    define( "jquery", [], function () { return jQuery; } );
  }



})( window );/**
 * @namespace gb
 */
var gb = {};
gb.geom = {};
gb.keys = {};

String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
}

Math.nrand = function () {
  var x1, x2, rad, c, r;
  if (Math.__lastc2 !== undefined) {
    r = Math.__lastc2;
    delete Math.__lastc2;
    return r;
  }
  do {
    x1 = 2 * this.random() - 1;
    x2 = 2 * this.random() - 1;
    rad = x1 * x1 + x2 * x2;
  } while (rad >= 1);
  if (rad == 0)
    return 0;
  c = Math.sqrt(-2 * Math.log(rad) / rad);
  Math.__lastc2 = x2 * c;
  return x1 * c;
};

function registerShortcutKey(sk) {
  if (sk instanceof Array) {
    $.each(sk, function (k, v) {
      registerShortcutKey(v);
    });
  }

  if (!gb.keys[sk.keyCode]) {
    gb.keys[sk.keyCode] = {
      ctrl : {
        alt : {
          shift : [],
          def : []
        },
        shift : {
          def : []
        },
        def : []
      },
      alt : {
        shift : {
          def : []
        },
        def : []
      },
      shift : {
        def : []
      },
      def : []
    };
  }

  var item = gb.keys[sk.keyCode];
  if (sk.alter & ShortcutKey.CTRL) {
    item = item.ctrl;
  }

  if (sk.alter & ShortcutKey.ALT) {
    item = item.alt;
  }

  if (sk.alter & ShortcutKey.SHIFT) {
    item = item.shift;
  }

  if (item.def) item = item.def;

  item.push(sk);
  return true;
}

function installMenu() {
  var menu = $('ul#menu'), item, ul;
  $.each(gb.menu.items, function (k, v) {
    item = $('<li class="item">' + gb.menu[v].text + '</li>');
    menu.append(item);
    ul = null;
    $.each(gb.menu[v].items, function (sk, sv) {
      var sitem, mitem, text;
      if (!ul) {
        ul = $('<ul class="sub-menu"></ul>');
        item.append(ul);
      }
      if (sv == '-') {
        ul.append($('<li class="sep"></li>'));
      } else {
        mitem = gb.menu[v][sv];
        text = mitem.text;
        if (mitem.shortcutKey) {
          registerShortcutKey(mitem.shortcutKey);
          // text += mitem.shortcutKey.toString();
        }
        sitem = $('<li class="sub-item">' + text + '</li>');
        ul.append(sitem);
        sitem[0].action = mitem;
        sitem[0].action.item = sitem;
        sitem[0].action.text = function (text) {
          return this.item.html(text);
        };
        sitem.bind($.isTouch ? 'touchstart' : 'click', function (ev) {
          if (!mitem.isEnabled || mitem.isEnabled(gb.currentDoc)) {
            mitem.run(gb.currentDoc);
            $('#menu').removeClass('expand');
          }
          ev.stopPropagation();
        });
      }
    });
  });
  $('#menu li.item').bind($.isTouch ? 'touchstart' : 'click', function (ev) {
    $('#menu').addClass('expand');
  });
  $('#center').bind($.isTouch ? 'touchstart' : 'click', function () {
    $('#menu').removeClass('expand');
  });
}

function handleKeydown(ev) {
  var gdoc = gb.currentDoc, sk;
  if (gb.keys[ev.keyCode]) {
    sk = gb.keys[ev.keyCode];
    if (ev.metaKey) {
      sk = sk.ctrl;
    }

    if (ev.altKey) {
      sk = sk.alt;
    }

    if (ev.shiftKey) {
      sk = sk.shift;
    }

    if (sk.def) sk = sk.def;

    if (sk.length == 1) {
      gb.currentTool.reset();
      ev.preventDefault();
      ev.stopPropagation();
      sk = sk[0];
      sk.func();
      return;
    }
  }
  switch (ev.keyCode) {
    case 48:
      if (ev.metaKey) {
        gb.currentDoc.zoomRestore();
        ev.preventDefault();
        ev.stopPropagation();
      }
      break;
    case 49:
    case 50:
    case 51:
    case 52:
      if (!ev.metaKey && !ev.shiftKey) {
        ev.preventDefault();
        ev.stopPropagation();
        gb.utils.setTool(gb.toolids[ev.keyCode - 49]);
      }
      break;
    case 27:
      gb.utils.setTool('tools-sel');
      ev.stopPropagation();
      break;
    case 45:
      gb.utils.setTool('tools-sel');
      ev.stopPropagation();
      break;
    case 18:
      ev.preventDefault();
      ev.stopPropagation();
      $('#menu').addClass('show-ud');
      break;
    case 72:
      if (ev.metaKey) {
        gdoc.run(new HideCommand(gdoc.selection, !ev.shiftKey));
        ev.preventDefault();
        ev.stopPropagation();
      }
      break;
    default:
      $('#menu').removeClass('show-ud');
      ev.stopPropagation();
  }
}

loadPrevious = function () {
  var cd, json, doc, title;
  if (window.localStorage) {
    cd = "";
    var files = window.localStorage[gb.localStoragePrefix + 'files'];
    cd = window.localStorage[gb.localStoragePrefix + "currentDocument"];
    if (files) {
      files = gb.json.decode(files);
      $.each(files, function (i, title) {
        json = window.localStorage[gb.localStoragePrefix + title];
        if (json) {
          doc = new GDoc(title, gb.json.decode(json));
        }
      });
    }

    if (gb.docs.length == 0) {
      doc = new GDoc();
      gb.currentDoc = doc;
      doc.active();
      cd = doc.title;
    }

    if (cd) {
      $.each(gb.docs, function (k, v) {
        if (v.title == cd) {
          gb.currentDoc = v;
          v.active();
          return false;
        }
      });
    } else {
      gb.docs[0].active();
    }

  } else {
    doc = new GDoc();
    gb.currentDoc = doc;
    doc.save();
    doc.active();
  }
};

installTools = function () {
  gb.toolids = [];
  $.each(gb.tools, function (k, v) {
    if (!gb.currentTool)
      gb.currentTool = v;
    if (v instanceof Array) {
      var li = $('<li class="item group></li>'), ul = $('<ul></ul>');
      $('#tools').append(li);
      li.append(ul);
      $.each(v, function (k, item) {
        var li = $('<li id="tools-' + k + '">' + v.text + '</li>');
        ul.append(ul);
        li[0].action = v;
      });
    } else {
      var li = $('<li class="item" id="tools-' + k + '">' + v.text + '</li>');
      li[0].action = v;
      $('#tools').append(li);
      gb.toolids.push('tools-' + k);
    }
  });
  $('ul.tool li').bind($.isTouch ? 'touchstart' : 'click', function (ev) {
    if (ev.currentTarget.id == 'tools-hider')
      return;
    $('ul.tool li').removeClass('active');
    gb.utils.setTool(ev.currentTarget.id);
  });
  $('#left .tools-hider').bind($.isTouch ? 'touchstart' : 'click', function (ev) {
    $('#center').toggleClass('hide-tools');
  });
  $('#tools li:nth(0)').addClass('active');
};

window.init = function () {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i)
    ) {
    $.isTouch = true;
    $('body').addClass('touch').bind('touchstart', function (ev) {
      ev.preventDefault();
    });
  }

  loadPrevious();
  installMenu();
  installTools();
  if ($.isTouch) {
    $(document).bind('touchmove', function (event) {
      event.preventDefault();
    });
  }
  $(document).keyup(function (ev) {
    switch (ev.keyCode) {
      case 18:
        ev.preventDefault();
        ev.stopPropagation();
        $('#menu').removeClass('show-ud');
        break;
    }
  });
  $(document).keydown(handleKeydown);
  gb.utils.setTool('tools-sel');
  $(window).resize(function () {
    gb.currentDoc.resize($('#area').width(), $('#area').height());
  });
};

if (!document.createElement('canvas').getContext) {
  $('head').append('<script ' + 'src="scripts/excanvas.compiled.js"></script>');
}
  gb.utils = {};
gb.utils.eqo = function (o2) {
  var o1 = this, failed = false;
  $.each(this, function (k) {
    if (!o2[k])
      return !(failed = true);
  });
  if (failed)
    return false;

  $.each(o2, function (k) {
    if (!o1[k])
      return !(failed = true);
  });
  return !failed;
};

gb.utils.join = function (m1, m2) {
  var result = {};
  $.each(m1, function (k, v) {
    if (v === m2[k])
      result[k] = v;
  });
  return result;
};

/**
 *
 * @param {Object}
  *          x
 * @returns {Object}
 */
gb.utils.shallowClone = function (x) {
  var result = new Object();
  $.each(x, function (k, v) {
    result[k] = v;
  });
  return result;
};

gb.utils.m2a = function (m) {
  var a = [];
  $.each(m, function (k, v) {
    a.push(v);
  });
  return a;
};

gb.utils.a2m = function (a) {
  var m = {};
  $.each(a, function (k, v) {
    m[v.id] = v;
  });
  return m;
};


gb.utils.setTool = function (id) {
  $('ul.tool li').removeClass('active');
  $('#' + id).addClass('active');
  var action = $('#' + id)[0].action;
  gb.currentTool.reset();
  gb.currentTool = action;
  gb.currentDoc.draw();
  gb.currentDoc.refreshMenu();
};function ShortcutKey(keyCode, alter, func) {
  this.keyCode = keyCode;
  this.alter = alter;
  if (typeof func == 'string') {
    this.func = function () {
      var item = eval(func);
      if (!item.isEnabled || item.isEnabled(gb.currentDoc)) item.run(gb.currentDoc);
    };
  } else
    this.func = func;
}
;

ShortcutKey.CTRL = 1;
ShortcutKey.ALT = 2;
ShortcutKey.SHIFT = 4;
ShortcutKey.KEY_NAME = [
  '#0',
  '#1',
  '#2',
  '#3',
  '#4',
  '#5',
  '#6',
  '#7',
  'Backspace',
  'Tab',
  '#10',
  '#11',
  '#12',
  'Enter',
  '#14',
  '#15',
  'Shift',
  'Ctrl',
  '⌥',
  'Break',
  'Caps Lock',
  '#21',
  '#22',
  '#23',
  '#24',
  '#25',
  '#26',
  'Esc',
  '#28',
  '#29',
  '#30',
  '#31',
  'Space bar',
  'Page Up',
  'Page Down',
  'End',
  'Home',
  '←',
  '↑',
  '→',
  '↓',
  'Insert',
  'Delete',
  '#47',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '#58',
  '#59',
  '#60',
  '#61',
  '#62',
  '#63',
  '#64',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '⌘',
  '⌘',
  '#93',
  'num 0', 'num 1', 'num 2', 'num 3', 'num 4', 'num 5', 'num 6', 'num 7', 'num 8', 'num 9',
  '*',
  '+',
  '.',
  '/',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  '#124', '#125', '#126', '#127', '#',
  'Num Lock', 'Scroll Lock'
];


ShortcutKey.prototype = {
  keyCode : 0,
  alter : 0,
  func : function () {
  },
  test : function (ev) {
    if (this.alter & ShortcutKey.CTRL)
      if (!(ev.metaKey)) return false;
    if (this.alter & ShortcutKey.ALT)
      if (!(ev.altKey)) return false;
    if (this.alter & ShortcutKey.SHIFT)
      if (!(ev.shiftKey)) return false;
    return true;
  },
  toString : function () {
    var text = "";
    if (this.keyCode) {
      if (this.keyCode >= 65 && this.keyCode <= 90 && this.keyCode >= 96 && this.keyCode <= 122)
        text += String.fromCharCode(this.keyCode);
      else
        text += String.fromCharCode(this.keyCode);
    }
  }
};/*
 * This document is licensed as free software under the terms of the MIT
 * License: <a href="http://www.opensource.org/licenses/mit-license.php"
 * title="http://www.opensource.org/licenses/mit-license.php">http://www.opensource.org/licenses/mit-license.php</a>
 * 
 * Adapted by Rahul Singla.
 * 
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's <a href="http://www.json.org/json2.js"
 * title="http://www.json.org/json2.js">http://www.json.org/json2.js</a>, which
 * proclaims: "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a
 * sentiment that I uphold.
 * 
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

gb.json = {
  encode : function (o) {
    if (window.JSON && JSON.parse)
      return JSON.stringify(o);

    var type = typeof (o), me = this, ret, i;

    if (o === null)
      return "null";

    switch (type) {
      case "undefined":
        return undefined;
      case "number":
      case "boolean":
        return o.toString();
      case "string":
        return this.quoteString(o);
      case "object":
      default:
        if (typeof o.toJSON == "function")
          return me.encode(o.toJSON());

        if (o.constructor === Array) {
          ret = [];
          for (i = 0; i < o.length; i++)
            ret.push(me.encode(o[i]) || "null");

          return "[" + ret.join(",") + "]";
        }

        ret = [];
        $.each(o, function (k, v) {
          var type = typeof k, name;
          if (type == "number")
            name = '"' + k + '"';
          else if (type == "string")
            name = this._quoteString(k);
          else
            return;
          ret.push(name + ":" + me.encode(v));
        });
        return "{" + ret.join(", ") + "}";
    }
  },

  /**
   * jQuery.JSON.decode(src) Evaluates a given piece of json source.
   */
  decode : function (src) {
    if (window.JSON && JSON.parse)
      return JSON.parse(src);

    return eval("(" + src + ")");
  },

  /**
   * jQuery.JSON.decodeSecure(src) Evals JSON in a way that is *more* secure.
   */
  decodeSecure : function (src) {
    if (typeof (JSON) == 'object' && JSON.parse)
      return JSON.parse(src);

    var filtered = src;
    filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
    filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

    if (/^[\],:{}\s]*$/.test(filtered))
      return eval("(" + src + ")");
    else
      throw new SyntaxError("Error parsing JSON, source is not valid.");
  },

  /**
   * @private
   * @param {string} string
   * @returns {string}
   */
  _quoteString : function (string) {
    if (string.match(this._escapeable)) {
      return '"' + string.replace(this._escapeable, function (a) {
        var c = this._meta[a];
        if (typeof c === 'string')
          return c;
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + string + '"';
  },

  /**
   * @private
   * @constant
   */
  _escapeable : /["\\\x00-\x1f\x7f-\x9f]/g,

  /**
   * @private
   * @constant
   */
  _meta : {
    '\b' : '\\b',
    '\t' : '\\t',
    '\n' : '\\n',
    '\f' : '\\f',
    '\r' : '\\r',
    '"' : '\\"',
    '\\' : '\\\\'
  }
};gb.docs = [];
gb.localStoragePrefix = 'Geoboard-0.1-';
/**
 *
 * @param {String}
  *          title
 * @class GDoc
 * @constructor
 */
function GDoc(title, json) {
  var me = this, docNames, can, os, i;
  me.mouse = [ 0, 0 ];
  if (!title) {
    docNames = {};
    $.each(gb.docs, function (k, v) {
      docNames[v.title] = true;
    });
    for (i = 1; docNames[GDoc.prototype.title + i]; i++) {

    }
    title = GDoc.prototype.title + i;
  }
  me.title = title;
  me.canvas = document.createElement('canvas');
  me.canvas.doc = me;
  me.canvasPhantom = document.createElement('canvas');
  me.canvasPhantom.doc = me;
  $(me.canvasPhantom).addClass('phantom');
  can = $(me.canvas).add(me.canvasPhantom);
  can.attr('width', 1).attr('height', 1);

  if (window.G_vmlCanvasManager) {
    window.G_vmlCanvasManager.initElement(me.canvas);
    window.G_vmlCanvasManager.initElement(me.contextPhantom);
  }

  $('div#area').append(can);
  function bindMe(name) {
    return function (ev) {
      return me[name](ev);
    };
  }

  if ($.isTouch) {
    can.bind('touchstart', bindMe('onTouchStart'));
    can.bind('touchmove', bindMe('onTouchMove'));
    can.bind('touchend', bindMe('onTouchEnd'));
  } else {
    can.mousedown(bindMe('onMouseDown'));
    can.mousemove(bindMe('onMouseMove'));
    can.mouseup(bindMe('onMouseUp'));
  }

  can.bind('DOMMouseWheel mousewheel', function (ev) {
    if (ev.ctrlKey || ev.metaKey) {
      me.zoom(Math.pow(1.1, ev.wheelDelta / 240), [ ev.offsetX, ev.offsetY]);
    } else {
      me.pan(ev.originalEvent.wheelDeltaX, ev.originalEvent.wheelDeltaY);
    }
    me.draw();
    ev.stopPropagation();
    ev.preventDefault();
  });

  me.context = me.canvas.getContext("2d");
  me.contextPhantom = me.canvasPhantom.getContext("2d");
  me.installContext();

  me.canvas.doc = me;
  me.lines = {};
  me.points = {};
  me.selection = {};
  me.__nextId = 100;
  me.cmdStack = [];
  me.cmdStackPos = 0;
  me.pageHeader = $('<li>' + me.title + '</li>');
  me.pageHeader.bind($.isTouch ? 'touchstart' : 'click', function () {
    if (gb.currentDoc == me) {
      me.pageHeader.innerHTML = "";
      var header = $('<input type="text"/>').val(me.title);
      header.bind('keypress keyup keydown click',
        function (ev) {
          if (ev.keyCode == 27) {
            me.pageHeader.innerHTML = me.title;
            me.die();
          }
          ev.stopPropagation();
        }).blur(
        function (ev) {
          if (window.localStorage) {
            delete window.localStorage[gb.localStoragePrefix + me.title];
          }
          me.title = header.val();
          me.active();
          me.save();
          $(me.pageHeader).text(me.title);
          header.die();
        }).focus();
      $(me.pageHeader).append(header);
    } else {
      me.active();
    }
  });

  $('#page-header').append(me.pageHeader);
  me.pageHeader = me.pageHeader[0];
  gb.docs.push(me);
  if (json) {
    me.load(json);
  }
}

GDoc.prototype = {

  title : 'Untitled',
  /**
   * @type Object
   */
  lines : new Object(),
  /**
   * @type Object
   */
  points : new Object(),

  updateMouse : function (ev) {
    var me = this;
    if (!$.isTouch) {
      this.mouse = this.context.transP2M([ ev.offsetX, ev.offsetY, 6 ]);
    } else {
      ev.shiftKey = false;
      ev.keyCode = 0;
      if (ev.targetTouches) {
        $.each(ev.targetTouches, function (i, touch) {
          if (touch.identifier == me.currentTouch) {
            var pos = $(me.canvas).offset();
            me.mouse = me.context.transP2M([
              touch.clientX - pos.left,
              touch.clientY - pos.top
            ]);
            me.mouse[2] = 24;
            return false;
          }
        });
      } else {
        throw 'no targetTouches';
      }
    }
  },

  /**
   *
   * @param {TouchEvent} ev
   */
  onTouchStart : function (ev) {
    try {
      ev = ev.originalEvent;
      var me = this;
      if (ev.targetTouches && ev.targetTouches.length == 1) {
        me.currentTouch = ev.targetTouches[0].identifier;
        me.onMouseDown(ev);
      }
    } catch (e) {
      me.contextPhantom.fillStyle = "red";
      me.contextPhantom.fillText(e, 20, 20);
    }
  },

  onTouchMove : function (ev) {
    try {
      var currentTouch = null, me = this;
      ev = ev.originalEvent;
      if (ev.targetTouches) {
        $.each(ev.targetTouches, function (k, touch) {
          if (touch.identifier == me.currentTouch) {
            currentTouch = touch;
            return false;
          }
        });
        if (currentTouch) {
          me.onMouseMove(ev);
        } else {
          me.currentTouch = null;
          me.onMouseUp(ev);
        }
      }
    } catch (e) {
      me.contextPhantom.fillStyle = "red";
      me.contextPhantom.fillText(e, 20, 20);
    }
  },

  onTouchEnd : function (ev) {
    try {
      ev = ev.originalEvent;
      var me = this, currentTouch;
      if (me.currentTouch) {
        $.each(ev.targetTouches, function (k, touch) {
          if (touch.identifier == me.currentTouch) {
            currentTouch = touch;
            return false;
          }
        });
        if (!currentTouch) {
          me.onMouseUp(ev);
          me.currentTouch = null;
        }
      }
    } catch (e) {
      me.contextPhantom.fillStyle = "red";
      me.contextPhantom.fillText(e, 20, 20);
    }
  },

  onMouseDown : function (ev) {
    try {
      var me = this;
      me.updateMouse(ev);
      ev.preventDefault();
      ev.stopPropagation();
      var os = gb.utils.shallowClone(me.selection);
      $('#menu').removeClass('expand');
      if ($.isTouch || ev.button == 0) {
        gb.currentTool.mouseDown(me, me.mouse[0], me.mouse[1], ev);
      }
      if (!gb.utils.eqo(me.selection, os)) {
        me.refreshMenu();
      }
    } catch (e) {
      me.contextPhantom.fillStyle = "red";
      me.contextPhantom.fillText(e, 20, 20);
    }
  },

  onMouseMove : function (ev) {
    try {
      var me = this;
      me.updateMouse(ev);
      ev.preventDefault();
      ev.stopPropagation();
      var os = gb.utils.shallowClone(me.selection);
      if (!gb.utils.eqo(me.selection, os)) {
        me.refreshMenu();
      }
      gb.currentTool.mouseMove(me, me.mouse[0], me.mouse[1], ev);
    } catch (e) {
      me.contextPhantom.fillStyle = "red";
      me.contextPhantom.fillText(e, 20, 20);
    }
  },

  onMouseUp : function (ev) {
    var me = this;
    me.updateMouse(ev);
    ev.preventDefault();
    ev.stopPropagation();
    var os = gb.utils.shallowClone(me.selection);
    gb.currentTool.mouseUp(me, me.mouse[0], me.mouse[1], ev);
    if (!gb.utils.eqo(me.selection, os)) {
      me.refreshMenu();
    }
    var pos = $(me.canvas).offset();
  },

  nextId : function () {
    return "ent" + this.__nextId++;
  },

  nextLabel : function (label) {
    var la = label.split('');
    for (var i = label.length - 1; i >= 0; i--) {
      var code = label.charCodeAt(i);
      if (code == 90 || code == 122) {
        la[i] = String.fromCharCode(code - 25);
        if (i == 0) {
          la.push(la[i]);
          return la.join('');
        }
      } else {
        la[i] = String.fromCharCode(code + 1);
        break;
      }
    }
    return la.join('');
  },

  nextPointLabel : function () {
    var me = this, label = 'A', lastLabel;
    do {
      lastLabel = label;
      me.forEntities(function (k, v) {
        if (v.isPoint) {
          if (v.name == label) {
            label = me.nextLabel(label);
          }
        }
      });
    } while (label != lastLabel);
    return label;
  },

  nextLineLabel : function () {
    var me = this, label = 'a', lastLabel;
    do {
      lastLabel = label;
      me.forEntities(function (k, v) {
        if (!v.isPoint) {
          if (v.name == label) {
            label = me.nextLabel(label);
          }
        }
      });
    } while (label != lastLabel);
    return label;
  },

  installContext : function () {
    var me = this;
    me.scaleFactor = 1;
    me.panX = 0;
    me.panY = 0;
    me.context.transM2P = function (p) {
      if (p instanceof Array) {
        p = p.slice(0);
        var w = me.canvas.clientWidth, h = me.canvas.clientHeight;
        p[0] += me.panX;
        p[1] += me.panY;
        p[0] *= me.scaleFactor;
        p[1] *= me.scaleFactor;
        p[0] += w * 0.5;
        p[1] += h * 0.5;
        return p;
      } else
        return p * me.scaleFactor;
    };

    me.context.transP2M = function (p) {
      if (p instanceof Array) {
        p = p.slice(0);
        var w = me.canvas.clientWidth, h = me.canvas.clientHeight;
        p[0] -= w * 0.5;
        p[1] -= h * 0.5;
        p[0] /= me.scaleFactor;
        p[1] /= me.scaleFactor;
        p[0] -= me.panX;
        p[1] -= me.panY;
        return p;
      } else
        return p / me.scaleFactor;
    };

    me.contextPhantom.transM2P = function (p) {
      return me.context.transM2P(p);
    };

    me.contextPhantom.transP2M = function (p) {
      return me.context.transP2M(p);
    };

    me.context.getExtent = function () {
      var me = this, lt = me.transP2M([0, 0]), rb = me.transP2M([me.canvas.clientWidth, me.canvas.clientHeight]);
      return [lt[0], lt[1], rb[0], rb[1]];
    };

  },

  draw : function () {
    var me = this, context = me.context, phantom = me.contextPhantom, ext = context.getExtent();
    context.clearRect(ext[0], ext[1], ext[2] - ext[0], ext[3] - ext[1]);
    phantom.clearRect(0, 0, me.canvas.clientWidth, me.canvas.clientHeight);
    me.context.setTransform(
      this.scaleFactor, 0, 0, this.scaleFactor,
      me.canvas.clientWidth * 0.5 + this.panX * this.scaleFactor,
      me.canvas.clientHeight * 0.5 + this.panY * this.scaleFactor);
    me.forVisibles(function (k, v) {
      v.update();
      context.save();
      try {
        if (me.selection[v.id]) {
          v.drawSelected(context);
          if (v.showLabel) {
            v.drawLabel(phantom);
          }
        } else {
          if (v.hidden) {
            context.globalAlpha = 0.3;
          }
          v.draw(context);
        }
        if (v.showLabel) v.drawLabel(phantom);
      } finally {
        context.restore();
      }
    });

    if (me.hovering) {
      context.save();
      try {
        context.shadowBlur = 5;
        context.shadowColor = "#000";
        me.hovering.drawHovering(context);
        if (me.hovering.showLabel) {
          me.hovering.drawLabel(phantom);
        }
      } finally {
        context.restore();
      }
    }
  },

  hitTest : function (x, y, radius) {
    var me = this, po, pos, mini = [], minid = 1e300, min0, mind0, min1, mind1, sf = me.scaleFactor,
      temp, p, currd, d, res = {
      found : [],
      current : [ NaN, NaN ]
    };
    radius = radius || me.mouse[2];
    radius = me.context.transP2M(radius);
    sf = radius * radius;
    me.forVisibles(function (k, v) {
      if (v.hitTest(x, y, radius)) {
        p = v.getPosition(v.nearestArg(x, y));
        if (Geom.dist2(p, [x, y]) < sf) {
          res.found.push({
            obj : v,
            x : p[0],
            y : p[1]
          });
        }
      }
    });
    if (res.found.length == 0) {
      res.current[0] = x;
      res.current[1] = y;
      res.found = [];
    } else if (res.found.length == 1) {
      res.current[0] = res.found[0].x;
      res.current[1] = res.found[0].y;
      res.found = [ res.found[0].obj ];
    } else {
      po = null;
      $.each(res.found, function (k, v) {
        if (v.obj.isPoint) {
          po = v.obj;
          return false;
        }
        return undefined;
      });
      if (po) {
        res.found = [ po ];
        pos = po.getPosition();
        res.current[0] = pos[0];
        res.current[1] = pos[1];
      } else {
        min0 = null, mind0 = Infinity;
        min1 = null, mind1 = Infinity;
        $.each(res.found, function (k, curr) {
          currd = Geom.dist2([ x, y ], [ curr.x, curr.y ]);
          if (currd < mind1) {
            min1 = curr;
            mind1 = currd;
            if (mind1 < mind0) {
              temp = min0;
              min0 = min1;
              min1 = temp;
              temp = mind0;
              mind0 = mind1;
              mind1 = temp;
            }
          }
        });
        res.found = [ min0.obj, min1.obj ];
        mini = [NaN, NaN, 0];
        minid = Infinity;
        $.each(min0.obj.inters(min1.obj), function (k, v) {
          d = Geom.dist2(v, [ x, y ]);
          if (d < minid) {
            minid = d;
            mini = [v[0], v[1], k];
          }
        });
        res.current = mini;
      }
    }
    return res;
  },

  get : function (key) {
    var me = this;
    return me.lines[key] || me.points[key];
  },

  /**
   * @param {Geom} obj
   */
  add : function (obj) {
    var me = this;
    if (obj.isPoint) {
      me.points[obj.id] = obj;
    } else {
      me.lines[obj.id] = obj;
    }
    $.each(obj.getParents(), function (k, v) {
      v.__children[obj.id] = obj;
    });
    obj.dirt();
    obj.update(me);
  },

  /**
   * @param {Geom} obj
   */
  del : function (obj) {
    var me = this;
    if (obj.isPoint) {
      delete me.points[obj.id];
    } else {
      delete me.lines[obj.id];
    }

    if (me.selection[obj.id]) {
      delete me.selection[obj.id];
    }

    if (me.hovering == obj) {
      me.hovering = null;
    }
    $.each(obj.getParents(), function (k, v) {
      delete v.__children[obj.id];
    });
  },

  /**
   * @param {Object} json
   */
  load : function (json) {
    var me = this;
    me.points = {};
    me.lines = {};
    $.each(json.entities, function (k, v) {
      var obj = gb.geom[v.type](me);
      obj.load(v.data, me);
      me.add(obj);
    });
    me.title = json.title;
    me.__nextId = json.nextId;
    me.showHidden = json.showHidden;
    me.cmdStack = [];
    me.cmdStackPos = 0;
    me.draw();
    me.refreshMenu();
    me.selection = {};
    me.panX = json.panX || 0;
    me.panY = json.panY || 0;
    me.scaleFactor = json.scaleFactor || 1;
  },

  save : function () {
    var result = {
      title : this.title,
      nextId : this.__nextId,
      showHidden : this.showHidden,
      entities : [],
      panX : this.panX,
      panY : this.panY,
      scaleFactor : this.scaleFactor
    };
    this.topoFor(function (k, v) {
      result.entities.push({
        type : v.type(),
        data : v.save()
      });
    });
    if (window.localStorage) {
      window.localStorage[gb.localStoragePrefix + this.title] = gb.json.encode(result);
      var files = $.map(gb.docs, function (doc) {
        return doc.title;
      });
      window.localStorage[gb.localStoragePrefix + 'files'] = gb.json.encode(files);
    }
  },

  /**
   *
   * @param {function(string,Geom,GDoc)} callback
   */

  forEntities : function (callback) {
    var me = this;
    $.each(me.lines, function (k, v) {
      return callback(k, v, me);
    });
    $.each(me.points, function (k, v) {
      return callback(k, v, me);
    });
  },

  /**
   *
   * @param {function(string,Geom,GDoc)} callback
   */
  forVisibles : function (callback) {
    if (this.showHidden) {
      this.forEntities(callback);
      return;
    }
    var me = this;
    $.each(me.lines, function (k, v) {
      if (v.hidden) return true;
      return callback(k, v, me);
    });
    $.each(me.points, function (k, v) {
      if (v.hidden) return true;
      return callback(k, v, me);
    });
  },

  /**
   *
   * @param {function(string,Geom,GDoc)} callback
   */
  topoFor : function (callback) {
    var me = this, q, qi, curr, parent = {}, top = {};

    me.forEntities(function (k, v) {
      var pats = v.getParents();
      if ((parent[v.id] = pats.length) == 0) {
        top[v.id] = v;
      }
    });

    q = [];
    $.each(top, function (k, v) {
      q.push(v);
    });
    qi = 0;
    while (qi < q.length) {
      curr = q[qi++];
      callback(curr.id, curr, me);
      $.each(curr.__children, function (k, v) {
        parent[v.id]--;
        if (parent[v.id] == 0) {
          q.push(v);
        }
      });
    }
    return q;
  },

  run : function (cmd) {
    var me = this;
    if (cmd.canDo(me)) {
      cmd.exec(me);
      me.cmdStack.length = me.cmdStackPos++;
      me.cmdStack.push(cmd);
      me.draw();
      me.refreshMenu();
      me.save();
    }
  },

  canUndo : function () {
    return this.cmdStackPos > 0;
  },

  undo : function () {
    var me = this, cmd;
    if (me.canUndo()) {
      cmd = me.cmdStack[me.cmdStackPos - 1];
      cmd.undo(me);
      --me.cmdStackPos;
      me.draw();
      me.refreshMenu();
      me.save();
    }
  },

  canRedo : function () {
    return this.cmdStackPos < this.cmdStack.length;
  },

  lastCommand : function () {
    return this.cmdStack[this.cmdStackPos - 1];
  },

  redo : function () {
    var me = this, cmd;
    if (me.canRedo()) {
      cmd = me.cmdStack[me.cmdStackPos];
      cmd.redo(me);
      me.cmdStackPos++;
      me.draw();
      me.refreshMenu();
      me.save();
    }
  },

  refreshMenu : function () {
    var me = this;
    $('li.sub-item').each(function (k, item) {
      if (!item.action.isEnabled || item.action.isEnabled(me)) {
        $(item).removeClass('disabled');
      } else {
        $(item).addClass('disabled');
      }
    });
  },

  zoom : function (factor, center) {
    center = center || [0, 0];
    this.context.scale(factor, factor);
    this.panX += (center[0] - this.canvas.clientWidth * 0.5) * (1 / factor - 1) / this.scaleFactor;
    this.panY += (center[1] - this.canvas.clientHeight * 0.5) * (1 / factor - 1) / this.scaleFactor;
    this.scaleFactor *= factor;
    this.draw();
    this.save();
  },

  zoomIn : function () {
    this.zoom(1.1, [0, 0]);
  },

  zoomOut : function () {
    this.zoom(1 / 1.1, [0, 0]);
  },

  zoomRestore : function () {
    this.scaleFactor = 1;
    this.panX = 0;
    this.panY = 0;
    this.draw();
    this.save();
  },

  /**
   * @param {Number} dx
   * @param {Number} dy
   */
  pan : function (dx, dy) {
    this.panX += dx / this.scaleFactor;
    this.panY += dy / this.scaleFactor;
    this.draw();
    this.save();
  },

  active : function () {
    var me = this;
    $('canvas').removeClass('active');
    $('#page-header li').removeClass('active');
    $(me.canvas).add(me.canvasPhantom).addClass('active');
    $(me.pageHeader).addClass('active');
    gb.currentDoc = this;
    if (window.localStorage)
      window.localStorage[gb.localStoragePrefix + 'currentDocument'] = this.title;
    me.resize($('#area').width(), $('#area').height());
  },

  resize : function (w, h) {
    var me = this, context = me.context;
    $(me.canvas).add(me.canvasPhantom).attr('width', w).attr('height', h);
    context.translate(me.panX + w * 0.5, me.panY + h * 0.5);
    context.scale(me.scaleFactor, me.scaleFactor);
    me.forEntities(function (k, v) {
      v.dirt();
    });
    me.draw();
  },

  rename : function (newName) {
    if (window.localStorage)
      delete window.localStorage[this.title];
    this.title = newName;
    this.save();
  }
};
gb.menu = {};
gb.menu.file = {
  text : '<span class="ud">F</span>ile',
  items : [ 'news' ], //, 'down', '-', 'prop', 'help' ],
  news : {
    text : 'New Sketch',
    shortcutKey : new ShortcutKey(78, ShortcutKey.CTRL, 'gb.menu.file.news'),
    run : function (gdoc) {
      var doc = new GDoc();
      doc.active();
      doc.save();
    }
  }// ,
//  down : {
//    shortcutKey : new ShortcutKey(83, ShortcutKey.CTRL, 'gb.menu.file.down'),
//    text : 'Download...'
//  },
//  prop : {
//    shortcutKey : new ShortcutKey(188, ShortcutKey.CTRL, 'gb.menu.file.props'),
//    text : 'Properties'
//  },
//  help : {
//    shortcutKey : new ShortcutKey(112, 0, 'gb.menu.file.help'),
//    text : 'Help...'
//  }
};

gb.menu.edit = {
  text : '<span class="ud">E</span>dit',
  items : [ 'undo', 'redo', '-', 'sela', '-', 'del' ],
  undo : {
    text : 'Undo',
    shortcutKey : new ShortcutKey(90, ShortcutKey.CTRL, 'gb.menu.edit.undo'),
    isEnabled : function (gdoc) {
      return gdoc.canUndo();
    },
    run : function (gdoc) {
      gdoc.undo();
    }
  },
  redo : {
    text : 'Redo',
    shortcutKey : new ShortcutKey(90, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.edit.redo'),
    isEnabled : function (gdoc) {
      return gdoc.canRedo();
    },
    run : function (gdoc) {
      gdoc.redo();
    }
  },

  sela : {
    text : 'Select all',
    shortcutKey : new ShortcutKey(65, ShortcutKey.CTRL, 'gb.menu.edit.sela'),
    run : function (gdoc) {
      gdoc.forVisibles(function (k, v) {
        gdoc.selection[k] = v;
      });
      gdoc.draw();
    }
  },

  del : {
    text : 'Delete',
    shortcutKey : [new ShortcutKey(8, 0, 'gb.menu.edit.del'), new ShortcutKey(46, 0, 'gb.menu.edit.del')],
    isEnabled : function (gdoc) {
      var any = false;
      $.each(gdoc.selection, function () {
        any = true;
        return false;
      });
      return any;
    },
    run : function (gdoc) {
      gdoc.run(new DeleteCommand(gdoc.selection));
    }
  }
};

gb.menu.disp = {
  text : '<span class="ud">D</span>isplay',
  items : ['sha', 'hide', 'unhide', '-', 'shl', 'hil', '-', 'zi', 'zo', 'zr'],
  zi : {
    text : 'Zoom in',
    shortcutKey : new ShortcutKey(187, ShortcutKey.CTRL, 'gb.menu.disp.zi'),
    run : function (gdoc) {
      gdoc.zoomIn();
    }
  },
  zo : {
    text : 'Zoom out',
    shortcutKey : new ShortcutKey(189, ShortcutKey.CTRL, 'gb.menu.disp.zo'),
    run : function (gdoc) {
      gdoc.zoomOut();
    }
  },
  zr : {
    text : 'Zoom restore',
    shortcutKey : new ShortcutKey(48, ShortcutKey.CTRL, 'gb.menu.disp.zr'),
    run : function (gdoc) {
      gdoc.zoomRestore();
    }
  },
  sha : {
    text : 'Show all hidden',
    show : false,
    isEnabled : function (gdoc) {
      this.show = gdoc.showHidden;
      this.text(this.show ? 'Hide hiden' : 'Show all hidden');
      return true;
    },
    /**
     * @param {GDoc} gdoc
     */
    run : function (gdoc) {
      gdoc.showHidden = (this.show = !this.show);
      this.text(this.show ? 'Hide hiden' : 'Show all hidden');
      gdoc.draw();
    }
  },
  shl : {
    text : 'Show label',
    /**
     *
     * @param {GDoc} gdoc
     */
    isEnabled : function (gdoc) {
      this.cmd = new ShowLabelCommand(gdoc.selection, true);
      return this.cmd.canDo(gdoc);
    },
    /**
     *
     * @param {GDoc} gdoc
     */
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  },
  hil : {
    text : 'Hide label',
    /**
     *
     * @param {GDoc} gdoc
     */
    isEnabled : function (gdoc) {
      this.cmd = new ShowLabelCommand(gdoc.selection, false);
      return this.cmd.canDo(gdoc);
    },
    /**
     *
     * @param {GDoc} gdoc
     */
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  },
  hide : {
    text : 'Hide',
    shortcutKey : new ShortcutKey(72, ShortcutKey.CTRL, 'gb.menu.disp.hide'),
    run : function (gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, true));
    }
  },
  unhide : {
    text : 'Unhide',
    shortcutKey : new ShortcutKey(72, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.disp.unhide'),
    run : function (gdoc) {
      gdoc.run(new HideCommand(gdoc.selection, false));
    }
  }
};

gb.menu.cons = {
  text : '<span class="ud">C</span>onstruct',
  items : [ 'poo', 'mp', 'inters', '-', 'perp', 'para', 'anb', '-', 'loc' ],
  line : {
    text : 'Line',
    shortcutKey : new ShortcutKey(80, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.poo')
  },

  poo : {
    text : 'Point on Object',
    shortcutKey : new ShortcutKey(80, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.poo'),
    isEnabled : function (gdoc) {
      var any = false, anyP = false;
      $.each(gdoc.selection, function (k, v) {
        any = true;
        if (v.isPoint)
          anyP = true;
      });
      return any && !anyP;
    },
    run : function (gdoc) {
      $.each(gdoc.selection, function (k, v) {
        var randPoint = v.randPoint(),
          cmd = new ConstructPoOCommand(v, v.nearestArg(randPoint[0], randPoint[1]));
        gdoc.run(cmd);
      });
    }
  },
  mp : {
    text : 'Midpoint',
    shortcutKey : new ShortcutKey(77, ShortcutKey.CTRL, 'gb.menu.cons.mp'),
    isEnabled : function (gdoc) {
      var anyLine = false, allLine = true;
      $.each(gdoc.selection, function (k, v) {
        if (v.type() == 'gli')
          anyLine = true;
        else {
          allLine = false;
          return false;
        }
      });
      return anyLine && allLine;
    },
    run : function (gdoc) {
      if (!this.isEnabled(gdoc))
        return false;
      $.each(gdoc.selection, function (k, v) {
        var cmd = new ConstructMidpointCommand(v);
        gdoc.run(cmd);
      });
    }
  },
  perp : {
    text : 'Perpendical Line',
    isEnabled : function (gdoc) {
      var points = 0, lines = 0;
      $.each(gdoc.selection, function (k, v) {
        if (v.isPoint) {
          points++;
          if (points > 1)
            return false;
        } else if (v.isLine) {
          lines++;
        } else {
          points = 2;
          return false;
        }
      });
      return lines > 0 && points == 1;
    },
    run : function (gdoc) {
      var lines = [], po = null;
      $.each(gdoc.selection, function (k, v) {
        if (v.isPoint) {
          po = v;
        } else if (v.isLine) {
          lines.push(v);
        }
      });
      $.each(lines, function (k, v) {
        var cmd = new ConstructPerpLineCommand(po, v);
        gdoc.run(cmd);
      });
    }
  },
  para : {
    text : 'Parallel Line',
    isEnabled : function (gdoc) {
      var points = 0, lines = 0;
      $.each(gdoc.selection, function (k, v) {
        if (v.isPoint) {
          points++;
          if (points > 1)
            return false;
        } else {
          lines++;
        }
      });
      return lines > 0 && points == 1;
    },
    run : function (gdoc) {
      var lines = [], po = null;
      $.each(gdoc.selection, function (k, v) {
        if (v.isPoint) {
          po = v;
        } else if (v.isLine) {
          lines.push(v);
        }
      });
      $.each(lines, function (k, v) {
        var cmd = new ConstructParaLineCommand(po, v);
        gdoc.run(cmd);
      });
    }
  },
  anb : {
    text : 'Angle Bisector',
    isEnabled : function (gdoc) {
      var sel = gb.utils.m2a(gdoc.selection);
      if (sel.length != 3) return false;
      this.cmd = new ConstructAngleBisector(sel[0], sel[2], sel[1]);
      return this.cmd.canDo(gdoc);
    },
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  },
  loc : {
    // ConstructLocusCommand
    text : 'Locus',
    shortcutKey : new ShortcutKey(76, ShortcutKey.CTRL, 'gb.menu.cons.loc'),
    isEnabled : function (gdoc) {
      var poo = null, target = null;
      $.each(gdoc.selection, function (k, v) {
        if (v.type() == 'poo' && !poo)
          poo = v;
        else if (v.isPoint)
          target = v;
      });
      if (!poo)
        return false;
      if (!target)
        return false;
      this.cmd = new ConstructLocusCommand(poo, target);
      if (!!this.cmd.canDo())
        return true;
      if (target.type() == 'poo') {
        this.cmd = new ConstructLocusCommand(target, poo);
        return this.cmd.canDo();
      } else
        return false;
    },
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  },
  inters : {
    text : 'Intersections',
    shortcutKey : new ShortcutKey(73, ShortcutKey.CTRL | ShortcutKey.SHIFT, 'gb.menu.cons.inters'),
    isEnabled : function (gdoc) {
      var l1 = null, l2 = null;
      $.each(gdoc.selection, function (k, v) {
        if (!v.isPoint)
          if (l1 == null)
            l1 = v;
          else if (l2 == null)
            l2 = v;
      });
      if (l1 == null) return false;
      if (l2 == null) return false;
      this.cmd = new ConstructIntersectionsCommand(l1, l2);
      return this.cmd.canDo();
    },
    run : function (gdoc) {
      gdoc.run(this.cmd);
    }
  }
};
gb.menu.trans = {
  text : '<span class="ud">T</span>ransform',
  items : []
};
gb.menu.meas = {
  text : '<span class="ud">M</span>easure',
  items : []
};
gb.menu.numb = {
  text : '<span class="ud">N</span>umber',
  items : []
};
gb.menu.grap = {
  text : '<span class="ud">G</span>raph',
  items : []
};
gb.menu.items = [ 'file', 'edit', 'disp', 'cons'];/**
 * @constructor
 * @class Geom
 * @param {GDoc} document
 * @param {Array} parents
 * @param {Array}params
 */
function Geom(document, parents, params) {
  if (document) {
    this.document = document;
    this.id = document.nextId();
    this.__parents = parents || [];
    this.__params = params || [];
    this.__children = {};
  }
}

Geom.cross = function (p1, p2, p3) {
  return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
};

Geom.dist2 = function (p1, p2) {
  var dx = p1[0] - p2[0], dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
};

Geom.projArg = function (p1, p2, p3) {
  var x = p3[0], y = p3[1], k, ik;
  if (Math.abs(p1[1] - p2[1]) < 1e-10) {
    return (x - p1[0]) / (p2[0] - p1[0]);
  } else if (Math.abs(p1[0] - p2[0]) < 1e-10) {
    return (y - p1[1]) / (p2[1] - p1[1]);
  }
  k = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  ik = 1 / k;
  x = (y - p1[1]) + k * p1[0] + x * ik;
  x /= ik + k;
  return (x - p1[0]) / (p2[0] - p1[0]);
};

/**
 * @constructor
 * @class GIC
 * @param {Object} desc
 * @param {GBPoO} poo
 * @param {GBAbstractPoint} target
 * @param {Object} ance
 */
function GIC(desc, poo, target, ance) {
  this.desc = desc;
  this.poo = poo;
  this.target = target;
  this.ance = ance;
}

/**
 * Create a function to deduce target position from poo (if presented)
 * @param {GDoc} gdoc
 * @param {GBPoO} poo
 * @param {GBAbstractPoint} target
 * @return {Function}
 */
Geom.calculas = function (gdoc, poo, target) {
  poo = poo || target;
  var desc = gb.utils.a2m(poo.descendants()),
    ance = gb.utils.a2m(target.ancestors()),
    context = new GIC(desc, poo, target, ance),
    text = ['(function(gdoc){ var revision = 0; '];
  gdoc.topoFor(function (k, v) {
    if (context.ance[v.id]) {
      text.push(v.getInstruction(context));
    }
  });
  text.push('return (function(___arg) {');
  if (poo) {
    text.push(poo.id + '_arg = ___arg; revision++; ');
  }
  text.push('return ');
  text.push(target.getInstructionRef('', context));
  text.push(';});})');
  return text.join('');
};

Geom.prototype = {
  color : '#000',
  hidden : false,
  size : 4,
  name : '',
  __parents : null,
  __params : null,
  __children : null,
  __dirty : true,

  draw : function (context) {

  },

  drawHovering : function (context) {

  },

  drawSelected : function (context) {

  },

  hitTest : function (x, y, radius) {
    return false;
  },

  inters : function () {
    return [];
  },

  crossTest : function (l, t, r, b) {
    return false;
  },

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */
  nearestArg : function (x, y) {
    throw 'nearestArg(x,y) not implemented';
    return 0;
  },

  dragInvolve : function () {
    return [ this ];
  },

  drag : function (from, to) {

  },

  type : function () {
    throw 'type() not implemented';
  },

  /**
   *
   * @param gdoc
   * @returns {Object}
   */
  save : function (gdoc) {
    var me = this;
    return {
      id : me.id,
      color : me.color,
      hidden : me.hidden,
      size : me.size,
      name : me.name,
      showLabel : me.showLabel,
      labelX : me.labelX,
      labelY : me.labelY,
      labelArg : me.labelArg,
      parents : $.map(me.__parents, function (v) {
        return v.id;
      }),
      params : me.__params.slice(0)
    };
  },

  /**
   * @param {Object}
    *          json
   * @param {GDoc}
    *          gdoc
   */
  load : function (json, gdoc) {
    var me = this;
    me.document = gdoc;
    me.id = json.id;
    me.name = json.name;
    me.color = json.color || me.color;
    me.hidden = json.hidden || me.hidden;
    me.size = json.size || me.size;
    me.__parents = $.map(json.parents, function (v) {
      return gdoc.get(v);
    });
    me.__params = json.params.slice(0);
    me.dirt();
  },

  getParents : function () {
    return this.__parents;
  },

  /**
   *
   * @param index
   * @returns {Geom}
   */
  getParent : function (index) {
    return this.__parents[index];
  },

  setParent : function (index, value) {
    this.__parents[index] = value;
    this.dirt();
  },

  getParam : function (index) {
    return this.__params[index];
  },

  setParam : function (index, value) {
    this.__params[index] = value;
    this.dirt();
  },

  getPosition : function (arg) {
    throw 'getPosition(arg) not implemented';
  },

  randPoint : function () {
    throw 'randPoint() not implemented';
  },

  dirt : function () {
    if (this.__dirty) return;
    this.__dirty = true;
    $.each(this.__children, function (k, v) {
      v.dirt();
    });
  },

  update : function () {
    if (!this.__dirty) return;
    $.each(this.__parents, function (k, v) {
      v.update();
    });
    this.__dirty = false;
  },

  ancestors : function () {
    var result = {}, q = [this], qi = 0, curr;
    while (qi < q.length) {
      curr = q[qi++];
      $.each(curr.__parents, function (k, v) {
        if (!result[v.id]) {
          result[v.id] = v;
          q.push(v);
        }
      });
    }
    return q;
  },

  descendants : function () {
    var result = {}, q = [this], qi = 0, curr;
    while (qi < q.length) {
      curr = q[qi++];
      $.each(curr.__children, function (k, v) {
        if (!result[v.id]) {
          result[v.id] = v;
          q.push(v);
        }
      });
    }
    return q;
  },

  getInstruction : function () {
    throw 'getInstruction() not implemented';
  },

  getInstructionRef : function (arg, isStatic) {
    throw 'getInstructionRef(arg, isStatic) not implemented';
  },

  getIntersInstruction : function (obj, isStatic1, isStatic2) {
    throw 'getIntersInstruction(obj, isStatic1, isStatic2) not implemented';
  },

  getIntersInstructionRef : function (obj, isStatic1, isStatic2) {

  },

  legalArgInstructionRef : function (isStatic) {
    throw 'legalArgInstructionRef(isStatic) not implemented';
  },

  isClosed : function () {
    return false;
  },

  phantom : function () {
    return false;
  },

  sector : function () {

  },

  getName : function () {
    if (this.name == '') {
      if (this.isPoint) {
        this.name = this.document.nextPointLabel();
      } else {
        this.name = this.document.nextLineLabel();
      }
      this.dirt();
    }
    return this.name;
  },

  setName : function (name) {
    this.name = name;
    this.dirt();
  }
};

/**
 * @namespace gb.geom
 */
gb.geom = {};

/**
 * @private
 */
gb.geom.cc = function (klass) {
  function psklass() {
  }

  psklass.prototype = new klass();
  return function () {
    var inst = new psklass();
    klass.apply(inst, arguments);
    return inst;
  };
};

/**
 * @param {Function} klass
 */
gb.geom.reg = function (klass) {
  gb.geom[(new klass()).type()] = gb.geom.cc(klass);
};/**
 * @class LabeledGeom
 * @constructor
 */
function LabeledGeom() {
  Geom.apply(this, arguments);
}

LabeledGeom.prototype = new Geom();

LabeledGeom.prototype.isLabeled = true;
LabeledGeom.prototype.fontSize = 18;
LabeledGeom.prototype.showLabel = false;
LabeledGeom.prototype.labelX = 10;
LabeledGeom.prototype.labelY = 10;
LabeledGeom.prototype.labelArg = 0;

LabeledGeom.prototype.drawLabel = function (context, hovering) {
  var p = context.transM2P(this.getPosition(this.labelArg)), m;
  p[0] += this.labelX;
  p[1] += this.labelY;
  context.save();
  context.font = this.fontSize + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  m = context.measureText(this.name);
  context.fillStyle = hovering ? "#f00" : "#000";
  context.fillText(this.name, p[0] - m.width * 0.5, p[1] - this.fontSize * 0.5);
  context.restore();
};

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Number} dx
 * @param {Number} dy
 */
LabeledGeom.prototype.dragLabel = function (context, dx, dy) {
  this.dirt();
  var p = context.transM2P(this.getPosition(this.labelArg)), q, d;
  p[0] += this.labelX + dx;
  p[1] += this.labelY + dy;
  p = context.transP2M(p);
  q = context.transM2P(this.getPosition(this.labelArg = this.nearestArg(p[0], p[1])));
  p = context.transM2P(p);
  d = Math.sqrt(Geom.dist2(p, q));
  p[0] -= q[0];
  p[1] -= q[1];
  if (d > this.fontSize) {
    p[0] *= this.fontSize / d;
    p[1] *= this.fontSize / d;
  }
  this.labelX = p[0];
  this.labelY = p[1];
};

LabeledGeom.prototype.labelHistTest = function (context, x, y) {
  context.save();
  var p = context.transM2P(this.getPosition(this.labelArg)), q = context.transM2P([x, y]), m;
  context.font = this.fontSize + 'px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  m = context.measureText(this.name);
  context.restore();
  p[0] += this.labelX - m.width * 0.5;
  p[1] += this.labelY - this.fontSize * 0.5;
  return p[0] < q[0] && q[0] < p[0] + m.width && p[1] < q[1] && q[1] < p[1] + this.fontSize;
};

/**
 *
 * @param {GDoc} gdoc
 * @returns {Object}
 */
LabeledGeom.prototype.save = function (gdoc) {
  var me = this, json = Geom.prototype.save.apply(this, [gdoc]);
  json.showLabel = me.showLabel;
  json.labelX = me.labelX;
  json.labelY = me.labelY;
  json.labelArg = me.labelArg;
  json.fontSize = me.fontSize;
  return json;
};

/**
 * @param {Object} json
 * @param {GDoc} gdoc
 */
LabeledGeom.prototype.load = function (json, gdoc) {
  var me = this;
  me.fontSize = json.fontSize || me.fontSize;
  me.showLabel = json.showLabel || me.showLabel;
  me.labelX = json.labelX || me.labelY;
  me.labelY = json.labelY || me.labelY;
  me.labelArg = json.labelArg || me.labelArg;
  Geom.prototype.load.apply(this, [json, gdoc]);
};function GBAbstractPoint() {
  LabeledGeom.apply(this, arguments);
}

GBAbstractPoint.prototype = new LabeledGeom();
GBAbstractPoint.prototype.isPoint = true;
GBAbstractPoint.prototype.color = '#F00';
GBAbstractPoint.prototype.draw = function (context) {
  var pos = this.getPosition();
  if (!isNaN(pos[0]) && !isNaN(pos[0])) {
    context.beginPath();
    context.arc(pos[0], pos[1], context.transP2M(3), 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#000";
    context.stroke();
  }
};

GBAbstractPoint.prototype.drawSelected = function (context) {
  var pos = this.getPosition();
  if (!isNaN(pos[0]) && !isNaN(pos[0])) {
    this.draw(context);
    context.beginPath();
    context.arc(pos[0], pos[1], context.transP2M(6), 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#339";
    context.stroke();
  }

};

GBAbstractPoint.prototype.drawHovering = function (context) {
  var pos = this.getPosition();
  if (!isNaN(pos[0]) && !isNaN(pos[0])) {
    context.beginPath();
    context.arc(pos[0], pos[1], context.transP2M(3), 0, Math.PI * 2, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#F00";
    context.stroke();
  }
};

GBAbstractPoint.prototype.hitTest = function (x, y, radius) {
  var pos = this.getPosition(),
    dx = pos[0] - x,
    dy = pos[1] - y;
  return dx * dx + dy * dy < radius * radius;
};

GBAbstractPoint.prototype.crossTest = function (l, t, r, b) {
  var pos = this.getPosition();
  return l < pos[0] && pos[0] < r && t < pos[1] && pos[1] < b;
};

GBAbstractPoint.prototype.nearestArg = function (x, y) {
  return 0;
};

GBAbstractPoint.prototype.legalArg = function (arg) {
  return arg == 0;
};

GBAbstractPoint.prototype.update = function () {
  if (this.__dirty) {
    this.cache = this.getPosition();
    Geom.prototype.update.apply(this, []);
  }
};

GBAbstractPoint.prototype.getInstructionRefStatic = function () {
  this.update();
  var pos = this.getPosition();
  return '[' + pos[0] + ',' + pos[1] + ']';
};/**
 * @class GBAbstractLine
 * @extends LabeledGeom
 * @param {GDoc} gdoc
 * @param {GBAbstractPoint} gpo1
 * @param {GBAbstractPoint} gpo2
 */
function GBAbstractLine(gdoc, gpo1, gpo2) {
  LabeledGeom.apply(this, [ gdoc, [ gpo1, gpo2 ] ]);
}

GBAbstractLine.prototype = new LabeledGeom();
GBAbstractLine.prototype.color = '#008';
GBAbstractLine.prototype.isLine = true;

GBAbstractLine.prototype.draw = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
    args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
    ps = this.adjustPosition(args);
  if (!isNaN(ps[0][0]) && !isNaN(ps[0][1]) && !isNaN(ps[1][0]) && !isNaN(ps[1][1])) {
    context.moveTo(ps[0][0], ps[0][1]);
    context.lineTo(ps[1][0], ps[1][1]);
    context.closePath();
    context.lineWidth = context.transP2M(3);
    context.strokeStyle = this.color;
    context.stroke();
  }
};

GBAbstractLine.prototype.drawSelected = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
    args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
    ps = this.adjustPosition(args);
  if (!isNaN(ps[0][0]) && !isNaN(ps[0][1]) && !isNaN(ps[1][0]) && !isNaN(ps[1][1])) {
    context.moveTo(ps[0][0], ps[0][1]);
    context.lineTo(ps[1][0], ps[1][1]);
    context.closePath();
    context.lineWidth = context.transP2M(8);
    context.strokeStyle = "#44c";
    context.stroke();
    context.lineWidth = context.transP2M(6);
    context.strokeStyle = "#fff";
    context.stroke();
    this.draw(context);
  }
};

GBAbstractLine.prototype.drawHovering = function (context) {
  context.beginPath();
  var extent = context.getExtent(),
    args = this.crossArg(extent[0] - 5, extent[1] - 5, extent[2] + 5, extent[3] + 5),
    ps = this.adjustPosition(args);
  if (!isNaN(ps[0][0]) && !isNaN(ps[0][1]) && !isNaN(ps[1][0]) && !isNaN(ps[1][1])) {
    context.moveTo(ps[0][0], ps[0][1]);
    context.lineTo(ps[1][0], ps[1][1]);
    context.closePath();
    context.lineWidth = context.transP2M(4);
    context.strokeStyle = "#F00";
    context.stroke();
  }
};

GBAbstractLine.prototype.hitTest = function (x, y, radius) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
    fx = p1[0], tx = p2[0], fy = p1[1], ty = p2[1], t, c, dx, dy;

  if (fx > tx) {
    t = fx;
    fx = tx;
    tx = t;
  }

  if (fy > ty) {
    t = fy;
    fy = ty;
    ty = t;
  }

  c = Geom.cross(p1, [ x, y ], p2);
  c = c * c;
  dx = p1[0] - p2[0];
  dy = p1[1] - p2[1];
  if (c > radius * radius * (dx * dx + dy * dy))
    return false;

  return this.legalArg(Geom.projArg(p1, p2, [ x, y ]));
};

GBAbstractLine.prototype.crossTest = function (l, t, r, b) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
    la, ra, ta, ba, li, ri, ti, bi, args;
  if (p1[1] == p2[1]) {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = this.adjustArg([ la, ra ]);
    if (args[0] == args[1])
      return false;
    return t < p1[1] && p1[1] < b;
  } else if (p1[0] == p2[0]) {
    ta = (t - p1[1]) / (p2[1] - p1[1]);
    ba = (b - p1[1]) / (p2[1] - p1[1]);
    args = [ this.adjustArg(ta), this.adjustArg(ba) ];
    if (args[0] == args[1])
      return false;
    return l < p1[0] && p1[0] < r;
  } else {
    la = (l - p1[0]) / (p2[0] - p1[0]);
    ra = (r - p1[0]) / (p2[0] - p1[0]);
    args = [ this.adjustArg(la), this.adjustArg(ra) ];
    if (args[0] == args[1])
      return false;
    li = (p2[1] - p1[1]) * args[0] + p1[1];
    ri = (p2[1] - p1[1]) * args[1] + p1[1];
    if (t < li && li < b)
      return true;
    if (t < ri && ri < b)
      return true;

    ta = (t - p1[1]) / (p2[1] - p1[1]);
    ba = (b - p1[1]) / (p2[1] - p1[1]);
    args = [ this.adjustArg(ta), this.adjustArg(ba) ];
    if (args[0] == args[1])
      return false;
    ti = (p2[0] - p1[0]) * args[0] + p1[0];
    bi = (p2[0] - p1[0]) * args[1] + p1[0];
    return l < ti && ti < r || l < bi && bi < r;
  }
  if (this.adjustArg(args[0]) == this.adjustArg(args[1]))
    return false;
};


GBAbstractLine.prototype.projection = function (x, y) {
  var p1 = this.__getPosition(0),
    p2 = this.__getPosition(1);
  return Geom.projArg(p1, p2, [ x, y ]);
};

GBAbstractLine.prototype.nearestArg = function (x, y) {
  return this.adjustArg(this.projection(x, y));
};

GBAbstractLine.prototype.inters = function (obj) {
  if (obj.isLine)
    return this.intersLine(obj);
  else if (obj.isCircle)
    return this.intersCircle(obj);
  else
    return [];
};

GBAbstractLine.prototype.intersLine = function (line) {
  var p1 = this.__getPosition(0),
    p2 = this.__getPosition(1),
    p3 = line.__getPosition(0),
    p4 = line.__getPosition(1),
    c1, c2, c3, c4, a1, a2;

  c1 = Geom.cross(p3, p1, p2);
  c2 = Geom.cross(p4, p1, p2);
  if (c1 == c2) return [
    [NaN, NaN]
  ];
  c3 = Geom.cross(p1, p3, p4);
  c4 = Geom.cross(p2, p3, p4);
  if (c3 == c4) return [
    [NaN, NaN]
  ];
  a1 = c3 / (c3 - c4);
  a2 = c1 / (c1 - c2);
  if (this.legalArg(a1) && line.legalArg(a2)) {
    return [ this.getPosition(a1) ];
  } else
    return [
      [ NaN, NaN ]
    ];
};

/**
 *
 * @param {GBCircle} circ
 * @returns {Array}
 */
GBAbstractLine.prototype.intersCircle = function (circ) {
  var prop = circ.getParent(0).getPosition(),
    r2 = Geom.dist2(prop, circ.getParent(1).getPosition()),
    p1 = this.__getPosition(0), p2 = this.__getPosition(1),
    arg = Geom.projArg(p1, p2, prop),
    mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ],
    l = r2 - Geom.dist2(prop, mp),
    dist2 = Math.sqrt(l) / this.length(),
    res = [];
  if (Math.abs(l) < 1e-10)
    dist2 = 0;
  if (this.legalArg(arg - dist2)) {
    res.push(this.getPosition(arg - dist2));
  } else {
    res.push([ NaN, NaN ]);
  }

  if (this.legalArg(arg + dist2)) {
    res.push(this.getPosition(arg + dist2));
  } else {
    res.push([ NaN, NaN ]);
  }
  return res;
};

GBAbstractLine.prototype.type = function () {
  return "gli";
};

GBAbstractLine.prototype.adjustPosition = function (args) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1);
  args[0] = this.adjustArg(args[0]);
  args[1] = this.adjustArg(args[1]);
  return [
    [ p1[0] + (p2[0] - p1[0]) * args[0], p1[1] + (p2[1] - p1[1]) * args[0] ],
    [ p1[0] + (p2[0] - p1[0]) * args[1], p1[1] + (p2[1] - p1[1]) * args[1] ]
  ];
};

GBAbstractLine.prototype.crossArg = function (l, t, r, b) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1),
    amin, amax, aminx, amaxx, aminy, amaxy, te;
  if (p1[0] == p2[0]) {
    amin = (b - p1[1]) / (p2[1] - p1[1]);
    amax = (t - p1[1]) / (p2[1] - p1[1]);
    if (amin > amax) {
      te = amin;
      amin = amax;
      amax = te;
    }
  } else if (p1[1] == p2[1]) {
    amin = (l - p1[0]) / (p2[0] - p1[0]);
    amax = (r - p1[0]) / (p2[0] - p1[0]);
    if (amin > amax) {
      te = amin;
      amin = amax;
      amax = te;
    }
  } else {
    aminx = (l - p1[0]) / (p2[0] - p1[0]);
    amaxx = (r - p1[0]) / (p2[0] - p1[0]);
    if (aminx > amaxx) {
      te = aminx;
      aminx = amaxx;
      amaxx = te;
    }
    aminy = (b - p1[1]) / (p2[1] - p1[1]);
    amaxy = (t - p1[1]) / (p2[1] - p1[1]);
    if (aminy > amaxy) {
      te = aminy;
      aminy = amaxy;
      amaxy = te;
    }

    amin = Math.max(aminx, aminy);
    amax = Math.min(amaxx, amaxy);
  }
  return [ amin, amax ];
};

GBAbstractLine.prototype.getPosition = function (arg) {
  var p1 = this.__getPosition(0), p2 = this.__getPosition(1);
  arg = this.adjustArg(arg);
  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
};

GBAbstractLine.prototype.__getPosition = function (arg) {
  throw '__gePosition(arg) not implemented';
};

GBAbstractLine.prototype.randPoint = function () {
  while (true) {
    var arg = Math.nrand() + 0.5;
    if (this.legalArg(arg)) {
      return this.__getPosition(arg);
    }
  }
};


GBAbstractLine.prototype.getInstructionRefStatic = function (arg) {
  var p1 = this.__getPosition(0);
  var p2 = this.__getPosition(1);
  if (typeof arg === 'number')
    return '[' + (p1[0] + (p2[0] - p1[0]) * arg) + ',' + (p1[1] + (p2[1] - p1[1]) * arg) + ']';
  else return '[' + p1[0] + (p2[0] == p1[0] ? '' : '+' + (p2[0] - p1[0]) + '*' + arg) + ',' +
    p1[1] + (p2[1] == p1[1] ? '' : '+' + (p2[1] - p1[1]) + '*' + arg) + ']';
},

  GBAbstractLine.prototype.getIntersInstruction = function (obj, context, idx, intId) {
    if (obj.isLine) {
      if (idx != 0) return '[NaN, NaN]';
      return this.getIntersInstructionLL(obj, context, idx, intId);
    } else {
      if (idx >= 2) return '[NaN, NaN]';
      return this.getIntersInstructionLC(obj, context, idx, intId);
    }
  };

GBAbstractLine.prototype.getIntersInstructionLL = function (obj, context, idx, intId) {
  return ['function () { ' ,
    'if (' + intId + '_revision == revision) return ' + intId + '_cache;',
    intId + '_revision = revision; ',
    'var p1 = ' + this.getInstructionRef(0, context) + ';' ,
    'var p2 = ' + this.getInstructionRef(1, context) + ';' ,
    'var p3 = ' + obj.getInstructionRef(0, context) + ';' ,
    'var p4 = ' + obj.getInstructionRef(1, context) + ';' ,
    'var c1 = Geom.cross(p3, p1, p2), c2 = Geom.cross(p4, p1, p2);' ,
    'if (Math.abs(c1 - c2) < 1e-10) return ' + intId + '_cache = [NaN, NaN];' ,
    'var c3 = Geom.cross(p1, p3, p4), c4 = Geom.cross(p2, p3, p4);' ,
    'if (Math.abs(c3 - c4) < 1e-10) return ' + intId + '_cache = [NaN, NaN];' ,
    'var a1 = c3 / (c3 - c4);' ,
    'var a2 = c1 / (c1 - c2);' ,
    'if (' + this.legalArgInstructionRef('a1', context) + '&&' + obj.legalArgInstructionRef('a2', context) + ') {' ,
    'return ' + intId + '_cache = [(p2[0]-p1[0])*a1+p1[0], (p2[1]-p1[1])*a1+p1[1]];' ,
    '} else' ,
    'return ' + intId + '_cache = [NaN,NaN]; }'].join('\n');
};

GBAbstractLine.prototype.getIntersInstructionLC = function (obj, context, idx, intId) {
  var pc = obj.getParent(0).getInstructionRef(0, context), p2 = obj.getParent(1).getInstructionRef(0, context);
  var res = ['function () {',
    'if (' + intId + '_revision == revision) return ' + intId + '_cache;',
    this.id + '_revision = revision; ',
    'var prop = ' + pc + ', r2 = Geom.dist(prop, ' + p2 + '),',
    'p1 = ' + this.getInstructionRef(0, context) + ', p2 = ' + this.getInstructionRef(1, context) + ',',
    'arg = Geom.projArg(p1, p2, prop),',
    'mp = [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ],',
    'dist2 = Math.sqrt((r2 - Geom.dist(mp, prop)) / Geom.dist(p1, p2)),',
    'if (' + this.legalArgInstructionRef(idx == 0 ? '(arg - dist2)' : '(arg + dist2)', context) + ') ',
    'return ' + intId + '_cache = ' + this.getInstructionRef(idx == 0 ? '(arg - dist2)' : '(arg + dist2)', context) + ';',
    'else',
    'return ' + intId + '_cache = [ NaN, NaN ]);',
    '}'
  ];
  return res.join('\n');
};
function GBAbstractCurve() {
  Geom.apply(this, arguments);
}

GBAbstractCurve.SAMPLES = 250;
GBAbstractCurve.prototype = new LabeledGeom();
GBAbstractCurve.prototype.color = "#880";

GBAbstractCurve.prototype.__curve = function (start, stop) {
  var context = this.__curveStart(),
    ps1 = [], ps2 = [], curr1, curr2, i;

  for (i = 0; i <= GBAbstractCurve.SAMPLES; i++) {
    curr1 = start + (stop - start) / GBAbstractCurve.SAMPLES * i;
    curr2 = start + ((stop - start) / GBAbstractCurve.SAMPLES) * (i + 0.5);
    ps1.push(this.__getPosition(curr1, context));
    ps2.push(this.__getPosition(curr2, context));
  }

  this.__curveStop(context);
  return [ps1, ps2];
};

GBAbstractCurve.prototype.__drawPath = function (context) {
  this.update();
  var pss = this.path, ps = pss[0], dc = pss[1], last, top,
    curr, i, ex = context.getExtent(), a, proj, l, t, c;
  if (!ps) return;
  context.beginPath();
  context.moveTo(ps[0][0], ps[0][1]);
  for (i = 1; i < ps.length; i++) {
    last = ps[i - 1];
    top = dc[i - 1];
    curr = ps[i];
    l = (ex[0] < last[0] && last[0] < ex[2] && ex[1] < last[1] && last[1] < ex[3]);
    t = (ex[0] < top[0] && top[0] < ex[2] && ex[1] < top[1] && top[1] < ex[3]);
    c = (ex[0] < curr[0] && curr[0] < ex[2] && ex[1] < curr[1] && curr[1] < ex[3]);
    a = Geom.projArg(last, curr, top);
    proj = [ (curr[0] - last[0]) * a + last[0], (curr[1] - last[1]) * a + last[1] ];
    if (l || t || c)
      context.quadraticCurveTo(top[0] + top[0] - proj[0], top[1] + top[1] - proj[1], curr[0], curr[1]);
    else
      context.moveTo(curr[0], curr[1]);
  }
};

GBAbstractCurve.prototype.draw = function (context) {
  this.__drawPath(context);
  context.strokeStyle = this.color;
  context.lineWidth = context.transP2M(4);
  context.stroke();
//  var path = this.path[0];
//  $.each(path, function (k, v) {
//    context.beginPath();
//    context.arc(v[0], v[1], context.transP2M(2), 0, 2 * Math.PI);
//    context.strokeStyle = 'black';
//    context.lineWidth = context.transP2M(1);
//    context.stroke();
//  });
};

/**
 *
 * @param {CanvasContext} context
 */
GBAbstractCurve.prototype.drawSelected = function (context) {
  this.__drawPath(context);
  context.lineWidth = context.transP2M(8);
  context.strokeStyle = "#44c";
  context.stroke();
  context.lineWidth = context.transP2M(6);
  context.strokeStyle = "#fff";
  context.stroke();
  context.strokeStyle = this.color;
  context.lineWidth = context.transP2M(4);
  context.stroke();
};

GBAbstractCurve.prototype.drawHovering = function (context) {
  this.__drawPath(context);
  context.lineWidth = context.transP2M(4);
  context.strokeStyle = "#F00";
  context.stroke();
};

GBAbstractCurve.prototype.crossTest = function (l, t, r, b) {
  this.update();
  var i, path = this.path[0], p1, p2, la, ra, ta, ba, li, ri, ti, bi;
  if (!path) return false;
  for (i = 1; i < path.length; i++) {
    p1 = path[i - 1];
    p2 = path[i];
    if (l < p1[0] && p1[0] < r && t < p1[1] && p1[1] < b)
      return true;
    if (p1[1] == p2[1]) {
      la = (l - p1[0]) / (p2[0] - p1[0]);
      ra = (r - p1[0]) / (p2[0] - p1[0]);
      if (la < 0) continue;
      if (la > 1) continue;
      if (ra < 0) continue;
      if (ra > 1) continue;
      if (t < p1[1] && p1[1] < b) return true;
    } else if (p1[0] == p2[0]) {
      ta = (t - p1[1]) / (p2[1] - p1[1]);
      ba = (b - p1[1]) / (p2[1] - p1[1]);
      if (ta < 0) continue;
      if (ta > 1) continue;
      if (ba < 0) continue;
      if (ba > 1) continue;
      if (l < p1[0] && p1[0] < r) return true;
    } else {
      la = (l - p1[0]) / (p2[0] - p1[0]);
      ra = (r - p1[0]) / (p2[0] - p1[0]);
      if (la < 0) continue;
      if (la > 1) continue;
      if (ra < 0) continue;
      if (ra > 1) continue;
      li = (p2[1] - p1[1]) * la + p1[1];
      ri = (p2[1] - p1[1]) * ra + p1[1];
      if (t < li && li < b || t < ri && ri < b)
        return true;

      ta = (t - p1[1]) / (p2[1] - p1[1]);
      ba = (b - p1[1]) / (p2[1] - p1[1]);
      if (ta < 0) continue;
      if (ta > 1) continue;
      if (ba < 0) continue;
      if (ba > 1) continue;
      ti = (p2[0] - p1[0]) * ta + p1[0];
      bi = (p2[0] - p1[0]) * ba + p1[0];

      if (l < ti && ti < r || l < bi && bi < r)
        return true;

      if (li < ri || ti < bi)
        return true;
    }
  }
  return false;
};


GBAbstractCurve.prototype.hitTest = function (x, y, radius) {
  this.update();
  var i, path = this.path[0], p1, p2,
    fx, tx, fy, ty, t, c;
  if (!path) return false;
  for (i = 1; i < path.length; i++) {
    p1 = path[i - 1];
    p2 = path[i];
    fx = p1[0];
    tx = p2[0];
    fy = p1[1];
    ty = p2[1];
    if (fx > tx) {
      t = fx;
      fx = tx;
      tx = t;
    }
    if (fy > ty) {
      t = fy;
      fy = ty;
      ty = t;
    }

    c = Geom.cross(p1, [ x, y ], p2);
    c = c * c;
    if (c > radius * radius * Geom.dist2(p1, p2))
      continue;
    c = Geom.projArg(p1, p2, [ x, y ]);
    if (c > 1)
      continue;
    if (c < 0)
      continue;
    return true;
  }
  return false;
};


GBAbstractCurve.prototype.nearestArg = function (x, y) {
  this.update();
  var context = this.__curveStart(),
    d, mind = Infinity, mini = -1, it = 0, lastMind = 0, i, j, p, range = this.__getDefaultRange(), start = range[0], stop = range[1];
  while (Math.abs(mind - lastMind) > 1e-3 && it++ < 10000) {
    lastMind = mind;
    mind = Infinity;
    for (i = 0; i < 100; i++) {
      j = i * 0.01 * (range[1] - range[0]) + range[0];
      d = Geom.dist2(this.__getPosition(j, context), [x, y]);
      if (d < mind) {
        mini = i;
        mind = d;
      }
    }
    range = [(mini - 1) * 0.01 * (range[1] - range[0]) + range[0], (mini + 1) * 0.01 * (range[1] - range[0]) + range[0]];
  }
  this.__curveStop(context);
  p = (range[0] + range[1]) * 0.5;
  return (p - start) / (stop - start);
};

GBAbstractCurve.prototype.getPosition = function (arg) {
  var range = this.__getDefaultRange();
  return this.__getPosition((range[1] - range[0]) * arg + range[0]);
};

GBAbstractCurve.prototype.update = function () {
  if (this.__dirty) {
    Geom.prototype.update.apply(this, []);
    var range = this.__getDefaultRange();
    this.path = this.__curve(range[0], range[1]);
    this.__dirty = false;
  }
};

GBAbstractCurve.prototype.argRange = function () {
  return [0, 1];
};

GBAbstractCurve.prototype.__getPosition = function (arg) {
  throw '__getPosition(arg) not implemented';
};

GBAbstractCurve.prototype.__curveStart = function () {
  throw '__curveStart() not implemented';
};

GBAbstractCurve.prototype.__curveStop = function (context) {
  throw '__curveStop(context) not implemented';
};

GBAbstractCurve.prototype.__getDefaultRange = function () {
  return this.getParent(GBLocus.POO).getParent(0).argRange();
};function GBPointMark(document, po, line, perp) {
  Geom.apply(this, [document, [line, po], [perp]]);
}

GBPointMark.IS_PERP = 0;
GBPointMark.prototype = new Geom();
GBPointMark.prototype.isPoint = true;
GBPointMark.prototype.nearestArg = function () {
  return 0;
};
GBPointMark.prototype.type = function () {
  return 'gpm';
};
GBPointMark.prototype.getPosition = function () {
  var p1 = this.getParent(0).getPosition(0),
    p2 = this.getParent(0).getPosition(1),
    p3 = this.getParent(1).getPosition(0);
  if (this.getParam(GBPointMark.IS_PERP))
    return [p3[0] - (p2[1] - p1[1]), p3[1] + (p2[0] - p1[0])];
  else
    return [p3[0] + p2[0] - p1[0], p3[1] + p2[1] - p1[1]];
};


GBPointMark.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '_mark(arg) { ' ,
    'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';' ,
    'var p2 = ' + this.getParent(0).getInstructionRef(1, context) + ';' ,
    'var p3 = ' + this.getParent(1).getInstructionRef(0, context) + ';' ,
    'return' +
      (this.getParam(0) ?
        '[p3[0] - (p2[1] - p1[1]), p3[1] + (p2[0] - p1[0])]' :
        '[p3[0] + p2[0] - p1[0], p3[1] + p2[1] - p1[1]]'
        ) +
      ';}'].join('\n');
};

GBPointMark.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) {
    var p = this.getPosition();
    return '[' + p[0] + ',' + p[1] + ']';
  }
  return this.id + '_mark()';
};

gb.geom.reg(GBPointMark);function GBPoint(document, x, y) {
  GBAbstractPoint.apply(this, [ document, [ ], [x, y] ]);
}

GBPoint.X = 0;
GBPoint.Y = 1;

GBPoint.prototype = new GBAbstractPoint();

GBPoint.prototype.drag = function (from, to) {
  this.setParam(GBPoint.X, this.getParam(GBPoint.X) + to[0] - from[0]);
  this.setParam(GBPoint.Y, this.getParam(GBPoint.Y) + to[1] - from[1]);
};

GBPoint.prototype.type = function () {
  return "gpo";
};

GBPoint.prototype.getPosition = function () {
  return [ this.getParam(GBPoint.X), this.getParam(GBPoint.Y) ];
};

GBPoint.prototype.getInstruction = function (context) {
  return 'var ' + this.id + '_x = gdoc.get("' + this.id + '").__params[0];\n' +
    'var ' + this.id + '_y = gdoc.get("' + this.id + '").__params[1];';
};

GBPoint.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic();
  return '[' + this.id + '_x,' + this.id + '_y]';
};


gb.geom.reg(GBPoint);function GBLine(document, gpo1, gpo2) {
  GBAbstractLine.apply(this, [document, gpo1, gpo2]);
}

GBLine.prototype = new GBAbstractLine();
GBLine.P1 = 0;
GBLine.P2 = 1;
GBLine.prototype.labelArg = 0.5;
GBLine.prototype.length = function () {
  var p1 = this.__getPosition(0),
    p2 = this.__getPosition(1),
    dx = p1[0] - p2[0],
    dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
};

GBLine.prototype.dragInvolve = function () {
  var d = {};
  $.extend(d, gb.utils.a2m(this.getParent(GBLine.P1).dragInvolve()));
  $.extend(d, gb.utils.a2m(this.getParent(GBLine.P2).dragInvolve()));
  return gb.utils.m2a(d);
};

GBLine.prototype.type = function () {
  return "gli";
};

GBLine.prototype.legalArg = function (arg) {
  return 0 <= arg && arg <= 1;
};

GBLine.prototype.legalArgInstructionRef = function (arg) {
  return '0<=' + arg + '&&' + arg + '<=1';
};

GBLine.prototype.argRange = function (arg) {
  return [ 0, 1 ];
};

GBLine.prototype.adjustArg = function (arg) {
  if (arg < 0)
    return 0;
  if (arg > 1)
    return 1;
  return arg;
};

GBLine.prototype.adjustArgInstruction = function (arg, context) {
  return [ 'if (', arg, '<0) ', arg, '=0; else if (', arg, '>1) ', arg, '=1;' ].join('');
};

GBLine.prototype.__getPosition = function (arg) {
  if (arg == 0)
    return this.getParent(GBLine.P1).getPosition();
  if (arg == 1)
    return this.getParent(GBLine.P2).getPosition();
  arg = Math.atan(arg);
  var p1 = this.getParent(GBLine.P1).getPosition(),
    p2 = this.getParent(GBLine.P2).getPosition();
  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];
};

GBLine.prototype.randPoint = function () {
  while (true) {
    var arg = Math.nrand() + 0.5;
    if (this.legalArg(arg)) {
      return this.__getPosition(arg);
    }
  }
};

GBLine.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '(arg) {',
    '  if (!' + this.legalArgInstructionRef('arg', context) + ') return [NaN, NaN];',
    '  var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';',
    '  var p2 = ' + this.getParent(1).getInstructionRef(0, context) + ';',
    '  ' + this.adjustArgInstruction('arg', context),
    '  return [ p1[0] + (p2[0] - p1[0]) * arg, p1[1] + (p2[1] - p1[1]) * arg ];',
    '}'].join('\n');
};

GBLine.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id])
    return this.getInstructionRefStatic(arg, context);
  if (arg === 0)
    return this.getParent(0).getInstructionRef(0, context);
  else if (arg === 1)
    return this.getParent(1).getInstructionRef(0, context);
  else return this.id + '(' + arg + ')';
};

gb.geom.reg(GBLine);/**
 * @class GBCircle
 * @extends LabeledGeom
 * @param {string}
  *          id
 * @param {GBPoint}
  *          center
 * @param {GBPoint}
  *          on
 * @constructor
 */
function GBCircle(document, center, on) {
  LabeledGeom.apply(this, [ document, [ center, on ] ]);
}

GBCircle.prototype = new LabeledGeom();
GBCircle.CENTER = 0;
GBCircle.ON = 1;

GBCircle.prototype.color = '#080';
GBCircle.prototype.isCircle = true;

GBCircle.prototype.prop = function () {
  var cen = this.getParent(GBCircle.CENTER).getPosition(),
    on = this.getParent(GBCircle.ON).getPosition(),
    dx = cen[0] - on[0],
    dy = cen[1] - on[1],
    r = dx * dx + dy * dy;
  r = Math.sqrt(r);
  return [ cen[0], cen[1], r, [
    [ 0, Math.PI * 2 ]
  ] ];
};

GBCircle.prototype.draw = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = context.transP2M(3);
  context.strokeStyle = this.color;
  context.stroke();
};

GBCircle.prototype.drawSelected = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2] - context.transP2M(4), 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = context.transP2M(1);
  context.strokeStyle = "#44c";
  context.stroke();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2] + context.transP2M(4), 0, Math.PI * 2, false);
  context.closePath();
  context.stroke();
  this.draw(context);
};

GBCircle.prototype.drawHovering = function (context) {
  var prop = this.prop();
  context.beginPath();
  context.arc(prop[0], prop[1], prop[2], 0, Math.PI * 2, false);
  context.closePath();
  context.lineWidth = context.transP2M(3);
  context.strokeStyle = "#f00";
  context.stroke();
};

GBCircle.prototype.hitTest = function (x, y, radius) {
  var prop = this.prop(),
    dx = prop[0] - x,
    dy = prop[1] - y,
    r = dx * dx + dy * dy;
  r = Math.sqrt(r);
  return r - this.document.context.transP2M(radius) < prop[2] && prop[2] < r + this.document.context.transP2M(radius);
};

GBCircle.prototype.inters = function (obj) {
  if (obj.isLine)
    return obj.inters(this);
  else if (obj.isCircle) {
    var prop1 = this.prop(),
      prop2 = obj.prop(),
      d = Math.sqrt(Geom.dist2(prop1, prop2)),
      r1 = prop1[2],
      r2 = prop2[2],
      d1 = ((r1 * r1 - r2 * r2) / d + d) * 0.5,
      h = Math.sqrt(r1 * r1 - d1 * d1),
      dx = prop2[0] - prop1[0],
      dy = prop2[1] - prop1[1],
      c1 = [ prop1[0] + (dx * d1 - dy * h) / d, prop1[1] + (dy * d1 + dx * h) / d ],
      c2 = [ prop1[0] + (dx * d1 + dy * h) / d, prop1[1] + (dy * d1 - dx * h) / d ];
    return [ c1, c2 ];
  }
};

GBCircle.prototype.crossTest = function (l, t, r, b) {
  var prop = this.prop(),
    ps = [
      [ l, b ],
      [ l, t ],
      [ r, t ],
      [ r, b ]
    ],
    ds = $.map(ps, function (v, k) {
      return Geom.dist2(v, prop);
    }),
    r2 = prop[2] * prop[2];
  if (ds[0] < r2 && ds[1] < r2 && ds[2] < r2 && ds[3] < r2)
    return false;
  if (ds[0] > r2 && ds[1] > r2 && ds[2] > r2 && ds[3] > r2) {
    if (Math.abs(prop[1] - t) <= prop[2] || Math.abs(prop[1] - b) <= prop[2]) {
      if (l < prop[0] && prop[0] < r)
        return true;
    }
    if (Math.abs(prop[0] - l) <= prop[2] || Math.abs(prop[0] - r) <= prop[2]) {
      return (t < prop[1] && prop[1] < b);
    }
    return l < prop[0] - prop[2] && prop[0] + prop[2] < r && t < prop[1] - prop[2] && prop[1] + prop[2] < b;
  }
  return true;
};

GBCircle.prototype.nearestArg = function (x, y) {
  var c = this.getParent(GBCircle.CENTER).getPosition();
  return Math.atan2(y - c[1], x - c[0]);
};

GBCircle.prototype.dragInvolve = function () {
  return [ this.getParent(GBCircle.CENTER), this.getParent(GBCircle.ON) ];
};

GBCircle.prototype.drag = function (from, to) {

};

GBCircle.prototype.type = function () {
  return "gci";
};

GBCircle.prototype.getPosition = function (arg) {
  var prop = this.prop();
  return [ prop[0] + Math.cos(arg) * prop[2], prop[1] + Math.sin(arg) * prop[2] ];
};

GBCircle.prototype.legalArg = function (arg) {
  if (arg < 0)
    return false;
  if (arg > 2 * Math.PI)
    return false;
  return true;
};

GBCircle.prototype.argRange = function () {
  return [ 0, 2 * Math.PI ];
};

GBCircle.prototype.randPoint = function () {
  while (true) {
    var arg = Math.random() * 2 * Math.PI;
    if (this.legalArg(arg)) {
      return this.getPosition(arg);
    }
  }
};

GBCircle.prototype.getInstruction = function (context) {
  return 'function ' + this.id + '(arg) { var p1 = ' + this.getParent(0).getInstructionRef(0, context) +
    ', p2 = ' + this.getParent(1).getInstructionRef(0, context) + ',' +
    ' r = Math.sqrt(Geom.dist(p1, p2));' +
    'return [ p1[0] + Math.cos(arg) * r, p1[1] + Math.sin(arg) * r ]; }';
};

GBCircle.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic(arg);
  return this.id + '(' + arg + ')';
};

GBCircle.prototype.getInstruction = function (context) {
  return 'function ' + this.id + '(arg) { var p1 = ' + this.getParent(0).getInstructionRef(0, context) +
    ', p2 = ' + this.getParent(1).getInstructionRef(0, context) + ',' +
    ' r = Math.sqrt(Geom.dist(p1, p2));' +
    'return [ p1[0] + Math.cos(arg) * r, p1[1] + Math.sin(arg) * r ]; }';
};

GBCircle.prototype.getInstructionRefStatic = function (arg) {
  var prop = this.prop();
  return '[' + prop[0] + '+Math.cos(' + arg + ')*' + prop[2] + ',' + prop[1] + '+Math.sin(' + arg + ')*' + prop[2] + ']';
};

GBCircle.prototype.getIntersInstruction = function (obj, context, idx) {
  if (obj.isLine) {
    return obj.getIntersInstruction(this, context);
  } else {
    if (idx >= 2) return '[NaN, NaN]';
    var res = [
      'function() {',
      'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ',',
      'p2 = ' + obj.getParent(0).getInstructionRef(0, context) + ',',
      'd = Math.sqrt(Geom.dist(p1, p2)),',
      'r1 = Geom.dist(p1, ' + this.getParent(1).getInstructionRef(0, context) + '),',
      'r2 = Geom.dist(p2, ' + obj.getParent(1).getInstructionRef(0, context) + '),',
      'd1 = ((r1 - r2) / d + d) * 0.5,',
      'h = Math.sqrt(r1- d1 * d1),',
      'dx = p2[0] - p1[0],',
      'dy = p2[1] - p1[1];',
      idx == 0 ? 'return [ p1[0] + (dx * d1 - dy * h) / d, p1[1] + (dy * d1 + dx * h) / d ],' :
        'return [ p1[0] + (dx * d1 + dy * h) / d, p1[1] + (dy * d1 - dx * h) / d ];',
      '}'
    ];
    return res.join('\n');
  }
};

GBCircle.prototype.isClosed = function () {
  return this.argRange()[1] == this.argRange()[0] + Math.PI * 2;
};

gb.geom.reg(GBCircle);function GBPoO(document, obj, arg) {
  GBAbstractPoint.apply(this, [document, [obj], [arg]]);
}

GBPoO.prototype = new GBAbstractPoint();

GBPoO.prototype.drag = function (from, to) {
  var p = this.getPosition();
  p[0] += to[0] - from[0];
  p[1] += to[1] - from[1];
  this.setParam(0, this.getParent(0).nearestArg(p[0], p[1]));
  this.dirt();
};

GBPoO.prototype.type = function () {
  return "poo";
};

GBPoO.prototype.getPosition = function () {
  if (this.__dirty) {
    return this.getParent(0).getPosition(this.getParam(0));
  }
  return this.cache;
};

GBPoO.prototype.getInstruction = function () {
  return 'var ' + this.id + '_arg=gdoc.get("' + this.id + '").__params[0];';
};


GBPoO.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.getParent(0).getInstructionRef(this.id + '_arg', context);
};

gb.geom.reg(GBPoO);function GBMidpoint(document, line) {
  GBAbstractPoint.apply(this, [document, [line], []]);
}

GBMidpoint.prototype = new GBAbstractPoint();
GBMidpoint.prototype.dragInvolve = function () {
  return this.getParent(0).dragInvolve();
};

GBMidpoint.prototype.drag = function (from, to) {

};

GBMidpoint.prototype.type = function () {
  return "mpo";
};

GBMidpoint.prototype.getPosition = function () {
  if (this.__dirty) {
    return this.getParent(0).getPosition(0.5);
  }
  return this.cache;
};

GBMidpoint.prototype.getInstruction = function (context) {
  return '';
};

GBMidpoint.prototype.getInstructionRef = function (arg, context) {
  return this.getParent(0).getInstructionRef(0.5, context);
};

gb.geom.reg(GBMidpoint);function GBInters(document, obj1, obj2, idx) {
  GBAbstractPoint.apply(this, [document, [obj1, obj2], [idx]]);
}

GBInters.prototype = new GBAbstractPoint();

GBInters.prototype.dragInvolve = function () {
  var d = {};
  $.each(this.getParent(0).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  $.each(this.getParent(1).dragInvolve(), function (k, v) {
    d[v.id] = v;
  });
  return gb.utils.m2a(d);
};

GBInters.prototype.type = function () {
  return "xpo";
};

GBInters.prototype.getPosition = function () {
  if (this.__dirty) {
    var inters = this.getParent(0).inters(this.getParent(1));
    if (this.getParam(0) < inters.length)
      return inters[this.getParam(0)];
    else
      return [ NaN, NaN ];
  }
  return this.cache;
};

GBInters.prototype.update = function () {
  if (this.__dirty) {
    this.cache = this.getPosition();
    Geom.prototype.update.apply(this, []);
  }
};

GBInters.prototype.getInstruction = function (context) {
  return ['var ', this.id , '_revision = -1, ', this.id, '_cache = [NaN, NaN]; ',
    'var ' , this.id , '=' , this.getParent(0).getIntersInstruction(this.getParent(1), context, this.getParam(0), this.id) , ';'].join('');
};

GBInters.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.id + '(' + arg + ')';
};

gb.geom.reg(GBInters);function GBRay(document, gpo1, gpo2) {
  GBLine.apply(this, [ document, gpo1, gpo2]);
}

GBRay.prototype = new GBLine();
GBRay.labelArg = 0;
GBRay.prototype.adjustArg = function (arg) {
  if (arg < 0) return 0;
  return arg;
};

GBRay.prototype.adjustArgInstruction = function (arg) {
  return [ 'if (', arg, ' < 0) ', arg, '= 0;' ].join('');
};

GBRay.prototype.legalArg = function (arg) {
  return arg >= 0;
};

GBRay.prototype.legalArgInstructionRef = function (arg) {
  return '(' + arg + '>=0)';
};


GBRay.prototype.argRange = function (arg) {
  var ext = this.document.context.getExtent();
  return arg = this.crossArg(ext[0] * 2, ext[1] * 2, (ext[2] - ext[0]) * 2, (ext[3] - ext[1]) * 2);
};

GBRay.prototype.type = function () {
  return 'ray';
};

gb.geom.reg(GBRay);function GBXLine(document, gpo1, gpo2) {
  GBLine.apply(this, [ document, gpo1, gpo2]);
}

GBXLine.prototype = new GBLine();
GBXLine.labelArg = 0;
GBXLine.prototype.adjustArg = function (arg) {
  return arg;
};

GBXLine.prototype.adjustArgInstruction = function (arg) {
  return '';
};

GBXLine.prototype.legalArg = function (arg) {
  return !isNaN(arg);
};

GBXLine.prototype.legalArgInstructionRef = function (arg) {
  return '!isNaN(' + arg + ')';
};


GBXLine.prototype.argRange = function () {
  var ext = this.document.context.getExtent(),
    arg = this.crossArg(ext[0], ext[1], ext[2] - ext[0], ext[3] - ext[1]);
  return [arg[0] + (arg[0] - arg[1]) * 2, arg[1] + (arg[1] - arg[0]) * 2];
};

GBXLine.prototype.getPosition = function (arg) {
  return GBLine.prototype.getPosition.apply(this, [arg]);
};


GBXLine.prototype.type = function () {
  return 'xli';
};

gb.geom.reg(GBXLine);function GBLocus(document, poo, target) {
  GBAbstractCurve.apply(this, [ document, [ poo, target ] ]);
  this.path = [];
}

GBLocus.POO = 0;
GBLocus.TARGET = 1;

GBLocus.prototype = new GBAbstractCurve();
GBLocus.prototype.color = "#880";

GBLocus.prototype.__getDefaultRange = function () {
  var pa = this.getParent(GBLocus.POO).getParent(0);
  return pa.argRange && pa.argRange() || [0, 1];
};

GBLocus.prototype.__getPosition = function (arg, context) {
  return [NaN, NaN];
};

GBLocus.prototype.__curveStart = function () {

};

GBLocus.prototype.__curveStop = function (context) {

};

GBLocus.prototype.getInstruction = function (context) {
  return 'var ' + this.id + ' = (' + Geom.calculas(this.document, this.getParent(0), this.getParent(1)) + ') (gdoc);';
};

GBLocus.prototype.getInstructionRef = function (arg, context) {
  var range = this.__getDefaultRange();
  return this.id + '(' + (range[1] - range[0]) + '* (' + arg + ') +' + range[0] + ')';
};

GBLocus.prototype.type = function () {
  return "loc";
};

GBLocus.prototype.update = function () {
  if (this.__dirty) {
    var text = Geom.calculas(this.document, this.getParent(0), this.getParent(1));
    this.__getPosition = eval(text)(this.document);
    GBAbstractCurve.prototype.update.apply(this, []);
  }
};

gb.geom.reg(GBLocus);function GBProjectionPoint(document, line, po) {
  GBAbstractPoint.apply(this, [document, [line, po]]);
}

GBProjectionPoint.prototype = new GBAbstractPoint();

GBProjectionPoint.prototype.drag = function (from, to) {
  var p = this.getPosition();
  p[0] += to[0] - from[0];
  p[1] += to[1] - from[1];
  this.setParam(0, this.getParent(0).nearestArg(p[0], p[1]));
  this.dirt();
};

GBProjectionPoint.prototype.type = function () {
  return "prp";
};

GBProjectionPoint.prototype.getPosition = function () {
  var line = this.getParent(0),
    p0 = line.__getPosition(0),
    p1 = line.__getPosition(1),
    p2 = this.getParent(1).getPosition(),
    arg = Geom.projArg(p0, p1, p2);
  return [(p1[0] - p0[0]) * arg + p0[0], (p1[1] - p0[1]) * arg + p0[1]];
};

GBProjectionPoint.prototype.getInstruction = function () {
  return 'var ' + this.id + ' = function (arg) { var p0 = ' + this.getParent(0).getInstructionRef(0) + ', p1 = ' +
    +this.getParent(0).getInstructionRef(1) + ', p = ' + this.getParent(1).getInstructionRef(0) + ', arg = Geom.projArg(p0, p1, p2);' +
    'return [(p1[0] - p0[0]) * arg + p0[0], (p1[1] - p0[1]) * arg + p0[1]]; }';
};


GBProjectionPoint.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) return this.getInstructionRefStatic();
  return this.id + '(' + arg + ')';
};

gb.geom.reg(GBProjectionPoint);function GBAngleBisectorMark(document, p1, p2, ang) {
  Geom.apply(this, [document, [p1, p2, ang]]);
}

GBAngleBisectorMark.prototype = new Geom();
GBAngleBisectorMark.prototype.isPoint = true;
GBAngleBisectorMark.prototype.nearestArg = function () {
  return 0;
};
GBAngleBisectorMark.prototype.type = function () {
  return 'abm';
};
GBAngleBisectorMark.prototype.getPosition = function () {
  var p1 = this.getParent(0).getPosition(0),
    p2 = this.getParent(1).getPosition(0),
    ang = this.getParent(2).getPosition(0),
    d1 = Math.sqrt(Geom.dist2(ang, p1)),
    d2 = Math.sqrt(Geom.dist2(ang, p2)),
    arg = d1 / (d1 + d2);
  return [(p2[0] - p1[0]) * arg + p1[0], (p2[1] - p1[1]) * arg + p1[1]];
};


GBAngleBisectorMark.prototype.getInstruction = function (context) {
  return ['function ' + this.id + '_mark(arg) { ' ,
    'var p1 = ' + this.getParent(0).getInstructionRef(0, context) + ';' ,
    'var p2 = ' + this.getParent(1).getInstructionRef(0, context) + ';' ,
    'var ang = ' + this.getParent(2).getInstructionRef(0, context) + ';' ,
    'var d1 = Math.sqrt(Geom.dist(ang, p1));',
    'var d2 = Math.sqrt(Geom.dist(ang, p2));',
    'var arg = d1 / (d1 + d2);',
    'return [(p2[0] - p1[0]) * arg + p1[0], (p2[1] - p1[1]) * arg + p1[1]];',
    '}'].join('\n');
};

GBAngleBisectorMark.prototype.getInstructionRef = function (arg, context) {
  if (!context.desc[this.id]) {
    var p = this.getPosition();
    return '[' + p[0] + ',' + p[1] + ']';
  }
  return this.id + '_mark()';
};

gb.geom.reg(GBAngleBisectorMark);function Action() {
  this.init();
}

Action.prototype = {
  reset : function () {
  },
  init : function () {
  },
  click : function () {
  },
  /**
   * @param {GDoc} gdoc
   * @param {Number} x
   * @param {Number} y
   * @param {Event} event
   */
  mouseDown : function (gdoc, x, y, event) {
  },
  /**
   * @param {GDoc} gdoc
   * @param {Number} x
   * @param {Number} y
   * @param {Event} event
   */
  mouseMove : function (gdoc, x, y) {
  },
  /**
   * @param {GDoc} gdoc
   * @param {Number} x
   * @param {Number} y
   * @param {Event} event
   */
  mouseUp : function (gdoc, x, y) {
  }
};

gb.tools = {};/**
 * @class SelectionAction
 * @extends Action
 */
function SelectionAction() {
  this.init();
  this.cmd = null;
  this.startDrag = null;
}

SelectionAction.prototype = new Action();
$.extend(SelectionAction.prototype, {
  text : '<img src="images/sel.png" title="Selection"/>',
  startDrag : null,
  dragging : null,
  oldSelection : null,
  draggingLabel : null,
  /**
   * @field {Command} cmd
   */
  cmd : null,
  reset : function () {
    this.startDrag = null;
    this.dragging = null;
    this.oldSelection = null;
    this.draggingLabel = null;
    this.cmd = null;
  },

  mouseMove : function (gdoc, x, y) {
    var fx, fy, tx, ty, di, test;
    if (this.dragging) {
      if (this.cmd) {
        if (this.cmd == gdoc.lastCommand()) {
          this.cmd.undo(gdoc);
          this.cmd.tx = x;
          this.cmd.ty = y;
          this.cmd.redo(gdoc);
        }
      } else {
        di = {};
        $.each(gdoc.selection, function (k, v) {
          $.each(v.dragInvolve(), function (k, t) {
            di[t.id] = t;
          });
        });
        this.cmd = new TranslateCommand(di, this.dragging[0], this.dragging[1], x, y);
        gdoc.run(this.cmd);
      }
      gdoc.draw();
    } else if (this.draggingLabel) {
      if (this.cmd) {
        if (this.cmd == gdoc.lastCommand()) {
          this.cmd.undo(gdoc);
          this.cmd.dx = x - this.startDrag[0];
          this.cmd.dy = y - this.startDrag[1];
          this.cmd.redo(gdoc);
        }
      } else {
        this.cmd = new TranslateLabelCommand(this.draggingLabel, x - this.startDrag[0], y - this.startDrag[1]);
        gdoc.run(this.cmd);
      }
      gdoc.draw();
      this.draggingLabel.drawLabel(gdoc.contextPhantom, true);
    } else if (this.startDrag) {
      fx = this.startDrag[0], tx = x;
      fy = this.startDrag[1], ty = y;
      if (fx > tx) {
        t = fx;
        fx = tx;
        tx = t;
      }
      if (fy > ty) {
        t = fy;
        fy = ty;
        ty = t;
      }
      gdoc.selection = gb.utils.shallowClone(this.oldSelection);
      gdoc.forVisibles(function (k, ent) {
        if (ent.crossTest(fx, fy, tx, ty))
          gdoc.selection[ent.id] = ent;
      });
      gdoc.draw();
      gdoc.context.beginPath();
      gdoc.context.rect(fx, fy, tx - fx, ty - fy);
      gdoc.context.closePath();
      gdoc.context.strokeStyle = "#339";
      gdoc.context.stroke();
      gdoc.context.fillStyle = "rgba(48,48,144,0.3)";
      gdoc.context.fill();
    } else {
      test = gdoc.hitTest(x, y);
      if (test.found.length == 1) {
        if (gdoc.hovering != test.found[0]) {
          gdoc.hovering = test.found[0];
        }
        gdoc.draw();
      } else if (test.found.length == 0) {
        /**
         * @param {Geom} v
         */
        if (gdoc.hovering != null) {
          gdoc.hovering = null;
        }
        gdoc.draw();
        gdoc.forVisibles(function (k, v) {
          if (v.showLabel && v.labelHistTest(gdoc.contextPhantom, x, y)) {
            v.drawLabel(gdoc.contextPhantom, true);
            return false;
          }
          return undefined;
        });
      }
    }
  },

  /**
   *
   * @param {GDoc} gdoc
   * @param x
   * @param y
   * @param {MouseEvent} ev
   */
  mouseDown : function (gdoc, x, y, ev) {
    var me = this, test = gdoc.hitTest(x, y), ent;
    if (ev.shiftKey) {
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id]) {
          gdoc.selection[ent.id] = ent;
        } else
          delete gdoc.selection[ent.id];
      }
      me.oldSelection = gb.utils.shallowClone(gdoc.selection);
      me.startDrag = [ x, y ];
    } else {
      me.oldSelection = new Object();
      if (test.found.length == 1) {
        ent = test.found[0];
        if (!gdoc.selection[ent.id]) {
          gdoc.selection = {};
          gdoc.selection[ent.id] = ent;
        }
        me.dragging = [ x, y ];
      } else if (test.found.length == 0) {
        /**
         * @param {Geom} v
         */
        gdoc.forVisibles(function (k, v) {
          if (v.showLabel && v.labelHistTest(gdoc.contextPhantom, x, y)) {
            me.draggingLabel = v;
            return false;
          }
        });
        if (!me.draggingLabel) {
          gdoc.selection = {};
        } else {
          gdoc.selection = {};
          gdoc.selection[me.draggingLabel.id] = me.draggingLabel;
        }
        me.startDrag = [ x, y ];
      }
    }
    gdoc.draw();
  },

  mouseUp : function (gdoc, x, y) {
    if (this.dragging) {
      if (this.cmd && this.cmd == gdoc.lastCommand()) {
        this.cmd.undo(gdoc);
        this.cmd.tx = x;
        this.cmd.ty = y;
        this.cmd.redo(gdoc);
        gdoc.save();
      }
      this.cmd = null;
      this.dragging = null;
    } else if (this.draggingLabel) {
      if (this.cmd && this.cmd == gdoc.lastCommand()) {
        this.cmd.undo(gdoc);
        this.cmd.dx = x - this.startDrag[0];
        this.cmd.dy = y - this.startDrag[1];
        this.cmd.redo(gdoc);
        gdoc.save();
      }
      this.cmd = null;
      this.startDrag = null;
      this.draggingLabel = null;
    } else if (this.startDrag) {
      this.startDrag = null;
    }
    this.mouseMove(gdoc, x, y);
  }
});

gb.tools['sel'] = new SelectionAction();
function PointAction() {
  this.init();
}

PointAction.prototype = new Action();

/**
 * @static
 */
PointAction.prototype.text = '<img src="images/point.png" title="Point"/>';
PointAction.prototype.color = '#f00';

/**
 * @type {Geom}
 */
PointAction.prototype.found = null;

/**
 * @type {Array}
 */
PointAction.prototype.current = null;
/**
 * @private
 * @type {Array}
 */
PointAction.prototype._onNewPoint = [];

/**
 * @param {Function} callback
 */
PointAction.prototype.registerOnNewPoint = function (callback) {
  this._onNewPoint.push(callback);
};

PointAction.prototype.init = function () {
  this.reset();
};

PointAction.prototype.reset = function () {
  this.current = [ 0, 0 ];
  this.found = null;
  this.status = 0;
  this.basePoint = null;
  this.cmd = null;
};

PointAction.prototype.adjust = function () {
  var me = this, plast, ds, mi = 0, min;
  if (me.basePoint) {
    plast = me.basePoint.getPosition();
    ds = [
      me.current[0] - plast[0],
      me.current[1] - plast[1],
      (me.current[0] + me.current[1] - plast[0] - plast[1]) * Math.SQRT1_2,
      (me.current[0] - me.current[1] - plast[0] + plast[1]) * Math.SQRT1_2
    ];
    min = ds[0];
    for (var i = 1; i < 4; i++) {
      if (Math.abs(min) > Math.abs(ds[i])) {
        min = ds[mi = i];
      }
    }
    switch (mi) {
      case 0:
        me.current[0] -= min;
        break;
      case 1:
        me.current[1] -= min;
        break;
      case 2:
        me.current[0] -= min * Math.SQRT1_2;
        me.current[1] -= min * Math.SQRT1_2;
        break;
      case 3:
        me.current[0] -= min * Math.SQRT1_2;
        me.current[1] += min * Math.SQRT1_2;
        break;
    }
  }
};

PointAction.prototype.snap = function (gdoc) {
  var me = this, context = gdoc.context, po, radius = context.transP2M(gdoc.mouse[2]);
  me.cmd = null;
  if (me.found.length == 1) {
    var target = me.found[0];
    if (target.isPoint) {
      context.beginPath();
      context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
      context.closePath();
      context.lineWidth = context.transP2M(1);
      context.strokeStyle = "#F00";
      context.stroke();
      return;
    }
    if (target.type() == 'gli') {
      po = target.getPosition(0.5);
      if (Geom.dist2(me.current, po) < radius * radius) {
        me.current = po;
        context.beginPath();
        context.moveTo(me.current[0], me.current[1] - radius * 2);
        context.lineTo(me.current[0] - radius * Math.sqrt(3), me.current[1] + radius);
        context.lineTo(me.current[0] + radius * Math.sqrt(3), me.current[1] + radius);
        context.closePath();
        context.lineWidth = context.transP2M(2);
        context.strokeStyle = "#880";
        context.stroke();
        context.fillStyle = "black";
        context.font = radius * 2 + "px Arial";
        context.fillText("Midpoint", po[0] + radius * 2, po[1] + radius * 2);
        me.cmd = new ConstructMidpointCommand(me.found[0]);
        return;
      }
    }
    if (me.basePoint) {
      if (target.isLine) {
        // Test for perpendicular line
        po = me.basePoint.getPosition(0);
        po = target.getPosition(target.nearestArg(po[0], po[1]));
        if (Geom.dist2(me.current, po) < radius * radius) {
          me.current = po;
          context.beginPath();
          context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
          context.closePath();
          context.lineWidth = context.transP2M(1);
          context.strokeStyle = "#0F0";
          context.stroke();
          context.fillStyle = "black";
          context.font = radius * 2 + "px Arial";
          context.fillText("Perpendicular", po[0] + radius * 2, po[1] + radius * 2);
          me.cmd = new ConstructProjectionPoint(me.found[0], me.basePoint);
          return;
        }
      }
    }
    me.cmd = new ConstructPoOCommand(me.found[0], me.found[0].nearestArg(me.current[0], me.current[1]));
    return;
  } else if (me.found.length >= 2) {
    context.beginPath();
    context.arc(me.current[0], me.current[1], radius, 0, Math.PI * 2, false);
    context.closePath();
    context.lineWidth = context.transP2M(1);
    context.strokeStyle = "#0F0";
    context.stroke();
    me.cmd = new ConstructIntersectionCommand(me.found[0], me.found[1], me.current[2]);
    return;
  }
};

PointAction.prototype.mouseMove = function (gdoc, x, y, ev) {
  var me = this, test = gdoc.hitTest(x, y), context = gdoc.context;
  this.found = test.found;
  this.current = test.current;

  gdoc.draw();
  $.each(me.found, function (k, v) {
    v.drawHovering(context);
  });

  me.snap(gdoc);

  if (!me.cmd) {
    if (me.found.length == 0) {
      if (ev.shiftKey) me.adjust(ev);
      me.cmd = new ConstructPointCommand(test.current[0], test.current[1]);
    }
  }


  context.beginPath();
  context.arc(me.current[0], me.current[1], context.transP2M(3), 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.fill();
  context.lineWidth = context.transP2M(1);
  context.strokeStyle = "#000";
  context.stroke();
};

PointAction.prototype.fireOnNewPoint = function (np) {
  $.each(this._onNewPoint, function (k, callback) {
    callback(np);
  });
}
/**
 * @param {GDoc} gdoc
 * @param {Number} x
 * @param {Number} y
 * @param {Event} ev
 */
PointAction.prototype.mouseUp = function (gdoc, x, y, ev) {
  var me = this;
  me.mouseMove(gdoc, x, y, ev);
  if (me.cmd) {
    gdoc.run(me.cmd);
    me.fireOnNewPoint(me.cmd.newObjects[0]);
    gdoc.draw();
  } else {
    me.fireOnNewPoint(me.found[0]);
  }
  me.mouseMove(gdoc, x, y, ev);
};

gb.tools['point'] = new PointAction();/**
 * @class LineAction
 * @extends Action
 */
function LineAction() {
  this.init();
}

LineAction.prototype = new Action();
LineAction.prototype.text = '<img src="images/line.png"/>';
LineAction.prototype.init = function () {
  var me = this;
  (me.pointAction = new PointAction()).registerOnNewPoint(function (np) {
    if (me.status == 0) {
      me.p1 = np;
      me.pointAction.basePoint = np;
    } else if (me.status == 1) {
      me.p2 = np;
    }

  });
  me.reset();
};

LineAction.prototype.reset = function () {
  var me = this;
  me.status = 0;
  me.p1 = null;
  me.p2 = null;
  me.pointAction.reset();
};

LineAction.prototype.mouseMove = function (gdoc, x, y, ev) {
  var me = this, context, p1;
  switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      context = gdoc.context;
      context.beginPath();
      if (me.p1) {
        p1 = me.p1.getPosition();
        context.moveTo(p1[0], p1[1]);
        context.lineTo(me.pointAction.current[0], me.pointAction.current[1]);
        context.closePath();
        context.strokeStyle = "#99d";
        context.lineWidth = context.transP2M(2);
        context.stroke();
      }
      break;
  }
};

LineAction.prototype.mouseUp = function (gdoc, x, y, ev) {
  var me = this;
  if (me.status == 1) {
    this.mouseDown(gdoc, x, y, ev);
  }
  this.mouseMove(gdoc, x, y, ev);
};

LineAction.prototype.mouseDown = function (gdoc, x, y, ev) {
  var me = this, already = false;
  switch (me.status) {
    case 0:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      me.status = 1;
      break;
    case 1:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      if (me.p1 === me.p2)
        break;
      me.status = 0;
      me.pointAction.reset();
      $.each(gb.utils.join(me.p1.__children, me.p2.__children), function (k, v) {
        if (v.type() == 'gli') {
          already = v;
          return false;
        }
      });
      if (already) {
        if (!gdoc.showHidden)
          gdoc.showHidden = true;
        gdoc.selection = {};
        gdoc.selection[already.id] = already;
      }
      else
        gdoc.run(new ConstructLineCommand(me.p1, me.p2));
      break;
  }
};

gb.tools['line'] = new LineAction();/**
 * @class CircleAction
 * @inherits GBAction
 */

function CircleAction() {
  this.init();
}

CircleAction.prototype = new Action();
CircleAction.prototype.text = '<img src="images/circ.png" title="Circle"/>';

CircleAction.prototype.init = function () {
  var me = this;
  (me.pointAction = new PointAction()).registerOnNewPoint(function (np) {
    if (me.status == 0) {
      me.p1 = np;
      me.p2 = np;
    } else if (me.status == 1)
      me.p2 = np;
  });
  me.reset();
};

CircleAction.prototype.reset = function () {
  var me = this;
  me.status = 0;
  me.p1 = null;
  me.p2 = null;
  me.pointAction.reset();
};

CircleAction.prototype.mouseMove = function (gdoc, x, y, ev) {
  var me = this, context, p1, p2, dx, dy;
  switch (me.status) {
    case 0:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      break;
    case 1:
      me.pointAction.mouseMove(gdoc, x, y, ev);
      context = gdoc.context;
      context.beginPath();
      x = me.pointAction.current[0];
      y = me.pointAction.current[1];
      p1 = me.p1.getPosition();
      p2 = [ x, y ];
      dx = p2[0] - p1[0];
      dy = p2[1] - p1[1];
      context.arc(p1[0], p1[1], Math.sqrt(dx * dx + dy * dy), 0, Math.PI * 2, false);
      context.closePath();
      context.strokeStyle = "#99d";
      context.lineWidth = context.transP2M(2);
      context.stroke();
      break;
  }
};

CircleAction.prototype.mouseUp = function (gdoc, x, y, ev) {
  var me = this;
  if (me.status == 1) {
    me.pointAction.mouseUp(gdoc, x, y, ev);
    if (me.p1 !== me.p2) {
      gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
      me.status = 0;
    }
  }
};


CircleAction.prototype.mouseDown = function (gdoc, x, y, ev) {
  var me = this;
  switch (me.status) {
    case 0:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      me.status = 1;
      break;
    case 1:
      me.pointAction.mouseUp(gdoc, x, y, ev);
      me.status = 0;
      if (me.p1 === me.p2)
        break;
      gdoc.run(new ConstructCircleCommand(me.p1, me.p2));
      break;
  }
}

gb.tools['circ'] = new CircleAction();/**
 * @class Command
 */
function Command() {
}

Command.prototype = {
  /**
   *
   * @param {GDoc} gdoc
   * @returns {Boolean}
   */
  canDo : function (gdoc) {
    throw 'canDoc(gdoc) not implemented';
  },
  /**
   *
   * @param {GDoc} gdoc
   */
  exec : function (gdoc) {
    throw 'exec(gdoc) not implemented';
  },
  /**
   *
   * @param {GDoc} gdoc
   */
  undo : function (gdoc) {
    throw 'undo(gdoc) not implemented';
  },
  /**
   *
   * @param {GDoc} gdoc
   */
  redo : function (gdoc) {
    throw 'redo(gdoc) not implemented';
  }
};/**
 * @class
 * @inherits Command
 */
function ConstructAngleBisector(p1, p2, ang) {
  this.p1 = p1;
  this.p2 = p2;
  this.ang = ang;
}

ConstructAngleBisector.prototype = new Command();

/**
 *
 * @param {GDoc} gdoc
 * @returns {Boolean}
 */
ConstructAngleBisector.prototype.canDo = function (gdoc) {
  return this.p1 && this.p2 && this.ang && this.p1.isPoint && this.p2.isPoint && this.ang.isPoint;
};


/**
 *
 * @param {GDoc} gdoc
 */
ConstructAngleBisector.prototype.createNew = function (gdoc) {
  var mark = new GBAngleBisectorMark(gdoc, this.p1, this.p2, this.ang);
  return [mark, new GBRay(gdoc, this.ang, mark)];
};


ConstructAngleBisector.prototype.exec = function (gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructAngleBisector.prototype.undo = function (gdoc) {
  gdoc.del(this.newObject[0]);
  gdoc.del(this.newObject[1]);
};

ConstructAngleBisector.prototype.redo = function (gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};/**
 * @class
 * @inherits {Command}
 */
function ConstructCommand() {
  Command.apply(this, arguments);
}
ConstructCommand.prototype = new Command();

/**
 * @field {Array} newObjects
 */
ConstructCommand.prototype.newObjects = [];

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.createNew = function (gdoc) {
  throw 'createNew(gdoc) not implemented';
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.exec = function (gdoc) {
  this.newObjects = this.createNew(gdoc);
  if (!(this.newObjects instanceof Array))
    this.newObjects = [this.newObjects];
  this.redo(gdoc);
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.undo = function (gdoc) {
  $.each(this.newObjects.reverse(), function (k, v) {
    gdoc.del(v);
  });
};

/**
 * @param {GDoc} gdoc
 */
ConstructCommand.prototype.redo = function (gdoc) {
  $.each(this.newObjects, function (k, v) {
    gdoc.add(v);
  });
  gdoc.selection = gb.utils.a2m(this.newObjects);
};function ConstructPointCommand(x, y) {
  this.x = x;
  this.y = y;
}
;

ConstructPointCommand.prototype = new ConstructCommand();

ConstructPointCommand.prototype.canDo = function (gdoc) {
  return !!(this.x !== undefined && this.y !== undefined);
};

ConstructPointCommand.prototype.createNew = function (gdoc) {
  return new GBPoint(gdoc, this.x, this.y);
};

/**
 * @class ConstructLineCommand
 * @extends ConstructCommand
 * @params {GBAbstractPoint} gpo1
 * @params {GBAbstractPoint} gpo2
 */
function ConstructLineCommand(gpo1, gpo2) {
  this.gpo1 = gpo1;
  this.gpo2 = gpo2;
}

ConstructLineCommand.prototype = new ConstructCommand();

ConstructLineCommand.prototype.canDo = function (gdoc) {
  return !!(this.gpo1 !== undefined && this.gpo2 !== undefined);
};

ConstructLineCommand.prototype.createNew = function (gdoc) {
  return new GBLine(gdoc, this.gpo1, this.gpo2);
};
function ConstructProjectionPoint(line, po) {
  this.line = line;
  this.po = po;
}
;

ConstructProjectionPoint.prototype = new ConstructCommand();

ConstructProjectionPoint.prototype.canDo = function (gdoc) {
  return !!(this.line !== undefined && this.line.isLine);
};

ConstructProjectionPoint.prototype.createNew = function (gdoc) {
  return new GBProjectionPoint(gdoc, this.line, this.po);
};function ConstructPerpLineCommand(point, line) {
  this.point = point;
  this.line = line;

}
;

ConstructPerpLineCommand.prototype = new Command();

ConstructPerpLineCommand.prototype.canDo = function (gdoc) {
  return !!(this.point !== undefined && this.line !== undefined && this.line.isLine);
};

ConstructPerpLineCommand.prototype.createNew = function (gdoc) {
  var mark = new GBPointMark(gdoc, this.point, this.line, true);
  return [mark, new GBXLine(gdoc, this.point, mark)];
};


ConstructPerpLineCommand.prototype.exec = function (gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructPerpLineCommand.prototype.undo = function (gdoc) {
  gdoc.del(this.newObject[0]);
  gdoc.del(this.newObject[1]);
};

ConstructPerpLineCommand.prototype.redo = function (gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};function ConstructParaLineCommand(point, line) {
  this.point = point;
  this.line = line;

}
;

ConstructParaLineCommand.prototype = new Command();

ConstructParaLineCommand.prototype.canDo = function (gdoc) {
  return !!(this.point !== undefined && this.line !== undefined && this.line.isLine);
};

ConstructParaLineCommand.prototype.createNew = function (gdoc) {
  var mark = new GBPointMark(gdoc, this.point, this.line, false);
  return [mark, new GBXLine(gdoc, this.point, mark)];
};


ConstructParaLineCommand.prototype.exec = function (gdoc) {
  this.newObject = this.createNew(gdoc);
  this.redo(gdoc);
};

ConstructParaLineCommand.prototype.undo = function (gdoc) {
  gdoc.del(this.newObject[0]);
  gdoc.del(this.newObject[1]);
};

ConstructParaLineCommand.prototype.redo = function (gdoc) {
  gdoc.add(this.newObject[0]);
  gdoc.add(this.newObject[1]);
};/**
 * @class
 * @inherits ConstructCommand
 */
function ConstructCircleCommand(center, on) {
  this.center = center;
  this.on = on;
}

ConstructCircleCommand.prototype = new ConstructCommand();

ConstructCircleCommand.prototype.canDo = function (gdoc) {
  return !!(this.center !== undefined && this.on !== undefined);
};

ConstructCircleCommand.prototype.createNew = function (gdoc) {
  return new GBCircle(gdoc, this.center, this.on);
};
function ConstructPoOCommand(obj, arg) {
  this.obj = obj;
  this.arg = arg;
}
;

ConstructPoOCommand.prototype = new ConstructCommand();

ConstructPoOCommand.prototype.canDo = function (gdoc) {
  return !!(this.obj !== undefined && this.arg !== undefined);
};

ConstructPoOCommand.prototype.createNew = function (gdoc) {
  return new GBPoO(gdoc, this.obj, this.arg);
};
function ConstructMidpointCommand(line) {
  this.line = line;
}
;

ConstructMidpointCommand.prototype = new ConstructCommand();

ConstructMidpointCommand.prototype.canDo = function (gdoc) {
  return !!(this.line !== undefined && this.line.type() == 'gli');
};

ConstructMidpointCommand.prototype.createNew = function (gdoc) {
  return new GBMidpoint(gdoc, this.line);
};function ConstructIntersectionCommand(obj1, obj2, min) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.min = min;
}

ConstructIntersectionCommand.prototype = new ConstructCommand();

/**
 *
 * @param {GDoc} gdoc
 */
ConstructIntersectionCommand.prototype.canDo = function (gdoc) {
  if (!(this.min >= 0) || this.obj1 === undefined || this.obj2 === undefined)
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > this.min;
};

ConstructIntersectionCommand.prototype.createNew = function (gdoc) {
  return new GBInters(gdoc, this.obj1, this.obj2, this.min);
};
/**
 * @class ConstructIntersectionsCommand
 * @inherits ConstructCommand
 * @param {Geom} obj1
 * @param {Geom} obj2
 */
function ConstructIntersectionsCommand(obj1, obj2) {
  ConstructCommand.apply(this, []);
  this.obj1 = obj1;
  this.obj2 = obj2;
}

ConstructIntersectionsCommand.prototype = new ConstructCommand();

/**
 * @private
 * @property {Geom} obj1
 */
ConstructIntersectionsCommand.prototype.obj1 = null;


/**
 * @property {Geom} obj2
 */
ConstructIntersectionsCommand.prototype.obj2 = null;


/**
 * @params {GDoc} gdoc
 * @inherits ConstructCommand
 */
ConstructIntersectionsCommand.prototype.canDo = function (gdoc) {
  if (!(this.obj1 !== undefined && this.obj2 !== undefined))
    return false;
  var inters = this.obj1.inters(this.obj2);
  return inters.length > 0;
};

ConstructIntersectionsCommand.prototype.createNew = function (gdoc) {
  var me = this;
  return $.map(me.obj1.inters(me.obj2), function (v, k) {
    return new GBInters(gdoc, me.obj1, me.obj2, k);
  });
};function ConstructLocusCommand(poo, target) {
  this.poo = poo;
  this.target = target;
}
;

ConstructLocusCommand.prototype = new ConstructCommand();

ConstructLocusCommand.prototype.canDo = function (gdoc) {
  if (!(this.poo !== undefined && this.target !== undefined && //
    this.poo.type() == "poo" && this.target.isPoint))
    return false;
  var v = {}, q = [ this.target ], qi = 0, curr;
  while (qi < q.length) {
    curr = q[qi++];
    if (curr == this.poo)
      return true;
    if (!v[curr.id]) {
      v[curr.id] = curr;
      $.each(curr.getParents(), function (k, v) {
        q.push(v);
      });
    }
  }
  return false;
};

ConstructLocusCommand.prototype.createNew = function (gdoc) {
  var range = this.poo.getParent(0).argRange && this.poo.getParent(0).argRange() || [0, 1];
  return new GBLocus(gdoc, this.poo, this.target, range[0], range[1]);
};
function ShowLabelCommand(list, show) {
  this.list = list;
  this.show = show;
}
;

ShowLabelCommand.prototype = new Command();

ShowLabelCommand.prototype.canDo = function (gdoc) {
  var any = false;
  $.each(this.list, function (k, v) {
    any = true;
    return false;
  });
  return any;
};

ShowLabelCommand.prototype.exec = function (gdoc) {
  var me = this;
  me.save = {};
  $.each(me.list, function (k, v) {
    me.save[v.id] = { sl : v.showLabel, name : v.name };
  });
  me.redo(gdoc);
};

ShowLabelCommand.prototype.undo = function (gdoc) {
  var me = this;
  $.each(me.list, function (k, v) {
    v.showLabel = me.save[v.id].sl;
    v.name = me.save[v.id].name;
    v.dirt();
  });
};

ShowLabelCommand.prototype.redo = function (gdoc) {
  var me = this;
  $.each(me.list, function (k, v) {
    v.showLabel = me.show;
    v.getName();
  });
};function DeleteCommand(list) {
  this.list = list;
}

DeleteCommand.prototype = new Command();
$.extend(DeleteCommand.prototype, {
  canDo : function (gdoc) {
    var any = false;
    $.each(this.list, function (k, v) {
      any = true;
      return false;
    });
    return any;
  },
  exec : function (gdoc) {
    var me = this, sels = {}, curr, list = [], i = 0;
    $.each(this.list, function (k, v) {
      sels[v.id] = v;
      list.push(v);
    });
    while (i < list.length) {
      curr = list[i++];
      $.each(curr.__children, function (k, v) {
        if (!sels[v.id]) {
          sels[v.id] = v;
          list.push(v);
        }
      });
    }
    this.list = list;
    this.redo(gdoc);
  },
  undo : function (gdoc) {
    gdoc.selection = {};
    $.each(this.list, function (k, obj) {
      gdoc.add(obj);
      // obj.load(v.json, gdoc);
    });
    $.each(this.list, function (k, v) {
      gdoc.selection[v.id] = gdoc.get(v.id);
    });
  },
  redo : function (gdoc) {
    gdoc.selection = {};
    $.each(this.list.reverse(), function (k, v) {
      gdoc.del(v);
    });
  }
});function HideCommand(list, hide) {
  this.list = list;
  this.hide = hide;
}
;

HideCommand.prototype = new Command();

HideCommand.prototype.canDo = function (gdoc) {
  var any = false;
  $.each(this.list, function (k, v) {
    any = true;
    return false;
  });
  return any;
};
HideCommand.prototype.exec = function (gdoc) {
  var save;
  save = this.save = [];
  $.each(this.list, function (k, v) {
    save.push({
      obj : v,
      hidden : v.hidden
    });
  });
  this.redo(gdoc);
};
HideCommand.prototype.undo = function (gdoc) {
  gdoc.selection = {};
  $.each(this.save, function (k, v) {
    v.obj.hidden = v.hidden;
    gdoc.selection[v.id] = v.obj;
  });
};
HideCommand.prototype.redo = function (gdoc) {
  var me = this;
  gdoc.selection = {};
  $.each(this.list, function (k, v) {
    v.hidden = me.hide;
    if (gdoc.hovering == v)
      gdoc.hovering = null;
  });
};/**
 * @constructor
 * @class TranslateCommand
 * @param dragList
 * @param fx
 * @param fy
 * @param tx
 * @param ty
 */
function TranslateCommand(dragList, fx, fy, tx, ty) {
  this.dragList = dragList;
  this.fx = fx;
  this.fy = fy;
  this.tx = tx;
  this.ty = ty;
}

TranslateCommand.prototype = new Command();
$.extend(TranslateCommand.prototype, {
  canDo : function (gdoc) {
    return !!(this.dragList && this.fx !== undefined && this.fy !== undefined
      && this.tx !== undefined && this.ty !== undefined);
  },
  exec : function (gdoc) {
    this.save = {};
    var me = this;
    $.each(this.dragList, function (k, v) {
      me.save[v.id] = v.save(gdoc);
    });
    this.redo(gdoc);
  },
  undo : function (gdoc) {
    var me = this;
    $.each(this.dragList, function (k, v) {
      v.load(me.save[v.id], gdoc);
    });
  },
  redo : function (gdoc) {
    var me = this;
    $.each(this.dragList, function (k, v) {
      v.drag([ me.fx, me.fy ], [ me.tx, me.ty ]);
    });
  }
});
/**
 * @constructor
 * @class TranslateLabelCommand
 * @param dragList
 * @param fx
 * @param fy
 * @param tx
 * @param ty
 */
function TranslateLabelCommand(obj, dx, dy) {
  this.obj = obj;
  this.dx = dx;
  this.dy = dy;
}
;

TranslateLabelCommand.prototype = new Command();
$.extend(TranslateLabelCommand.prototype, {
  canDo : function (gdoc) {
    return this.obj;
  },
  exec : function (gdoc) {
    this.save = {};
    var me = this;
    me.save = me.obj.save(gdoc);
    this.redo(gdoc);
  },
  undo : function (gdoc) {
    var me = this;
    me.obj.load(me.save, gdoc);
  },
  redo : function (gdoc) {
    var me = this;
    me.obj.dragLabel(gdoc.contextPhantom, me.dx, me.dy);
  }
});
