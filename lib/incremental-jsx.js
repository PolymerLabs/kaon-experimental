import * as idom from '../../incremental-dom/index.js';
import { toCamelCase } from './util.js';
import { Incremental } from './incremental.js';
export function createElement() { }
export function IncrementalJsx(superclass) {
    return class extends Incremental(superclass) {
        constructor() {
            super(...arguments);
            this.__eventListenerMap = new Map();
        }
        patch() {
            let nodes = this.patchJsx();
            if (!Array.isArray(nodes)) {
                nodes = [nodes];
            }
            this._renderIdom(nodes);
        }
        patchJsx() {
            return undefined;
        }
        _renderIdom(nodes) {
            console.log('_renderIdom');
            for (const node of nodes) {
                console.log('  ', node.tagnameOrConstructor || node);
                if (typeof node === 'string') {
                    idom.text(node);
                    return;
                }
                let listeners = null;
                let properties = null;
                let attributes = [];
                if (node.props) {
                    listeners = new Map();
                    properties = new Map();
                    for (const [name, value] of Object.entries(node.props)) {
                        if (name.startsWith('on-')) {
                            const eventName = name.substring(3);
                            listeners.set(eventName, value);
                        }
                        else if (name.endsWith('$')) {
                            const attrName = name.substring(0, name.length - 2);
                            attributes.push(attrName, value);
                        }
                        else {
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
    };
}
