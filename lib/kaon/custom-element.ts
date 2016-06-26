/**
 * Registers a custom element class.
 */
export let customElement = (tagName: string) => (clazz) => {
  window.customElements.define(tagName, clazz);
  return clazz;
};
