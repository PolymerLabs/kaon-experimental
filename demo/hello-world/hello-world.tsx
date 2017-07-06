import { KaonElement, customElement, property, createElement} from '../../kaon.js';
import { XGreeting } from './x-greeting.js';

@customElement('hello-world')
class HelloWorldElement extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  connectedCallback() {
    let x: HTMLElement;
    if (super.connectedCallback) super.connectedCallback();
  }

  patchJsx() {
    return [
      <h1>Hello World</h1>,
      <div>Greeting: <input on-change={this._onGreetingChange}></input></div>,
      <div>Name: <input on-change={this._onNameChange}></input></div>,
      <div>
        <XGreeting x={1} greeting={this.greeting} name={this.name}></XGreeting>
      </div>,
    ];
  }

  _onGreetingChange(e) {
    this.greeting = e.target.value;
  }

  _onNameChange(e) {
    this.name = e.target.value;
  }
}
