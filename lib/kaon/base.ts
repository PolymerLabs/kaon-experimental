import {Constructable, Base, CustomElement, scheduleMicrotask} from './util';
import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from './symbols';

export interface KaonBase extends CustomElement {
  isLayoutValid: boolean;
  render();
  invalidate();
}

/**
 * A Mixin that implements Kaon's core async invalidation functionality. This
 * mixin assumes that it's applied directly to HTMLElement or other browser
 * provided prototype, and optional features are mixed in beneath it on the
 * prototype chain.
 */
export let Kaon = (superclass: Constructable<CustomElement>): Constructable<KaonBase> =>
  class extends superclass {

    isLayoutValid: boolean;

    createdCallback() {
      this.isLayoutValid = true;
      this._createShadow();
      if (super.createdCallback) super.createdCallback();
    }

    attachedCallback() {
      this.invalidate();
      if (super.attachedCallback) super.attachedCallback();
    }

    render() {}

    invalidate() {
      if (this.isLayoutValid) {
        this.isLayoutValid = false;
        scheduleMicrotask(() => {
          this.render();
          this.isLayoutValid = true;
        });
      }
    }

    _createShadow() {
      let shadowRoot = this.createShadowRoot();
    }

  };
