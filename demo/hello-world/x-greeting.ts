import { KaonElement, customElement, property, template } from 'kaon';

@customElement('x-greeting')
@template('#x-greeting')
class TestElement extends KaonElement {

  @property()
  greeting : String;

  @property()
  name : String;

}
