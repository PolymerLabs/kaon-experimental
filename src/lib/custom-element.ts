/**
 * Registers a custom element class.
 */
export const customElement = (tagName: string) => (clazz) => {
  window.customElements.define(tagName, clazz);
  return clazz;
};
