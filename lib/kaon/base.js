define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    exports.Kaon = (superclass) => class extends superclass {
        constructor(...args) {
            super(...args);
            this.isLayoutValid = true;
            this._createShadow();
        }
        connectedCallback() {
            this.invalidate();
            if (super.connectedCallback)
                super.connectedCallback();
        }
        render() { }
        invalidate() {
            if (this.isLayoutValid) {
                this.isLayoutValid = false;
                util_1.scheduleMicrotask(() => {
                    this.render();
                    this.isLayoutValid = true;
                });
            }
        }
        _createShadow() {
            this.attachShadow({ mode: 'open' });
        }
    };
});
