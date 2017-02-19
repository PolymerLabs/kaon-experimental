import {Constructable} from './util';

/**
 * Mixin that implements attribute deserialization.
 */
export const Attributes = (superclass: Constructable<HTMLElement>) : Constructable<HTMLElement> =>
  class extends superclass {

    attributeChangedCallback(attrName, oldVal, newVal) {
      this[attrName] = newVal;

      if (super['attributeChangedCallback']) {
        super['attributeChangedCallback'](attrName, oldVal, newVal);
      }
    }

  };
