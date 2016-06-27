import {Constructable, Base} from './util';
import {KaonBase} from './base';
import * as stampino from 'stampino';
import {_template} from './symbols';

// passed to stampino to implement declarative event handlers
let attributeHandler = {
  matches: (name) => name.startsWith('on-'),
  handle: (element, name, value, model) => {
    let eventName = name.substring(3);
    element.addEventListener(eventName, (e) => {
      let scope = {
        '$event': e,
        // If the model is already a "scope" with the real model object on the
        // prototype chain, then we need to look up the real model
        // TODO: `this = model['this'] || model` occurs in stampino too...
        // encode this pattern into a function somewhere? makeScope()?
        'this': model['this'] || model,
      };
      Object.setPrototypeOf(scope, model);
      // TODO: pre-parse and re-use the AST
      stampino.getValue(value, scope);
    });
  },
};

/**
 * Class decorator to specify the template selector.
 *
 * @template('#my-element')
 * class Foo extends TemplateStamping(Kaon(HTMLElement)) {}
 */
export const template = (selector) => (clazz) => {
  let doc = (<any>document)._currentScript.ownerDocument;
  let template = doc.querySelector(`template${selector}`);
  clazz[_template] = template;
  return clazz;
}

export interface TemplateStamping extends KaonBase {
  template : HTMLTemplateElement;
}

/**
 * Mixin that implements render() with template stamping. Use @template to
 * specify the template selector.
 *
 * @template('#my-element')
 * class Foo extends TemplateStamping(Kaon(HTMLElement)) {}
 */
export const TemplateStampingMixin = (superclass: Constructable<KaonBase>) : Constructable<TemplateStamping> =>
  class extends superclass implements TemplateStamping {

    get template() {
      return this.constructor[_template];
    }

    render() {
      if (this.template && this.shadowRoot) {
        // TODO: use super-classes template for tempalte inheritance
        stampino.render(this.template, this.shadowRoot, this, {
          attributeHandler,
        });
      }
      if (super.render) super.render();
    }

  };
