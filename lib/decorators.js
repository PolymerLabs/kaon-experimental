import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from 'kaon/symbols';

/**
 * A ES7 decorator applied to an ES7 class property to set up accessors that
 * trigger the data-binding system.
 */
export function property(clazzOrOpts, propName, descriptor) {
  if (clazzOrOpts.constructor && clazzOrOpts.constructor instanceof Function) {
    return _property(clazzOrOpts, propName, descriptor);
  }
  // invoked with options
  let opts = clazzOrOpts || {};
  return (clazz, propName, descriptor)  =>
      _property(clazz, propName, descriptor, opts.equality, opts.notify);
}

function _property(clazz, propName, descriptor, equality, notify) {
  let getter = descriptor.get;
  let setter = descriptor.set;
  let propertyType = clazz.__rtti__ ? clazz.__rtti__[propName] : null;

  clazz.__properties__ = clazz.__properties__ || {};
  clazz.__properties__[propName] = window[propertyType];

  let _get;
  let _set;
  let _check = (v) => false;
  let _storageProp = getter ? propName : Symbol(`__prop_${propName}`);

  if (equality === 'identity') {
    _check = function(v) { return this[_storageProp] === v; };
  } else if (equality instanceof Function) {
    _check = function(v) { return equality(this[_storageProp], v); };
  }

  if (getter) {
    _get = getter;
    if (setter) {
      _set = function(value) {
        if (_check(value)) {
          return
        }
        setter.call(this, value);
        this.invalidate();
      };
    } else {
      // warn on invalid yes-getter/no-setter combo?
    }
  } else {
    let storage = Symbol(`__prop_${propName}`);
    _get = function() { return this[storage]; };
    if (!setter) {
      _set = function(value) {
        if (_check(value)) {
          return
        }
        this[storage] = value;
        this.invalidate();
      }
    } else {
      // warn on invalid no-getter/yes-setter combo?
    }
  }

  return {
    configurable: true,
    enumerable: true,
    isProperty: true,
    initializer: descriptor.initializer,
    get: _get,
    set: _set,
  };
}

export let customElement = (tagName) => (clazz) => {
  clazz.__tagName__ = tagName;
  // Store the original constructor for use in the constructor-call trick
  // because registerElement overwrites it
  clazz.prototype.__constructor__ = clazz.prototype.constructor;
  document.registerElement(tagName, clazz);
  return clazz;
};
