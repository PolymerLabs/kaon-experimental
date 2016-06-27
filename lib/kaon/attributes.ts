import {Constructable} from './util';
import {_readAttributes} from './symbols';

/**
 * Mixin that implements attribute deserialization.
 */
export const Attributes = (superclass: Constructable<HTMLElement>) : Constructable<HTMLElement> =>
  class extends superclass {

    attributeChangedCallback(attrName, oldVal, newVal) {
      //TODO: implement rtti in babel-deco, or use TypeScript and Reflect
      // let propertyType = this.__properties__[attrName];
      // if (propertyType) {
      //   newVal = propertyType(newVal);
      // }
      this[attrName] = newVal;

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
      }
    }

  };
