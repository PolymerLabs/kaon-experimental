import {Constructor} from './util.js';

const renderPromise = Promise.resolve();

function scheduleRender(renderable: Renderable) {
  renderPromise.then(() => render(renderable));
}

function render(renderable: Renderable) {
  renderable.needsRender = false;
  try {
    renderable.renderCallback();
  } catch (e) {
    console.warn('error rendering', renderable['tagName']);
    console.error(e);
  }
}

// We maintain our own render queue because 1) it might be faster than
// microtasks (though Chrome is realy fast), and 2) microtasks are just
// broken in Safari :(
// let renderPromise: Promise<void>|null = null;
// const renderQueue = [];
// function scheduleRender(renderable: Renderable) {
//   renderQueue.push(renderable);
//   if (renderPromise == null) {
//     renderPromise = (async () => {
//       for (let i = 0; i < renderQueue.length; i++) {
//         const renderable = renderQueue[i];
//         renderQueue[i] = undefined;
//         renderable.needsRender = false;
//         try {
//           renderable.render();
//         } catch (e) {
//           // swallow errors
//         }
//       }
//       renderQueue.length = 0;
//       renderPromise = null;
//     })();
//   }
// }

export interface Renderable {
  needsRender: boolean;
  renderCallback();
  invalidate();
}

/**
 * A Mixin that add async rendering functionality. Subclasses should implement render()
 * however they want to build and update shadowRoots.
 */
export function Renderable<T extends Constructor<HTMLElement>>(superclass: T): Constructor<Renderable> & T {
  return class extends superclass {

    needsRender: boolean;

    constructor(...args) {
      super(...args);
      this.needsRender = false;
      this.invalidate();
    }

    renderCallback() {
      // console.log('Renderable.render', this.tagName);
    }

    invalidate() {
      if (!this.needsRender) {
        this.needsRender = true;
        scheduleRender(this);
      }
    }
  };
}
