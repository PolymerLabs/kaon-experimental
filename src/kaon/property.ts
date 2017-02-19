
export interface InvalidationFunction {
  (a: any, b: any): boolean;
}

export const Invalidate = {
  ALWAYS: (a, b) => true,
  NOT_IDENTICAL: (a, b) => a !== b,
}

export interface PropertyOptions {
  /** 
   * The equality function to use to check whether setting a property should
   * cause a render of the element.
   * 
   * The default is to always invalidate (Invalidate.ALWAYS), so that in the
   * case of a property change deep in an object graph, the component that
   * least renders correctly, even if this causes unneeded DOM updates.
   * 
   * If you know that this values passed to this property are immutable, then
   * using Invalidate.NOT_IDENTICAL will cause a re-render only if a different
   * instance is assigned to the property.
   * 
   * You can pass a custom invalidate function of the form `(a, b) => boolean`.
   * This can be used with object that have custom equality protocols, such as 
   * `(a, b) => a !== b && !a.equals(b)`.
   */
  invalidate?: InvalidationFunction;

  /**
   * The event to fire, if any, when this property changes.
   */
  eventName?: string;
};

/**
 * Returns a decorator to be applied to a class property of a `Renderable` to
 * set up accessors that trigger the rendering system.
 */
export function property<T>(options?: PropertyOptions) {
  return (clazz: any, propName: string): PropertyDescriptor => {

    const invalidate: InvalidationFunction = options && options.invalidate || Invalidate.ALWAYS;
    const eventName: string|undefined = options && options.eventName;

    // TS property decorators don't receive a descriptor, so get it from the prototype
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
        // TODO: async fire an event to implement eventName
      },
    };
  }
}
