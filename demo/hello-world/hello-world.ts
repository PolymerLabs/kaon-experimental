import { KaonElement, customElement, property, template } from 'kaon';

@customElement('hello-world')
@template('#hello-world')
class HelloWorldElement extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  constructor() {
    console.log('HelloWorldElement A');
    super();
  }

  connectedCallback() {
    console.log('hello-world.connectedCallback');
    super.connectedCallback();
  }

  _onGreetingChange(e) {
    this.greeting = e.target.value;
  }

  _onNameChange(e) {
    this.name = e.target.value;
  }
}
