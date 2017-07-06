export const customElement = (tagName) => (clazz) => {
    window.customElements.define(tagName, clazz);
    return clazz;
};
