import {Constructor} from './util.js';

/**
 * Mixin that implements attribute deserialization.
 */
export const Attributes = (superclass: Constructor<HTMLElement>) : Constructor<HTMLElement> =>
  class extends superclass {

    attributeChangedCallback(attrName, oldVal, newVal) {
      this[attrName] = newVal;

      if (super['attributeChangedCallback']) {
        super['attributeChangedCallback'](attrName, oldVal, newVal);
      }
    }

  };
