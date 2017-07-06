import * as idom from '../../incremental-dom/index.js';
// import * as idom from '../../incremental-dom/dist/incremental-dom.js';

import {Constructor} from './util.js';
import {Renderable} from './renderable.js';

export interface Incremental {
  /**
   * Called from the `Incremental` mixin's implementation of render()` to
   * render and update this element with Incremental DOM calls.
   */
  patch();
}

/**
 * A Mixin that add async rendering functionality. Subclasses should implement render()
 * however they want to build and update shadowRoots.
 */
export function Incremental<T extends Constructor<Renderable> & Constructor<HTMLElement>>(superclass: T): Constructor<Incremental> & T {
  return class extends superclass {

    constructor(...args: any[]) {
      super(...args);
      // TODO(justinfagnani): Move to Renderable, remove if
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }
    }

    render() {
      console.log('Incremental.render', this.tagName);
      idom.patch(this.shadowRoot as DocumentFragment, () => this.patch());
    }

    // Note: this should be an abstract method
    patch() {}
  };
}
