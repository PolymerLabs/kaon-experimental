export const Attributes = (superclass) => class extends superclass {
    attributeChangedCallback(attrName, oldVal, newVal) {
        this[attrName] = newVal;
        if (super['attributeChangedCallback']) {
            super['attributeChangedCallback'](attrName, oldVal, newVal);
        }
    }
};
