import * as decorators from 'kaon/decorators';
import {mix} from 'mixwith';
import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from 'kaon/symbols';
import {AsyncMeasure} from 'kaon/async-measure';
import {Attributes} from 'kaon/attributes';
import {CustomConstructor} from 'kaon/constructor';
import * as templateLib from 'kaon/template';

export const property = decorators.property;
export const template = templateLib.template;
export const customElement = decorators.customElement;

const _microtaskScheduler = Promise.resolve();
function _scheduleMicrotask(task) {
  _microtaskScheduler.then(task);
}

/**
 * A Mixin that implements Kaon's core async invalidation functionality. This
 * mixin assumes that it's applied directly to HTMLElement or other browser
 * provided prototype, and optional features are mixed in beneath it on the
 * prototype chain.
 */
export let Kaon = (superclass) => class extends superclass {

  createdCallback() {
    this.isLayoutValid = true;
    this._createShadow();
  }

  attachedCallback() {
    this.invalidate();
  }

  render() {}

  invalidate() {
    if (this.isLayoutValid) {
      this.isLayoutValid = false;
      _scheduleMicrotask(() => {
        this.render();
        this.isLayoutValid = true;
      });
    }
  }

  _createShadow() {
    let shadowRoot = this.createShadowRoot();
  }

};

export const KaonElement = mix(HTMLElement).with(
  Kaon,
  CustomConstructor,
  Attributes,
  templateLib.TemplateStamping,
  AsyncMeasure
);
