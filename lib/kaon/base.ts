import {Constructable, scheduleMicrotask} from './util';
import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from './symbols';

export interface KaonBase extends HTMLElement {
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
export let Kaon = (superclass: Constructable<HTMLElement>): Constructable<KaonBase> =>
  class extends superclass {

    isLayoutValid: boolean;

    constructor(...args) {
      super(...args);
      this.isLayoutValid = true;
      this._createShadow();
    }

    connectedCallback() {
      this.invalidate();
      if (super.connectedCallback) super.connectedCallback();
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
      this.attachShadow({mode: 'open'});
    }

  };
