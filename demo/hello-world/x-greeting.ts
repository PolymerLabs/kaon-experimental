import { KaonElement, customElement, property, html } from '../../kaon.js';

@customElement('x-greeting')
export class XGreeting extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  render() {
    return html`
      <span>${this.greeting || 'Hello'}</span>
      <span>${this.name || 'World'}</span>
    `;
  }
}
