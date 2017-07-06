import * as idom from '../../incremental-dom/index.js';
// import * as idom from '../../incremental-dom/dist/incremental-dom.js';

import {Constructor, toCamelCase} from './util.js';
import {Renderable} from './renderable.js';
import {Incremental} from './incremental.js';

/**
 * A capture of the arguments to createElement().
 */
export interface IDomElement {
  tagnameOrConstructor: string|{new(): Element};
  props: {[name: string]: any}|null
  children: IDomNode[];
}

export type IDomNode = IDomElement | string;

/** 
 * Reifies a JSX createElement call as a simple object in order to turn they
 * inside-out nested expression ordering of JSX to the outside-in statement
 * ordering of Incremental DOM.
 * 
 * This incurs a small allocation cost over raw Incremental DOM calls, which
 * can be eliminated by using the incremental-dom Babel transform.
 * 
 * TODO: split out the JSX code from the basic Incremental DOM interface.
 */
export function createElement(
    tagnameOrConstructor: string|{new(): Element},
    props: {[name: string]: any}|null,
    ...children: IDomNode[]): IDomNode {
  return {
    tagnameOrConstructor,
    props,
    children,
  };
}

// export type JSXFactory<T extends Constructor<object>> = (tagnameOrConstructor: string|T, props: {[name: string]: any}|null, ...children: IDomNode[]) => T;

export interface IncrementalJsx extends Incremental {
  patchJsx(): IDomNode|IDomNode[]|undefined;
}

/**
 * A Mixin that add async rendering functionality. Subclasses should implement render()
 * however they want to build and update shadowRoots.
 */
export function IncrementalJsx<T extends Constructor<Renderable> & Constructor<HTMLElement>>(superclass: T): Constructor<IncrementalJsx> & T {
  return class extends Incremental(superclass) {

    private __eventListenerMap = new Map<string, any>();

    patch() {
      let nodes = this.patchJsx();
      if (!Array.isArray(nodes)) {
        nodes = [nodes as string|IDomElement];
      }
      this._renderIdom(nodes);
    }

    // Note: this should be an abstract method
    patchJsx(): IDomNode|IDomNode[]|undefined {
      return undefined;
    }

    /**
     * Takes an array of IDomNode trees as produced by `createElement` and
     * renders them to this element's shadowRoot using Incremental DOM.
     */
    private _renderIdom(nodes: IDomNode[]) {
      console.log('_renderIdom');
      for (const node of nodes) {
        console.log('  ', node.tagnameOrConstructor || node);
        if (typeof node === 'string') {
          idom.text(node);
          return;
        }

        let listeners: Map<string, any>|null = null;
        let properties: Map<string, any>|null = null;
        let attributes: any[] = [];

        if (node.props) {
          // Split props into eventListeners, attributes and properties
          listeners = new Map<string, any>();
          properties = new Map<string, any>();
          for (const [name, value] of Object.entries(node.props)) {
            if (name.startsWith('on-')) {
              const eventName = name.substring(3);
              listeners.set(eventName, value);
            } else if (name.endsWith('$')) {
              const attrName = name.substring(0, name.length - 2);
              attributes.push(attrName, value);
            } else {
              properties.set(name, value);
            }
          }
        }

        const element = idom.elementOpen(node.tagnameOrConstructor, undefined, undefined, ...attributes);

        if (properties) {
          for (const [name, value] of properties.entries()) {
            const camelCaseName = toCamelCase(name);
            element[camelCaseName] = value;
          }
        }

        if (listeners) {
          for (const [name, listener] of listeners.entries()) {
            const oldListener = this.__eventListenerMap.get(name);
            if (oldListener !== listener) {
              if (oldListener != null) {
                element.removeEventListener(name, oldListener);
              }
              element.addEventListener(name, listener);
              this.__eventListenerMap.set(name, listener);
            }
          }
        }

        this._renderIdom(node.children);
        idom.elementClose(node.tagnameOrConstructor);
      }
    }
  }
}
