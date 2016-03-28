import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from './symbols';

export type Equality = EqualityFunction | 'identity';
export interface EqualityFunction {
  (a: any, b: any): boolean;
}

export interface PropertyOptions {
  equality?: Equality;
  notify?: boolean;
};

export interface ExtendedPropertyDescriptor extends PropertyDescriptor {
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
export function property<T>(options?: PropertyOptions) {
  return (clazz: any, propName: string) : any => {

    let equality : Equality = options && options.equality;
    let notify : boolean = options && options.notify;

    // TS property decorators don't receive a descriptor
    let getter = null; //descriptor && descriptor.get;
    let setter = null; //descriptor && descriptor.set;

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
      // initializer: descriptor && descriptor.initializer,
      get: _get,
      set: _set,
    };
  }
}
