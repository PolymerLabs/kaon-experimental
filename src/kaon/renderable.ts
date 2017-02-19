import {Constructable} from './util';

let renderPromise: Promise<void>|null = null;
const renderQueue = [];

// We maintain our own render queue because 1) it might be faster than
// microtasks (though Chrome is realy fast), and 2) microtasks are just
// broken in Safari :(
function scheduleRender(renderable: Renderable) {
  renderQueue.push(renderable);
  if (renderPromise == null) {
    renderPromise = (async () => {
      for (let i = 0; i < renderQueue.length; i++) {
        const renderable = renderQueue[i];
        renderQueue[i] = undefined;
        renderable.needsRender = false;
        try {
          renderable.render();
        } catch (e) {
          // swallow errors
        }
      }
      renderQueue.length = 0;
      renderPromise = null;
    })();
  }
}

export interface Renderable {
  needsRender: boolean;
  render();
  invalidate();
}

/**
 * A Mixin that add async rendering functionality. Subclasses should implement render()
 * however they want to build and update shadowRoots.
 */
export function Renderable<T extends Constructable<HTMLElement>>(superclass: T): Constructable<Renderable> & T {
  return class extends superclass {

    needsRender: boolean;

    constructor(...args) {
      super(...args);
      this.needsRender = false;
      this.invalidate();
    }

    render() {}

    invalidate() {
      if (!this.needsRender) {
        this.needsRender = true;
        scheduleRender(this);
      }
    }
  }
}
