export const Invalidate = {
    ALWAYS: (a, b) => true,
    NOT_IDENTICAL: (a, b) => a !== b,
};
;
export function property(options) {
    return (clazz, propName) => {
        const invalidate = options && options.invalidate || Invalidate.ALWAYS;
        const eventName = options && options.eventName;
        const storageProp = Symbol(propName);
        return {
            configurable: true,
            enumerable: true,
            get() {
                return this[storageProp];
            },
            set(value) {
                const oldValue = this[storageProp];
                this[storageProp] = value;
                if (invalidate(oldValue, value)) {
                    this.invalidate();
                }
                if (eventName) {
                    window.requestAnimationFrame(() => {
                        new CustomEvent(eventName, {
                            detail: { oldValue, value }
                        });
                    });
                }
            },
        };
    };
}
export function initializeProperties(clazz) {
    const properties = clazz.properties;
    if (properties === undefined) {
        return;
    }
    for (const [propName, options] of Object.entries(properties)) {
        Object.defineProperty(clazz.prototype, propName, property(options)(clazz, propName));
    }
}
