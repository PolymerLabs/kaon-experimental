define(["require", "exports", "incremental-dom"], function (require, exports, idom) {
    "use strict";
    const camelCaseCache = new Map();
    function toCamelCase(s) {
        let result = camelCaseCache.get(s);
        if (result == null) {
            result = s.replace(/-(\w)/, (_, p1) => p1.toUppercase());
            camelCaseCache.set(s, result);
        }
        return result;
    }
    function Incremental(superclass) {
        return class extends superclass {
            constructor(...args) {
                super(...args);
                this.__eventListenerMap = new Map();
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: 'open' });
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
            patch() {
                return undefined;
            }
            _elem(tagnameOrConstructor, props, ...children) {
                const listeners = new Map();
                const properties = new Map();
                const attributes = [];
                for (const name in props) {
                    const value = props[name];
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
                return {
                    tagnameOrConstructor,
                    attributes,
                    properties,
                    listeners,
                    children,
                };
            }
            _renderIdom(nodes) {
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
        };
    }
    exports.Incremental = Incremental;
});
