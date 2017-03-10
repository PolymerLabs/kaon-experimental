define(["require", "exports", "stampino", "./symbols"], function (require, exports, stampino, symbols_1) {
    "use strict";
    let attributeHandler = {
        matches: (name) => name.startsWith('on-'),
        handle: (element, name, value, model) => {
            let eventName = name.substring(3);
            element.addEventListener(eventName, (e) => {
                let scope = {
                    '$event': e,
                    'this': model['this'] || model,
                };
                Object.setPrototypeOf(scope, model);
                stampino.getValue(value, scope);
            });
        },
    };
    exports.template = (selector) => (clazz) => {
        let doc = document._currentScript.ownerDocument;
        let template = doc.querySelector(`template${selector}`);
        clazz[symbols_1._template] = template;
        return clazz;
    };
    exports.TemplateStampingMixin = (superclass) => class extends superclass {
        get template() {
            return this.constructor[symbols_1._template];
        }
        render() {
            if (this.template && this.shadowRoot) {
                stampino.render(this.template, this.shadowRoot, this, {
                    attributeHandler,
                });
            }
            if (super.render)
                super.render();
        }
    };
});
