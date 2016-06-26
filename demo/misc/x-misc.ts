import { KaonElement, customElement, property, template } from 'kaon';

@customElement('x-misc')
@template('#x-misc')
class MiscElement extends KaonElement {

  @property()
  bar : Number = 123;

  @property()
  foo : String = 'foo';

  @property()
  baz : Number = 1;

  @property()
  plain : String = 'plain' + 'string';

  @property()
  list : Array<Number>;

  constructor() {
    super();
    this.baz = performance.now();
    // setInterval(() => {
    //   this.baz = performance.now();
    // }, 100);
  }

}
