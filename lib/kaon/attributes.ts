import {Constructable, Base, CustomElement} from './util';
import {_readAttributes} from './symbols';

/**
 * Mixin that implements attribute deserialization.
 */
export const Attributes = (superclass: Constructable<CustomElement>) : Constructable<CustomElement> =>
  class extends superclass {

    attachedCallback() {
      this[_readAttributes]();

      if (super.attachedCallback) {
        super.attachedCallback();
      }
    }

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

    [_readAttributes]() {
      for (let i = 0; i < this.attributes.length; i++) {
        let attribute = this.attributes[i];
        this.attributeChangedCallback(attribute.name, null, attribute.value);
      }
    }
  };
