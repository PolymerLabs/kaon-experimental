import { KaonElement, customElement, property, html, initializeProperties } from '../../kaon.js';
import './x-greeting.js';

export class HelloWorldElement extends KaonElement {

  static get properties() {
    return {
      greeting: undefined,
      name: undefined,
    };
  }

  constructor() {
    super();
    this._onGreetingChange = (e) => {
      console.log('_onGreetingChange');
      this.greeting = e.target.value;
    };
    this._onNameChange = (e) => {
      this.name = e.target.value;
    };
  }

  render() {
    return html `
      <style>
      div {
        border: solid 1px blue;
      }
      </style>
      <h1>Hello World</h1>
      <div>Greeting: <input on-change=${_ => this._onGreetingChange}></input></div>
      <div>Name: <input on-change=${_ => this._onNameChange}></input></div>
      <div>
      <x-greeting greeting=${this.greeting} name=${this.name}></x-greeting>
      </div>
    `;
  }
};
initializeProperties(HelloWorldElement);
customElements.define('hello-world', HelloWorldElement);
