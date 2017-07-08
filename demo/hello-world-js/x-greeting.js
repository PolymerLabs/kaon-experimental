import { KaonElement, customElement, property, html, initializeProperties } from '../../kaon.js';

export class XGreeting extends KaonElement {

  static get properties() {
    return {
      greeting: undefined,
      name: undefined,
    };
  }

  render() {
    return html `
      <span>${this.greeting || 'Hello'}</span>
      <span>${this.name || 'World'}</span>
    `;
  }
};
initializeProperties(XGreeting);
customElements.define('x-greeting', XGreeting);
