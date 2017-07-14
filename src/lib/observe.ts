export function observe(properties: string|string[]) {
  return (clazz: any, method: string): any => {

    if (!Array.isArray(properties)) {
      properties = [properties];
    }
    clazz.observers = clazz.observers || new Map();

    for (const property of properties) {
      let propObservers = clazz.observers.get(property);
      if (propObservers === undefined) {
        propObservers = [];
        clazz.observers.set(property, propObservers);
      }
      propObservers.push((obj, newValue, oldValue) => {
        obj[method](newValue, oldValue);
      });
    }
  }
}
