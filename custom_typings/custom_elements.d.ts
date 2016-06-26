interface CustomElementsRegistry {
  define(tagName: string, ctor: Function);
}

interface Window {
  customElements: CustomElementsRegistry;
}

interface HTMLElement {
  connectedCallback();
  disconnectedCallback();
  attributeChangedCallback(name: string, oldValue: string, newValue: string);
  attachShadow(options: any);
  shadowRoot: Node;
}
