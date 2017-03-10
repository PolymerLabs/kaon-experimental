define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.Attributes = (superclass) => class extends superclass {
        attributeChangedCallback(attrName, oldVal, newVal) {
            this[attrName] = newVal;
            if (super['attributeChangedCallback']) {
                super['attributeChangedCallback'](attrName, oldVal, newVal);
            }
        }
    };
});
