export interface Constructable<T> {
  new (...args: any[]): T;
}

export interface Base {}

export interface CustomElement extends HTMLElement {
  createdCallback();
  attachedCallback();
  detachedCallback();
  attributeChangedCallback(attrName: string, oldVal: string, newVal: string);
  createShadowRoot();
  shadowRoot: Node;
}

interface ExtendedDocument extends Document {
  registerElement(tagName: string, clazz: any);
}
export declare var document: ExtendedDocument;

const _microtaskScheduler = Promise.resolve();

export function scheduleMicrotask(task) {
  _microtaskScheduler.then(task);
}
