import * as stampino from 'stampino';
import {_template} from 'kaon/symbols';

// passed to stampino to implement declarative event handlers
const attributeHandler = {
  matches: (name) => name.startsWith('on-'),
  handle: (element, name, value, model) => {
    let eventName = name.substring(3);
    element.addEventListener(eventName, (e) => {
      let scope = {'$event': e, 'this': model};
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
  let doc = document.currentScript.ownerDocument;
  let template = doc.querySelector(`template${selector}`);
  clazz[_template] = template;
  return clazz;
}

/**
 * Mixin that implements render() with template stamping. Use @template to
 * specify the template selector.
 *
 * @template('#my-element')
 * class Foo extends TemplateStamping(Kaon(HTMLElement)) {}
 */
export const TemplateStamping = (superclass) => class extends superclass {

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
    if (super.render) {
      super.render();
    }
  }

};
