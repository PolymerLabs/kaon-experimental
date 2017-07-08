import { KaonElement, customElement, property, html } from '../../kaon.js';
import { XGreeting } from './x-greeting.js';

const x = XGreeting;

@customElement('hello-world')
class HelloWorldElement extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  render() { 
    return html`
      <style>
        div {
          border: solid 1px blue;
        }
      </style>
      <h1>Hello World</h1>
      <div>Greeting: <input on-change=${_=>this._onGreetingChange}></input></div>
      <div>Name: <input on-change=${_=>this._onNameChange}></input></div>
      <div>
        <x-greeting greeting=${this.greeting} name=${this.name}></x-greeting>
      </div>
    `;
  }

  _onGreetingChange = (e) => {
    this.greeting = e.target.value;
  }

  _onNameChange = (e) => {
    this.name = e.target.value;
  }
}
