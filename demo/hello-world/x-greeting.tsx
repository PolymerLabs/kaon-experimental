import { KaonElement, customElement, property, createElement} from '../../kaon.js';

@customElement('x-greeting')
export class XGreeting extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  patchJsx() {
    return [
      <span>{this.greeting || 'Hello'}</span>,
      <span>{this.name || 'World'}</span>
    ];
  }
}
