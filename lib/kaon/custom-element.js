define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.customElement = (tagName) => (clazz) => {
        window.customElements.define(tagName, clazz);
        return clazz;
    };
});
