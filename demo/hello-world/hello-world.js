var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { KaonElement, customElement, property, createElement } from '../../kaon.js';
import { XGreeting } from './x-greeting.js';
let HelloWorldElement = class HelloWorldElement extends KaonElement {
    connectedCallback() {
        let x;
        if (super.connectedCallback)
            super.connectedCallback();
    }
    patchJsx() {
        return [
            createElement("h1", null, "Hello World"),
            createElement("div", null,
                "Greeting: ",
                createElement("input", { "on-change": this._onGreetingChange })),
            createElement("div", null,
                "Name: ",
                createElement("input", { "on-change": this._onNameChange })),
            createElement("div", null,
                createElement(XGreeting, { x: 1, greeting: this.greeting, name: this.name })),
        ];
    }
    _onGreetingChange(e) {
        this.greeting = e.target.value;
    }
    _onNameChange(e) {
        this.name = e.target.value;
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
