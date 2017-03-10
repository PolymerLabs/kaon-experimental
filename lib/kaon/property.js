define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.Invalidate = {
        ALWAYS: (a, b) => true,
        NOT_IDENTICAL: (a, b) => a !== b,
    };
    ;
    function property(options) {
        return (clazz, propName) => {
            const invalidate = options && options.invalidate || exports.Invalidate.ALWAYS;
            const eventName = options && options.eventName;
            const descriptor = Object.getOwnPropertyDescriptor(clazz.prototype, propName);
            const getter = descriptor.get;
            const setter = descriptor.set;
            if (getter != null && setter == null) {
                console.warn(`Invalid property decoration of getter ${propName} without a setter`);
                return;
            }
            const storageProp = Symbol(`__prop_${propName}`);
            const get = getter || (() => this[storageProp]);
            const set = setter || ((v) => this[storageProp] = v);
            return {
                configurable: true,
                enumerable: true,
                get() {
                    return get.call(this);
                },
                set(value) {
                    const oldValue = get();
                    set.call(this, value);
                    if (invalidate(oldValue, value)) {
                        this.invalidate();
                    }
                },
            };
        };
    }
    exports.property = property;
});
