import * as idom from 'incremental-dom';

import {Constructable} from './util';
import {Renderable} from './renderable';

const camelCaseCache = new Map<string, string>();
function toCamelCase(s: string) {
  let result = camelCaseCache.get(s);
  if (result == null) {
    result = s.replace(/-(\w)/, (_, p1) => p1.toUppercase());
    camelCaseCache.set(s, result);
  }
  return result;
}

export interface Incremental {
  patch();
  _elem(tagnameOrConstructor: string|{new(): Element}, props: {[name: string]: any}|null, ...children: IDomNode[]): IDomNode;
}

export interface IDomElement {
  tagnameOrConstructor: string|{new(): Element};
  attributes: (string|any)[];
  properties: Map<string, any>;
  listeners: Map<string, any>;
  children: IDomNode[];
}

export type IDomNode = IDomElement | string;

/**
 * A Mixin that add async rendering functionality. Subclasses should implement render()
 * however they want to build and update shadowRoots.
 */
export function Incremental<T extends Constructable<Renderable & HTMLElement>>(superclass: T): Constructable<Incremental> & T {
  return class extends superclass {

    private __eventListenerMap = new Map<string, any>();

    constructor(...args) {
      super(...args);
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }
    }

    render() {
      idom.patch(this.shadowRoot, () => {
        let nodes = this.patch();
        if (!Array.isArray(nodes)) {
          nodes = [nodes];
        }
        this._renderIdom(nodes);
      });
    }

    // Note: this should be an abstract method
    patch(): IDomNode|IDomNode[]|undefined {
      return undefined;
    }

    _elem(tagnameOrConstructor: string|{new(): Element}, props: {[name: string]: any}|null, ...children: IDomNode[]): IDomNode {
      const listeners = new Map<string, any>();
      const properties = new Map<string, any>();
      const attributes: (string|any)[] = [];

      for (const name in props) {
        const value = props[name];
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

      return {
        tagnameOrConstructor,
        attributes,
        properties,
        listeners,
        children,
      };
    }

    private _renderIdom(nodes: IDomNode[]) {
      for (const node of nodes) {
        if (typeof node === 'string') {
          idom.text(node);
          return;
        }
        const element = idom.elementOpen(node.tagnameOrConstructor, null, null, ...node.attributes);

        for (const [name, value] of node.properties.entries()) {
          element[name] = value;
        }

        for (const [name, listener] of node.listeners.entries()) {
          const oldListener = this.__eventListenerMap.get(name);
          if (oldListener !== listener) {
            if (oldListener != null) {
              element.removeEventListener(name, oldListener);
            }
            element.addEventListener(name, listener);
            this.__eventListenerMap.set(name, listener);
          }
        }

        this._renderIdom(node.children);

        idom.elementClose(node.tagnameOrConstructor);
      }
    }
  }
}
