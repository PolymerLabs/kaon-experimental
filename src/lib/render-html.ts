import { Constructor } from "./util";
import { TemplateResult, AttributePart, TemplateInstance, TemplatePart, Part } from '../../lit-html/lib/lit-html.js';

export interface RenderHTML {
  render();
}

export function RenderHTML<T extends Constructor<HTMLElement>>(superclass: T): Constructor<RenderHTML> & T {
  return class extends superclass {

    private _templateInstance: TemplateInstance;

    constructor(...args) {
      super(...args);
      this.attachShadow({mode: 'open'});
    }

    renderCallback() {
      const result: TemplateResult = this.render();
      if (this._templateInstance === undefined) {
        this._templateInstance = new KaonTemplateInstance(result.template);
        const fragment = this._templateInstance._clone();
        this._templateInstance.update(result.values);
        this.shadowRoot!.appendChild(fragment);
      } else {
        this._templateInstance.update(result.values);
      }
    }

    render(): TemplateResult {
      throw new Error('you must implement render()');
    }    
    
  };
}

class KaonTemplateInstance extends TemplateInstance {
  _createPart(templatePart: TemplatePart, node: Node): Part {
    if (templatePart.type === 'attribute') {
      if (templatePart.rawName.startsWith('on-')) {
        const eventName = templatePart.rawName.substring(3);
        return new EventPart(node as Element, eventName);
      }
      if (templatePart.name.endsWith('$')) {
        const name = templatePart.name.substring(0, templatePart.name.length - 1);
        return new AttributePart(node as Element, name, templatePart.strings!);
      }
      return new PropertyPart(node as Element, templatePart.rawName!, templatePart.strings!);
    }
    return super._createPart(templatePart, node);
  }
}

class PropertyPart extends AttributePart {

  setValue(values: any[]): void {
    const s = this.strings;
    if (s.length === 2 && s[0] === '' && s[s.length - 1] === '') {
      // An expression that occupies the whole attribute value will leave
      // leading and trailing empty strings.
      (this.element as any)[this.name] = this._getValue(values[0]);
    } else {
      // Interpolation, so interpolate
      let text = '';
      for (let i = 0; i < s.length; i++) {
        text += s[i];
        if (i < s.length - 1) {
          text += this._getValue(values[i]);
        }
      }
      (this.element as any)[this.name] = text;
    }
  }
}

class EventPart extends Part {

  element: Element;
  eventName: string;
  private _listener: any;

  constructor(element: Element, eventName: string) {
    super();
    this.element = element;
    this.eventName = eventName;
  }

  setValue(value: any): void {
    const listener = this._getValue(value);
    if (typeof listener !== 'function') {
      console.error('event handlers must be functions', listener);
      return;        
    }
    if (listener === this._listener) {
      return;
    }
    if (listener === undefined) {
      this.element.removeEventListener(this.eventName, this);
    }
    if (this._listener === undefined) {
      this.element.addEventListener(this.eventName, this);
    }
    this._listener = listener;
  }

  handleEvent(event: Event) {
    this._listener.call(this.element, event);
  }
}
