import {Constructable, Base} from './util';

const guardedGetters = [
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'offsetHeight',
  'offsetParent',
  'clientLeft',
  'clientTop',
  'clientWidth',
  'clientHeight',
  'scrollLeft',
  'scrollTop',
  'scrollWidth',
  'scrollHeight',
  'innerText',
  'outerText',
];

const guardedMethods = [
  'scrollIntoView',
  'scrollBy', // experimental
  'scrollTo', // experimental
  'getClientRects',
  'getBoundingClientRect',
  'computedRole', // experimental
  'computedName', // experimental
  'focus',
];

export interface AsyncMeasure {
  isLayoutValid : boolean;
  measure() : Promise<any>;
}

/**
 * A Mixin that guards synchronouse measurement APIs, like offsetHeight, and
 * proides an async measurement API in `measure()`.
 *
 * Classes that AsyncMeasure are applied to should extend from `HTMLElement` and
 * must implement a `isLayoutValid` getter/property that returns true when the
 * element has performed all pending async DOM updates.
 */
export const AsyncMeasureMixin = (superclass: Constructable<Base>) : Constructable<AsyncMeasure> =>  {
  class _AsyncMeasure extends superclass implements AsyncMeasure {

    isLayoutValid : boolean;

    /**
     * @returns {Promise} that completes in the next animation frame, when it's
     * safe to call measurment APIs like offsetHeight, etc.
     */
    measure() {
      return new Promise((resolve, reject) => {
        window.requestAnimationFrame(resolve);
      });
    }

    _guard() {
      if (!this.isLayoutValid) {
        throw new Error('Reading DOM state during invalidation.' +
            'Call measure().then(...)');
      }
    }

    _getGuarded(property) {
      this._guard();
      return super[property];
    }

    _callGuarded(method, args) {
      this._guard();
      return super[method].apply(this, args);
    }

  };

  for (let getter of guardedGetters) {
    Object.defineProperty(_AsyncMeasure.prototype, getter, {
      configurable: true,
      enumerable: true,
      get: function() { return this._getGuarded(getter); },
    });
  }

  for (let method of guardedMethods) {
    Object.defineProperty(_AsyncMeasure.prototype, method, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function() { return this._callGuarded(method); },
    });
  }

  return _AsyncMeasure;
};
