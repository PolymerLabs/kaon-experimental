
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
export function property(options?: PropertyOptions) {
  return (clazz: any, propName: string): any => {

    const invalidate: InvalidationFunction = options && options.invalidate || Invalidate.ALWAYS;
    const eventName: string|undefined = options && options.eventName;
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
        // Fire the change event
        if (eventName) {
          window.requestAnimationFrame(() => {
            new CustomEvent(eventName, {
              detail: {oldValue, value}
            });
          });
        }
      },
    };
  }
}

/**
 * When not using decorators, define a static `properties` getter and
 * call initializeProperties(MyClass).
 */
export function initializeProperties(clazz: any) {
  const properties = clazz.properties;
  if (properties === undefined) {
    return;
  }
  for (const [propName, options] of Object.entries(properties)) {
    Object.defineProperty(clazz.prototype, propName, property(options)(clazz, propName));
  }
}
