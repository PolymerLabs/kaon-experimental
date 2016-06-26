import { KaonElement, customElement, property, template } from 'kaon';

@customElement('hello-world')
@template('#hello-world')
class HelloWorldElement extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

  _onGreetingChange(e) {
    this.greeting = e.target.value;
  }

  _onNameChange(e) {
    this.name = e.target.value;
  }
}
