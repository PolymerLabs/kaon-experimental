define(["require", "exports"], function (require, exports) {
    "use strict";
    const guardedGetters = [
        'offsetLeft',
        'offsetTop',
        'offsetWidth',
        'offsetHeight',
        'offsetParent',
        'clientLeft',
        'clientTop',
        'clientWidth',
        'clientHeight',
        'scrollLeft',
        'scrollTop',
        'scrollWidth',
        'scrollHeight',
        'innerText',
        'outerText',
    ];
    const guardedMethods = [
        'scrollIntoView',
        'scrollBy',
        'scrollTo',
        'getClientRects',
        'getBoundingClientRect',
        'computedRole',
        'computedName',
        'focus',
    ];
    exports.AsyncMeasureMixin = (superclass) => {
        class _AsyncMeasure extends superclass {
            measure() {
                return new Promise((resolve, reject) => {
                    window.requestAnimationFrame(resolve);
                });
            }
            _guard() {
                if (!this.isLayoutValid) {
                    throw new Error('Reading DOM state during invalidation.' +
                        'Call measure().then(...)');
                }
            }
            _getGuarded(property) {
                this._guard();
                return super[property];
            }
            _callGuarded(method, args) {
                this._guard();
                return super[method].apply(this, args);
            }
        }
        ;
        for (let getter of guardedGetters) {
            Object.defineProperty(_AsyncMeasure.prototype, getter, {
                configurable: true,
                enumerable: true,
                get: function () { return this._getGuarded(getter); },
            });
        }
        for (let method of guardedMethods) {
            Object.defineProperty(_AsyncMeasure.prototype, method, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function () { return this._callGuarded(method); },
            });
        }
        return _AsyncMeasure;
    };
});
