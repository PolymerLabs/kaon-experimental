/**
 * Registers a custom element class.
 */
export let customElement = (tagName: string) => (clazz) => {
  clazz.__tagName__ = tagName;
  // Store the original constructor for use in the constructor-call trick
  // because registerElement overwrites it
  clazz.prototype.__constructor__ = clazz.prototype.constructor;
  (<any>document).registerElement(tagName, clazz);
  return clazz;
};
