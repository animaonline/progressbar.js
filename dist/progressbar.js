(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ProgressBar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeMax = Math.max,
    nativeNow = Date.now;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = merge;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/*! For license information please see shifty.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("shifty",[],t):"object"==typeof exports?exports.shifty=t():e.shifty=t()}(self,(function(){return function(){"use strict";var e={933:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.setBezierFunction=t.getCubicBezierTransition=void 0;const i=n(55);t.getCubicBezierTransition=(e=.25,t=.25,n=.75,i=.75)=>s=>function(e,t,n,i,s,r){let a=0,o=0,u=0,l=0,c=0,h=0;const p=e=>((a*e+o)*e+u)*e,d=e=>(3*a*e+2*o)*e+u,_=e=>e>=0?e:0-e;return u=3*t,o=3*(i-t)-u,a=1-u-o,h=3*n,c=3*(s-n)-h,l=1-h-c,f=e,g=(e=>1/(200*e))(r),(e=>((l*e+c)*e+h)*e)(((e,t)=>{let n,i,s,r,a,o;for(s=e,o=0;o<8;o++){if(r=p(s)-e,_(r)<t)return s;if(a=d(s),_(a)<1e-6)break;s-=r/a}if(n=0,i=1,s=e,s<n)return n;if(s>i)return i;for(;n<i;){if(r=p(s),_(r-e)<t)return s;e>r?n=s:i=s,s=.5*(i-n)+n}return s})(f,g));var f,g}(s,e,t,n,i,1),t.setBezierFunction=(e,n,s,r,a)=>{const o=(0,t.getCubicBezierTransition)(n,s,r,a);return o.displayName=e,o.x1=n,o.y1=s,o.x2=r,o.y2=a,i.Tweenable.easing[e]=o}},156:function(e,t,n){var i=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n);var s=Object.getOwnPropertyDescriptor(t,n);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,i,s)}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),s=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||i(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=t.standardEasingFunctions=t.setBezierFunction=t.Scene=t.interpolate=t.tween=t.Tweenable=t.shouldScheduleUpdate=t.processTweens=void 0;const r=n(55);Object.defineProperty(t,"processTweens",{enumerable:!0,get:function(){return r.processTweens}}),Object.defineProperty(t,"shouldScheduleUpdate",{enumerable:!0,get:function(){return r.shouldScheduleUpdate}}),Object.defineProperty(t,"Tweenable",{enumerable:!0,get:function(){return r.Tweenable}}),Object.defineProperty(t,"tween",{enumerable:!0,get:function(){return r.tween}});var a=n(243);Object.defineProperty(t,"interpolate",{enumerable:!0,get:function(){return a.interpolate}});var o=n(612);Object.defineProperty(t,"Scene",{enumerable:!0,get:function(){return o.Scene}});var u=n(933);Object.defineProperty(t,"setBezierFunction",{enumerable:!0,get:function(){return u.setBezierFunction}});var l=n(809);Object.defineProperty(t,"standardEasingFunctions",{enumerable:!0,get:function(){return l.standardEasingFunctions}}),s(n(613),t),t.VERSION=String("3.0.4")},243:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.interpolate=void 0;const i=n(55),s=new i.Tweenable,{filters:r}=i.Tweenable;t.interpolate=(e,t,n,a=i.Tweenable.easing.linear,o=0)=>{const u=Object.assign({},e),l=(0,i.composeEasingObject)(e,a);s._filters.length=0,s.setState({}),s._currentState=u,s._originalState=e,s._targetState=t,s._easing=l;for(const e in r)r[e].doesApply(s)&&s._filters.push(r[e]);s._applyFilter("tweenCreated"),s._applyFilter("beforeTween");const c=(0,i.tweenProps)(n,u,e,t,1,o,l);return s._applyFilter("afterTween"),c}},612:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.Scene=void 0,t.Scene=class{constructor(...e){this._tweenables=[],e.forEach(this.add.bind(this))}get tweenables(){return[...this._tweenables]}get promises(){return this._tweenables.map((e=>e.then()))}add(e){return this._tweenables.push(e),e}remove(e){const t=this._tweenables.indexOf(e);return t>-1&&this._tweenables.splice(t,1),e}empty(){return this.tweenables.map(this.remove.bind(this))}get isPlaying(){return this._tweenables.some((({isPlaying:e})=>e))}tween(){return this._tweenables.forEach((e=>e.tween())),this}pause(){return this._tweenables.forEach((e=>e.pause())),this}resume(){return this._tweenables.filter((({hasEnded:e})=>!e)).forEach((e=>e.resume())),this}stop(e){return this._tweenables.forEach((t=>t.stop(e))),this}}},809:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.standardEasingFunctions=void 0,t.standardEasingFunctions=Object.freeze({linear:e=>e,easeInQuad:e=>Math.pow(e,2),easeOutQuad:e=>-(Math.pow(e-1,2)-1),easeInOutQuad:e=>(e/=.5)<1?.5*Math.pow(e,2):-.5*((e-=2)*e-2),easeInCubic:e=>Math.pow(e,3),easeOutCubic:e=>Math.pow(e-1,3)+1,easeInOutCubic:e=>(e/=.5)<1?.5*Math.pow(e,3):.5*(Math.pow(e-2,3)+2),easeInQuart:e=>Math.pow(e,4),easeOutQuart:e=>-(Math.pow(e-1,4)-1),easeInOutQuart:e=>(e/=.5)<1?.5*Math.pow(e,4):-.5*((e-=2)*Math.pow(e,3)-2),easeInQuint:e=>Math.pow(e,5),easeOutQuint:e=>Math.pow(e-1,5)+1,easeInOutQuint:e=>(e/=.5)<1?.5*Math.pow(e,5):.5*(Math.pow(e-2,5)+2),easeInSine:e=>1-Math.cos(e*(Math.PI/2)),easeOutSine:e=>Math.sin(e*(Math.PI/2)),easeInOutSine:e=>-.5*(Math.cos(Math.PI*e)-1),easeInExpo:e=>0===e?0:Math.pow(2,10*(e-1)),easeOutExpo:e=>1===e?1:1-Math.pow(2,-10*e),easeInOutExpo:e=>0===e?0:1===e?1:(e/=.5)<1?.5*Math.pow(2,10*(e-1)):.5*(2-Math.pow(2,-10*--e)),easeInCirc:e=>-(Math.sqrt(1-e*e)-1),easeOutCirc:e=>Math.sqrt(1-Math.pow(e-1,2)),easeInOutCirc:e=>(e/=.5)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1),easeOutBounce:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,easeInBack:e=>{const t=1.70158;return e*e*((t+1)*e-t)},easeOutBack:e=>{const t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},easeInOutBack:e=>{let t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},elastic:e=>-1*Math.pow(4,-8*e)*Math.sin((6*e-1)*(2*Math.PI)/2)+1,swingFromTo:e=>{let t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},swingFrom:e=>{const t=1.70158;return e*e*((t+1)*e-t)},swingTo:e=>{const t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},bounce:e=>e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375,bouncePast:e=>e<1/2.75?7.5625*e*e:e<2/2.75?2-(7.5625*(e-=1.5/2.75)*e+.75):e<2.5/2.75?2-(7.5625*(e-=2.25/2.75)*e+.9375):2-(7.5625*(e-=2.625/2.75)*e+.984375),easeFromTo:e=>(e/=.5)<1?.5*Math.pow(e,4):-.5*((e-=2)*Math.pow(e,3)-2),easeFrom:e=>Math.pow(e,4),easeTo:e=>Math.pow(e,.25)})},525:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.afterTween=t.beforeTween=t.tweenCreated=t.doesApply=void 0;const i=n(613),s=/(\d|-|\.)/,r=/([^\-0-9.]+)/g,a=/[0-9.-]+/g,o=(()=>{const e=a.source,t=/,\s*/.source;return new RegExp(`rgba?\\(${e}${t}${e}${t}${e}(${t}${e})?\\)`,"g")})(),u=/^.*\(/,l=/#([0-9]|[a-f]){3,6}/gi,c="VAL",h=(e,t)=>e.map(((e,n)=>`_${t}_${n}`)),p=e=>{let t=e.match(r);return t?(1===t.length||e.charAt(0).match(s))&&t.unshift(""):t=["",""],t.join(c)};function d(e){return parseInt(e,16)}const _=e=>`rgb(${(e=>{if(3===(e=e.replace(/#/,"")).length){const[t,n,i]=e.split("");e=t+t+n+n+i+i}return[d(e.substring(0,2)),d(e.substring(2,4)),d(e.substring(4,6))]})(e).join(",")})`,f=(e,t,n)=>{const i=t.match(e);let s=t.replace(e,c);return i&&i.forEach((e=>s=s.replace(c,n(e)))),s},g=e=>{for(const t in e){const n=e[t];"string"==typeof n&&n.match(l)&&(e[t]=f(l,n,_))}},w=e=>{var t,n;const i=null!==(t=e.match(a))&&void 0!==t?t:[],s=i.slice(0,3).map((e=>Math.floor(Number(e)))),r=null===(n=e.match(u))||void 0===n?void 0:n[0];if(3===i.length)return`${r}${s.join(",")})`;if(4===i.length)return`${r}${s.join(",")},${i[3]})`;throw new Error(`Invalid rgbChunk: ${e}`)},m=e=>{var t;return null!==(t=e.match(a))&&void 0!==t?t:[]},b=(e,t)=>{const n={};return t.forEach((t=>{n[t]=e[t],delete e[t]})),n},y=(e,t)=>t.map((t=>Number(e[t]))),v=(e,t)=>(t.forEach((t=>e=e.replace(c,String(+t.toFixed(4))))),e);t.doesApply=e=>{for(const t in e._currentState)if("string"==typeof e._currentState[t])return!0;return!1},t.tweenCreated=function(e){const{_currentState:t,_originalState:n,_targetState:i}=e;[t,n,i].forEach(g),e._tokenData=(e=>{var t;const n={};for(const i in e){const s=e[i];"string"==typeof s&&(n[i]={formatString:p(s),chunkNames:h(null===(t=m(s))||void 0===t?void 0:t.map(Number),i)})}return n})(t)},t.beforeTween=function(e){const{_currentState:t,_originalState:n,_targetState:s,_easing:r,_tokenData:a}=e;"function"!=typeof r&&a&&((e,t)=>{var n;for(const s in t){const{chunkNames:r}=t[s],a=e[s];if("string"==typeof a){const t=a.split(" "),s=t[t.length-1];for(let a=0;a<r.length;a++){const o=r[a],u=null!==(n=t[a])&&void 0!==n?n:s;(0,i.isEasingKey)(u)&&(e[o]=u)}}else r.forEach((t=>e[t]=a));delete e[s]}})(r,a),[t,n,s].forEach((e=>((e,t)=>{for(const n in t)m(String(e[n])).forEach(((i,s)=>e[t[n].chunkNames[s]]=+i)),delete e[n]})(e,null!=a?a:{})))},t.afterTween=function(e){const{_currentState:t,_originalState:n,_targetState:i,_easing:s,_tokenData:r}=e;[t,n,i].forEach((e=>((e,t)=>{for(const n in t){const{chunkNames:i,formatString:s}=t[n],r=v(s,y(b(e,i),i));e[n]=f(o,r,w)}})(e,null!=r?r:{}))),"function"!=typeof s&&r&&((e,t)=>{for(const n in t){const{chunkNames:i}=t[n],s=e[i[0]];e[n]="string"==typeof s?i.map((t=>{const n=e[t];return delete e[t],n})).join(" "):s}})(s,r)}},55:function(e,t,n){var i,s=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n);var s=Object.getOwnPropertyDescriptor(t,n);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,i,s)}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),r=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&s(t,e,n);return r(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.shouldScheduleUpdate=t.tween=t.Tweenable=t.composeEasingObject=t.scheduleUpdate=t.processTweens=t.tweenProps=t.getListTail=t.getListHead=t.resetList=void 0;const o=n(809),u=n(933),l=n(613),c=a(n(525)),h="linear",p=1e3/60,d="undefined"!=typeof window?window:n.g,_="afterTween",f="beforeTween",g="string",w="function";let m=d.requestAnimationFrame;m||(m="undefined"==typeof window?setTimeout:window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||window.mozCancelRequestAnimationFrame&&window.mozRequestAnimationFrame||setTimeout);const b=()=>{};let y=null,v=null;t.resetList=()=>{y=v=null},t.getListHead=()=>y,t.getListTail=()=>v,t.tweenProps=(e,t,n,i,s,r,a)=>{var u;let l,c=0;const h=e<r?0:(e-r)/s;let p;for(const e in t){if(typeof a===w)p=a;else{const t=a[e];p=typeof t===w?t:null!==(u=E.easing[t])&&void 0!==u?u:o.standardEasingFunctions.linear}c=p(h),l=n[e],t[e]=l+(i[e]-l)*c}return t};const S=(e,n)=>{var i;let s=null!==(i=e._timestamp)&&void 0!==i?i:0;const r=e._currentState,a=e._delay;if(n<s+a)return;let o=e._duration;const u=e._targetState,l=s+a+o;let c=n>l?l:n;e._hasEnded=c>=l;const h=o-(l-c);if(e._hasEnded)return e._render(u,h,e._data),e.stop(!0);e._applyFilter(f),c<s+a?s=o=c=1:s+=a,(0,t.tweenProps)(c,r,e._originalState,u,o,s,e._easing),e._applyFilter(_),e._render(r,h,e._data)};t.processTweens=()=>{let e;const t=E.now();let n=y;for(;n;)e=n._next,S(n,t),n=e};const{now:O}=Date;let j,M=!1;t.scheduleUpdate=()=>{j=O(),M&&m.call(d,t.scheduleUpdate,p),(0,t.processTweens)()},t.composeEasingObject=(e,t=h,n={})=>{if(typeof t===g&&(0,l.isEasingKey)(t))return E.easing[t];if(Array.isArray(t))return(0,u.getCubicBezierTransition)(...t);if("object"==typeof n)if(typeof t===g||typeof t===w)for(const i in e)n[i]=t;else for(const i in e)n[i]=t[i]||h;return n};const P=(()=>{let e,t;return n=>{e=null,t=null,n===y?(y=n._next,y?y._previous=null:v=null):n===v?(v=n._previous,v?v._next=null:y=null):(e=n._previous,t=n._next,e&&(e._next=t),t&&(t._previous=e)),n._previous=n._next=null}})(),T=typeof Promise===w?Promise:null;class E{constructor(e={},t){this[i]="Promise",this._next=null,this._previous=null,this._config={},this._data={},this._delay=0,this._duration=500,this._filters=[],this._timestamp=null,this._hasEnded=!1,this._resolve=null,this._reject=null,this._originalState={},this._targetState={},this._start=b,this._render=b,this._promiseCtor=T,this._promise=null,this._isPlaying=!1,this._pausedAtTime=null,this._easing={},this._currentState=e||{},t&&this.setConfig(t)}_applyFilter(e){var t;for(let n=this._filters.length;n>0;n--){const i=this._filters[n-n];null===(t=i[e])||void 0===t||t.call(i,this)}}tween(e){return this._isPlaying&&this.stop(),!e&&this._config||this.setConfig(e),this._pausedAtTime=null,this._timestamp=E.now(),this._start(this.state,this._data),this._delay&&this._render(this._currentState,0,this._data),this._resume(this._timestamp)}setConfig(e={}){var n;const{_config:i}=this;let s;for(s in e)i[s]=e[s];const{promise:r=this._promiseCtor,start:a=b,finish:o,render:u=b}=i;this._data=i.data||this._data,this._isPlaying=!1,this._pausedAtTime=null,this._delay=e.delay||0,this._start=a,this._render=u,this._duration=i.duration||500,this._promiseCtor=r,o&&(this._resolve=o);const{from:l,to:c={}}=e,{_currentState:h,_originalState:p,_targetState:d}=this;for(const e in l)h[e]=l[e];let _=!1;for(const e in h){const t=h[e];_||typeof t!==g||(_=!0),p[e]=t,d[e]=null!==(n=c[e])&&void 0!==n?n:t}if(this._easing=(0,t.composeEasingObject)(this._currentState,i.easing,this._easing),this._filters.length=0,_){for(const e in E.filters)E.filters[e].doesApply(this)&&this._filters.push(E.filters[e]);this._applyFilter("tweenCreated")}return this}then(e,t){if(!this._promiseCtor)throw new Error("Promise implementation is unavailable");return this._promise=new this._promiseCtor(((e,t)=>{this._resolve=e,this._reject=t})),this._promise.then(e,t)}catch(e){return this.then().catch(e)}finally(e){return this.then().finally(e)}get state(){return Object.assign({},this._currentState)}setState(e){this._currentState=e}pause(){return this._isPlaying?(this._pausedAtTime=E.now(),this._isPlaying=!1,P(this),this):this}resume(){return this._resume()}_resume(e=E.now()){if(null===this._timestamp)return this.tween();if(this._isPlaying&&this._promise)return this;this._pausedAtTime&&(this._timestamp+=e-this._pausedAtTime,this._pausedAtTime=null),this._isPlaying=!0;const n=Boolean(y);return null===y?(y=this,v=this):(this._previous=v,v&&(v._next=this),v=this),n||(0,t.shouldScheduleUpdate)(!0),this}seek(e){var t;e=Math.max(e,0);const n=E.now();return(null!==(t=this._timestamp)&&void 0!==t?t:0)+e===0||(this._timestamp=n-e,S(this,n)),this}stop(e=!1){var n;return this._isPlaying?(this._isPlaying=!1,P(this),e&&(this._applyFilter(f),(0,t.tweenProps)(1,this._currentState,this._originalState,this._targetState,1,0,this._easing),this._applyFilter(_),this._applyFilter("afterTweenEnd")),null===(n=this._resolve)||void 0===n||n.call(this,{data:this._data,state:this._currentState,tweenable:this}),this._resolve=null,this._reject=null,this):this}cancel(e=!1){var t;const{_currentState:n,_data:i,_isPlaying:s}=this;return s?(null===(t=this._reject)||void 0===t||t.call(this,{data:i,state:n,tweenable:this}),this._resolve=null,this._reject=null,this.stop(e)):this}get isPlaying(){return this._isPlaying}get hasEnded(){return this._hasEnded}data(e=null){return e&&(this._data=Object.assign({},e)),this._data}dispose(){for(const e in this)delete this[e]}}t.Tweenable=E,i=Symbol.toStringTag,E.now=()=>(M||(j=O()),j),E.setScheduleFunction=e=>m=e,E.filters={token:c},E.easing=Object.create(o.standardEasingFunctions),t.tween=function(e={}){return new E({},{}).tween(e)},t.shouldScheduleUpdate=e=>{e&&M||(M=e,e&&(0,t.scheduleUpdate)())}},613:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.isEasingKey=void 0;const i=n(55);t.isEasingKey=e=>e in i.Tweenable.easing}},t={};function n(i){var s=t[i];if(void 0!==s)return s.exports;var r=t[i]={exports:{}};return e[i].call(r.exports,r,r.exports,n),r.exports}return n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n(156)}()}));

},{}],3:[function(require,module,exports){
// Circle shaped progress bar

var Shape = require('./shape');
var utils = require('./utils');

var Circle = function Circle(container, options) {
    // Use two arcs to form a circle
    // See this answer http://stackoverflow.com/a/10477334/1446092
    this._pathTemplate =
        'M 50,50 m 0,-{radius}' +
        ' a {radius},{radius} 0 1 1 0,{2radius}' +
        ' a {radius},{radius} 0 1 1 0,-{2radius}';

    this.containerAspectRatio = 1;

    Shape.apply(this, arguments);
};

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype._pathString = function _pathString(opts) {
    var widthOfWider = opts.strokeWidth;
    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
        widthOfWider = opts.trailWidth;
    }

    var r = 50 - widthOfWider / 2;

    return utils.render(this._pathTemplate, {
        radius: r,
        '2radius': r * 2
    });
};

Circle.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Circle;

},{"./shape":8,"./utils":10}],4:[function(require,module,exports){
// Line shaped progress bar

var Shape = require('./shape');
var utils = require('./utils');

var Line = function Line(container, options) {
    this._pathTemplate = options.vertical
        ? 'M {center},100 L {center},0'
        : 'M 0,{center} L 100,{center}';
    Shape.apply(this, arguments);
};

Line.prototype = new Shape();
Line.prototype.constructor = Line;

Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    var viewBoxStr = opts.vertical
        ? '0 0 ' + opts.strokeWidth + ' 100'
        : '0 0 100 ' + opts.strokeWidth;
    svg.setAttribute('viewBox', viewBoxStr);
    svg.setAttribute('preserveAspectRatio', 'none');
};

Line.prototype._pathString = function _pathString(opts) {
    return utils.render(this._pathTemplate, {
        center: opts.strokeWidth / 2
    });
};

Line.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Line;

},{"./shape":8,"./utils":10}],5:[function(require,module,exports){
module.exports = {
    // Higher level API, different shaped progress bars
    Line: require('./line'),
    Circle: require('./circle'),
    SemiCircle: require('./semicircle'),
    Square: require('./square'),

    // Lower level API to use any SVG path
    Path: require('./path'),

    // Base-class for creating new custom shapes
    // to be in line with the API of built-in shapes
    // Undocumented.
    Shape: require('./shape'),

    // Internal utils, undocumented.
    utils: require('./utils')
};

},{"./circle":3,"./line":4,"./path":6,"./semicircle":7,"./shape":8,"./square":9,"./utils":10}],6:[function(require,module,exports){
// Lower level API to animate any kind of svg path

var shifty = require('shifty');
var utils = require('./utils');

var Tweenable = shifty.Tweenable;
var interpolate = shifty.interpolate;

var EASING_ALIASES = {
    easeIn: 'easeInCubic',
    easeOut: 'easeOutCubic',
    easeInOut: 'easeInOutCubic'
};

var Path = function Path(path, opts) {
    if (!(this instanceof Path)) {
        throw new Error('Constructor was called without new keyword');
    }

    opts = utils.extend({
        delay: 0,
        duration: 800,
        easing: 'linear',
        from: {},
        to: {},
        step: function() {}
    }, opts);

    var element;
    if (utils.isString(path)) {
        element = document.querySelector(path);
    } else {
        element = path;
    }

    this.path = element;
    this._opts = opts;
    this._tweenable = null;

    var length = this.path.getTotalLength();
    this.path.style.strokeDasharray = length + ' ' + length;
    this.set(0);
};

Path.prototype.value = function value() {
    var offset = this._getComputedDashOffset();
    var length = this.path.getTotalLength();
    return parseFloat((1 - offset / length).toFixed(6), 10);
};

Path.prototype.set = function set(progress) {
    this.stop();
    this.path.style.strokeDashoffset = this._progressToOffset(progress);
    var step = this._opts.step;
    if (utils.isFunction(step)) {
        var easing = this._easing(this._opts.easing);
        var values = this._calculateTo(progress, easing);
        var reference = this._opts.shape || this;
        step(values, reference, this._opts.attachment);
    }
};

Path.prototype.stop = function stop() {
    this._stopTween();
    this.path.style.strokeDashoffset = this._getComputedDashOffset();
};

Path.prototype.animate = function animate(progress, opts, cb) {
    opts = opts || {};
    if (utils.isFunction(opts)) {
        cb = opts;
        opts = {};
    }

    var passedOpts = utils.extend({}, opts);
    var defaultOpts = utils.extend({}, this._opts);
    opts = utils.extend(defaultOpts, opts);

    var shiftyEasing = this._easing(opts.easing);
    var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

    this.stop();
    this.path.getBoundingClientRect();

    var offset = this._getComputedDashOffset();
    var newOffset = this._progressToOffset(progress);

    var self = this;
    this._tweenable = new Tweenable();
    this._tweenable.tween({
        from: utils.extend({ offset: offset }, values.from),
        to: utils.extend({ offset: newOffset }, values.to),
        duration: opts.duration,
        delay: opts.delay,
        easing: shiftyEasing,
        step: function(state) {
            self.path.style.strokeDashoffset = state.offset;
            var reference = opts.shape || self;
            opts.step(state, reference, opts.attachment);
        }
    }).then(function() {
        if (utils.isFunction(cb)) {
            cb();
        }
    }).catch(function(err) {
        console.error('Error in tweening:', err);
        throw err;
    });
};

Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
    var computedStyle = window.getComputedStyle(this.path, null);
    return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
};

Path.prototype._progressToOffset = function _progressToOffset(progress) {
    var length = this.path.getTotalLength();
    return length - progress * length;
};

Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
    if (opts.from && opts.to) {
        return { from: opts.from, to: opts.to };
    }
    return { from: this._calculateFrom(easing), to: this._calculateTo(progress, easing) };
};

Path.prototype._calculateFrom = function _calculateFrom(easing) {
    return interpolate(this._opts.from, this._opts.to, this.value(), easing);
};

Path.prototype._calculateTo = function _calculateTo(progress, easing) {
    return interpolate(this._opts.from, this._opts.to, progress, easing);
};

Path.prototype._stopTween = function _stopTween() {
    if (this._tweenable !== null) {
        this._tweenable.stop(true);
        this._tweenable = null;
    }
};

Path.prototype._easing = function _easing(easing) {
    return EASING_ALIASES[easing] || easing;
};

module.exports = Path;

},{"./utils":10,"shifty":2}],7:[function(require,module,exports){
// Semi-SemiCircle shaped progress bar

var Shape = require('./shape');
var Circle = require('./circle');
var utils = require('./utils');

var SemiCircle = function SemiCircle(container, options) {
    // Use one arc to form a SemiCircle
    // See this answer http://stackoverflow.com/a/10477334/1446092
    this._pathTemplate =
        'M 50,50 m -{radius},0' +
        ' a {radius},{radius} 0 1 1 {2radius},0';

    this.containerAspectRatio = 2;

    Shape.apply(this, arguments);
};

SemiCircle.prototype = new Shape();
SemiCircle.prototype.constructor = SemiCircle;

SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 50');
};

SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(
    opts,
    container,
    textContainer
) {
    if (opts.text.style) {
        // Reset top style
        textContainer.style.top = 'auto';
        textContainer.style.bottom = '0';

        if (opts.text.alignToBottom) {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
        } else {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
        }
    }
};

// Share functionality with Circle, just have different path
SemiCircle.prototype._pathString = Circle.prototype._pathString;
SemiCircle.prototype._trailString = Circle.prototype._trailString;

module.exports = SemiCircle;

},{"./circle":3,"./shape":8,"./utils":10}],8:[function(require,module,exports){
// Base object for different progress bar shapes

var Path = require('./path');
var utils = require('./utils');

var DESTROYED_ERROR = 'Object is destroyed';

var Shape = function Shape(container, opts) {
    // Throw a better error if progress bars are not initialized with `new`
    // keyword
    if (!(this instanceof Shape)) {
        throw new Error('Constructor was called without new keyword');
    }

    // Prevent calling constructor without parameters so inheritance
    // works correctly. To understand, this is how Shape is inherited:
    //
    //   Line.prototype = new Shape();
    //
    // We just want to set the prototype for Line.
    if (arguments.length === 0) {
        return;
    }

    // Default parameters for progress bar creation
    this._opts = utils.extend({
        color: '#555',
        strokeWidth: 1.0,
        trailColor: null,
        trailWidth: null,
        fill: null,
        text: {
            style: {
                color: null,
                position: 'absolute',
                left: '50%',
                top: '50%',
                padding: 0,
                margin: 0,
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            },
            autoStyleContainer: true,
            alignToBottom: true,
            value: null,
            className: 'progressbar-text'
        },
        svgStyle: {
            display: 'block',
            width: '100%'
        },
        warnings: false
    }, opts, true);  // Use recursive extend

    // If user specifies e.g. svgStyle or text style, the whole object
    // should replace the defaults to make working with styles easier
    if (utils.isObject(opts) && opts.svgStyle !== undefined) {
        this._opts.svgStyle = opts.svgStyle;
    }
    if (utils.isObject(opts) && utils.isObject(opts.text) && opts.text.style !== undefined) {
        this._opts.text.style = opts.text.style;
    }

    var svgView = this._createSvgView(this._opts);

    var element;
    if (utils.isString(container)) {
        element = document.querySelector(container);
    } else {
        element = container;
    }

    if (!element) {
        throw new Error('Container does not exist: ' + container);
    }

    this._container = element;
    this._container.appendChild(svgView.svg);
    if (this._opts.warnings) {
        this._warnContainerAspectRatio(this._container);
    }

    if (this._opts.svgStyle) {
        utils.setStyles(svgView.svg, this._opts.svgStyle);
    }

    // Expose public attributes before Path initialization
    this.svg = svgView.svg;
    this.path = svgView.path;
    this.trail = svgView.trail;
    this.text = null;

    var newOpts = utils.extend({
        attachment: undefined,
        shape: this
    }, this._opts);
    this._progressPath = new Path(svgView.path, newOpts);

    if (utils.isObject(this._opts.text) && this._opts.text.value !== null) {
        this.setText(this._opts.text.value);
    }
};

Shape.prototype.animate = function animate(progress, opts, cb) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.animate(progress, opts, cb);
};

Shape.prototype.stop = function stop() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    // Don't crash if stop is called inside step function
    if (this._progressPath === undefined) {
        return;
    }

    this._progressPath.stop();
};

Shape.prototype.pause = function pause() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return;
    }

    if (!this._progressPath._tweenable) {
        // It seems that we can't pause this
        return;
    }

    this._progressPath._tweenable.pause();
};

Shape.prototype.resume = function resume() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return;
    }

    if (!this._progressPath._tweenable) {
        // It seems that we can't resume this
        return;
    }

    this._progressPath._tweenable.resume();
};

Shape.prototype.destroy = function destroy() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this.stop();
    this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
    this.path = null;
    this.trail = null;
    this._progressPath = null;

    if (this.text !== null) {
        this.text.parentNode.removeChild(this.text);
        this.text = null;
    }
};

Shape.prototype.set = function set(progress) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.set(progress);
};

Shape.prototype.value = function value() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return 0;
    }

    return this._progressPath.value();
};

Shape.prototype.setText = function setText(newText) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this.text === null) {
        // Create new text node
        this.text = this._createTextContainer(this._opts, this._container);
        this._container.appendChild(this.text);
    }

    // Remove previous text and add new
    if (utils.isObject(newText)) {
        utils.removeChildren(this.text);
        this.text.appendChild(newText);
    } else {
        this.text.innerHTML = newText;
    }
};

Shape.prototype._createSvgView = function _createSvgView(opts) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._initializeSvg(svg, opts);

    var trailPath = null;
    // Each option listed in the if condition are 'triggers' for creating
    // the trail path
    if (opts.trailColor || opts.trailWidth) {
        trailPath = this._createTrail(opts);
        svg.appendChild(trailPath);
    }

    var path = this._createPath(opts);
    svg.appendChild(path);

    return {
        svg: svg,
        path: path,
        trail: trailPath
    };
};

Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 100');
};

Shape.prototype._createPath = function _createPath(opts) {
    var pathString = this._pathString(opts);
    return this._createPathElement(pathString, opts);
};

Shape.prototype._createTrail = function _createTrail(opts) {
    // Create path string with original passed options
    var pathString = this._trailString(opts);

    // Prevent modifying original
    var newOpts = utils.extend({}, opts);

    // Defaults for parameters which modify trail path
    if (!newOpts.trailColor) {
        newOpts.trailColor = '#eee';
    }
    if (!newOpts.trailWidth) {
        newOpts.trailWidth = newOpts.strokeWidth;
    }

    newOpts.color = newOpts.trailColor;
    newOpts.strokeWidth = newOpts.trailWidth;

    // When trail path is set, fill must be set for it instead of the
    // actual path to prevent trail stroke from clipping
    newOpts.fill = null;

    return this._createPathElement(pathString, newOpts);
};

Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', opts.color);
    path.setAttribute('stroke-width', opts.strokeWidth);

    if (opts.fill) {
        path.setAttribute('fill', opts.fill);
    } else {
        path.setAttribute('fill-opacity', '0');
    }

    return path;
};

Shape.prototype._createTextContainer = function _createTextContainer(opts, container) {
    var textContainer = document.createElement('div');
    textContainer.className = opts.text.className;

    var textStyle = opts.text.style;
    if (textStyle) {
        if (opts.text.autoStyleContainer) {
            container.style.position = 'relative';
        }

        utils.setStyles(textContainer, textStyle);
        // Default text color to progress bar's color
        if (!textStyle.color) {
            textContainer.style.color = opts.color;
        }
    }

    this._initializeTextContainer(opts, container, textContainer);
    return textContainer;
};

// Give custom shapes possibility to modify text element
Shape.prototype._initializeTextContainer = function(opts, container, element) {
    // By default, no-op
    // Custom shapes should respect API options, such as text.style
};

Shape.prototype._pathString = function _pathString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._trailString = function _trailString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
    if (!this.containerAspectRatio) {
        return;
    }

    var computedStyle = window.getComputedStyle(container, null);
    var width = parseFloat(computedStyle.getPropertyValue('width'), 10);
    var height = parseFloat(computedStyle.getPropertyValue('height'), 10);
    if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
        console.warn(
            'Incorrect aspect ratio of container',
            '#' + container.id,
            'detected:',
            computedStyle.getPropertyValue('width') + '(width)',
            '/',
            computedStyle.getPropertyValue('height') + '(height)',
            '=',
            width / height
        );

        console.warn(
            'Aspect ratio of should be',
            this.containerAspectRatio
        );
    }
};

module.exports = Shape;

},{"./path":6,"./utils":10}],9:[function(require,module,exports){
// Square shaped progress bar
// Note: Square is not core part of API anymore. It's left here
//       for reference. square is not included to the progressbar
//       build anymore

var Shape = require('./shape');
var utils = require('./utils');

var Square = function Square(container, options) {
    this._pathTemplate =
        'M 0,{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{strokeWidth}';

    this._trailTemplate =
        'M {startMargin},{halfOfStrokeWidth}' +
        ' L {width},{halfOfStrokeWidth}' +
        ' L {width},{width}' +
        ' L {halfOfStrokeWidth},{width}' +
        ' L {halfOfStrokeWidth},{halfOfStrokeWidth}';

    Shape.apply(this, arguments);
};

Square.prototype = new Shape();
Square.prototype.constructor = Square;

Square.prototype._pathString = function _pathString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._pathTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2
    });
};

Square.prototype._trailString = function _trailString(opts) {
    var w = 100 - opts.strokeWidth / 2;

    return utils.render(this._trailTemplate, {
        width: w,
        strokeWidth: opts.strokeWidth,
        halfOfStrokeWidth: opts.strokeWidth / 2,
        startMargin: opts.strokeWidth / 2 - opts.trailWidth / 2
    });
};

module.exports = Square;

},{"./shape":8,"./utils":10}],10:[function(require,module,exports){
// Utility functions

var merge = require('lodash.merge');

var PREFIXES = 'Webkit Moz O ms'.split(' ');
var FLOAT_COMPARISON_EPSILON = 0.001;

// Renders templates with given variables. Variables must be surrounded with
// braces without any spaces, e.g. {variable}
// All instances of variable placeholders will be replaced with given content
// Example:
// render('Hello, {message}!', {message: 'world'})
function render(template, vars) {
    var rendered = template;

    for (var key in vars) {
        if (vars.hasOwnProperty(key)) {
            var val = vars[key];
            var regExpString = '\\{' + key + '\\}';
            var regExp = new RegExp(regExpString, 'g');

            rendered = rendered.replace(regExp, val);
        }
    }

    return rendered;
}

function setStyle(element, style, value) {
    var elStyle = element.style;  // cache for performance

    for (var i = 0; i < PREFIXES.length; ++i) {
        var prefix = PREFIXES[i];
        elStyle[prefix + capitalize(style)] = value;
    }

    elStyle[style] = value;
}

function setStyles(element, styles) {
    forEachObject(styles, function(styleValue, styleName) {
        // Allow disabling some individual styles by setting them
        // to null or undefined
        if (styleValue === null || styleValue === undefined) {
            return;
        }

        // If style's value is {prefix: true, value: '50%'},
        // Set also browser prefixed styles
        if (isObject(styleValue) && styleValue.prefix === true) {
            setStyle(element, styleName, styleValue.value);
        } else {
            element.style[styleName] = styleValue;
        }
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// Returns true if `obj` is object as in {a: 1, b: 2}, not if it's function or
// array
function isObject(obj) {
    if (isArray(obj)) {
        return false;
    }

    var type = typeof obj;
    return type === 'object' && !!obj;
}

function forEachObject(object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var val = object[key];
            callback(val, key);
        }
    }
}

function floatEquals(a, b) {
    return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON;
}

// https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements
function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

module.exports = {
    extend: merge,
    render: render,
    setStyle: setStyle,
    setStyles: setStyles,
    capitalize: capitalize,
    isString: isString,
    isFunction: isFunction,
    isObject: isObject,
    forEachObject: forEachObject,
    floatEquals: floatEquals,
    removeChildren: removeChildren
};

},{"lodash.merge":1}]},{},[5])(5)
});
