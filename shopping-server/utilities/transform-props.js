/**
 * @module transformProps.
 *
 * Transform @object properties using @propKeys and @transformers. ES5 compatible.
 * Some of these mini-functions were broken out to increase performance.
 */

/**
 * @param {mixed} memo is the current value of the prop.
 * @param {function} transformer is a function.
 * @return {mixed}
 */
function reducer(memo, transformer) {
    return transformer(memo);
  }
  
  /**
   * @param {object} object
   * @param {function[]} transformers
   * @param {string[]} propKeys
   * @param {string} k
   */
  function forEachKey(object, transformers, propKeys, k) {
    var v = object[k];
  
    if (propKeys.hasOwnProperty(k)) {
      object[k] = transformers.reduce(reducer, v);
      return;
    }
    if (!(typeof v === 'object' && v !== null)) return;
    iterate(v, transformers, propKeys);
  }
  
  /**
   * @param {object} object
   * @param {function[]} transformers
   * @param {string[]} propKeys
   */
  function iterate(object, transformers, propKeys) {
    Object.keys(object).forEach(forEachKey.bind(null, object, transformers, propKeys));
  }
  
  /**
   * @param {function | function[]} transformers
   */
  function throwIfNotFuncOrAryOfFunc(transformers) {
    if (
      Array.isArray(transformers) && transformers.find(function find(item) {
        return typeof item !== 'function';
      })
      ||
      !Array.isArray(transformers) && typeof transformers !== 'function'
    ) {
      throw new TypeError('Expected @transformers to be a function or array of functions but received: "' + transformers + '".');
    }
  }
  
  /**
   * @param {object} object
   */
  function throwIfNotObj(object) {
    if (!(typeof object === 'object' && object !== null)) {
      throw new TypeError('Expected @object to be an object but received: "' + object + '".');
    }
  }
  
  /**
   * @param {str | str[]} propKeys
   */
  function throwIfNotStrOrAryOfStr(propKeys) {
    if (
      Array.isArray(propKeys) && propKeys.find(function find(item) {
        return typeof item !== 'string';
      })
      ||
      !Array.isArray(propKeys) && typeof propKeys !== 'string'
    ) {
      throw new TypeError('Expected @propKeys to be a string or array of strings but received: "' + propKeys + '".');
    }
  }
  
  /**
   * @param {object} object
   * @param {function[]} transformers
   * @param {string[]} propKeys
   * @return {object}
   */
  function transformProps(object, transformers, propKeys) {
    throwIfNotObj(object);
    throwIfNotFuncOrAryOfFunc(transformers);
    throwIfNotStrOrAryOfStr(propKeys);
    transformers = Array.isArray(transformers) ? transformers : [transformers];
    propKeys = Array.isArray(propKeys) ? propKeys : [propKeys];
    propKeys = propKeys.reduce(function reduce(memo, propKey) {
      memo[propKey] = 1;
      return memo;
    }, {});
    iterate(object, transformers, propKeys);
  
    return object;
  }

  /** Code below was added on top of the module for custom enhancement */
  
  function castToString(arg) {
    return String(arg);
  }

  // Overwriting functions on top to make transformations easy
  function castValuesToString(object, propKeys) {
    transformProps(object, castToString, propKeys);
  }
  
  module.exports.transformProps = transformProps;

  module.exports.castValuesToString = castValuesToString;