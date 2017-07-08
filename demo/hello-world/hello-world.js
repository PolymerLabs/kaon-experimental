var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { KaonElement, customElement, property, html } from '../../kaon.js';
import { XGreeting } from './x-greeting.js';
const x = XGreeting;
let HelloWorldElement = class HelloWorldElement extends KaonElement {
    constructor() {
        super(...arguments);
        this._onGreetingChange = (e) => {
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
__decorate([
    property(),
    __metadata("design:type", String)
], HelloWorldElement.prototype, "greeting", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], HelloWorldElement.prototype, "name", void 0);
HelloWorldElement = __decorate([
    customElement('hello-world')
], HelloWorldElement);
