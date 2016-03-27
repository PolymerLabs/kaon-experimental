import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from './symbols';

interface Decorator {
  (clazz: Function, propName: string, descriptor: ExtendedPropertyDescriptor): PropertyDescriptor;
}

type Equality = EqualityFunction | 'identity';
interface EqualityFunction {
  (a: any, b: any): boolean;
}

interface PropertyOptions {
  equality?: Equality;
  notify?: boolean;
};

interface ExtendedPropertyDescriptor extends PropertyDescriptor {
  isProperty?: boolean,
  initializer?: () => void,
}

/**
 * A ES7 decorator applied to an ES7 class property to set up accessors that
 * trigger the data-binding system.
 *
 * `property` is either a decorator function that can be applied with
 * `@property`, or a function that takes a configuration and returns a decorator
 * that's applied like `@property({equality: 'identity'})`
 */
export function property(
    clazz: Function,
    propName: string,
    descriptor: ExtendedPropertyDescriptor): ExtendedPropertyDescriptor;

export function property(options: PropertyOptions): Decorator;

export function property(
    clazzOrOpts: Function | PropertyOptions,
    propName?: string,
    descriptor?: ExtendedPropertyDescriptor):
        ExtendedPropertyDescriptor | Decorator {

  // invoked as a decorator
  if (clazzOrOpts.constructor && clazzOrOpts.constructor instanceof Function) {
    // if (descriptor == null) {
    //   // TS decorators don't receive the descriptor
    //   descriptor = Object.getOwnPropertyDescriptor(clazzOrOpts, propName);
    //   console.log('TS', clazzOrOpts, propName, descriptor);
    // }
    return _property(<Function>clazzOrOpts, propName, descriptor);
  }

  // invoked as a function with options
  let opts: PropertyOptions = clazzOrOpts || {};
  return <Decorator>((clazz, propName, descriptor)  =>
      _property(clazz, propName, descriptor, opts.equality, opts.notify));
}

function _property(
    clazz: Function,
    propName: string,
    descriptor: ExtendedPropertyDescriptor,
    equality?: Equality,
    notify?: boolean): ExtendedPropertyDescriptor {

  // TS property decorators don't receive a descriptor
  let getter = descriptor && descriptor.get;
  let setter = descriptor && descriptor.set;

  // let propertyType = clazz.__rtti__ ? clazz.__rtti__[propName] : null;
  //
  // clazz.__properties__ = clazz.__properties__ || {};
  // clazz.__properties__[propName] = window[propertyType];

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
        // TODO: async fire an event to implement notify
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
        // TODO: async fire an event to implement notify
      }
    } else {
      // warn on invalid no-getter/yes-setter combo?
    }
  }

  return {
    configurable: true,
    enumerable: true,
    isProperty: true,
    initializer: descriptor && descriptor.initializer,
    get: _get,
    set: _set,
  };
}

declare var document;

export let customElement = (tagName) => (clazz) => {
  clazz.__tagName__ = tagName;
  // Store the original constructor for use in the constructor-call trick
  // because registerElement overwrites it
  clazz.prototype.__constructor__ = clazz.prototype.constructor;
  document.registerElement(tagName, clazz);
  return clazz;
};
