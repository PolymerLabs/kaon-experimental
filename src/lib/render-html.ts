import { Constructor } from "./util";
import { TemplateResult, AttributePart, TemplateInstance, TemplatePart, Part, Template } from '../../lit-html/lib/lit-html.js';

export interface RenderHTML {
  _waitingFor: Promise<any>[];
  render();
}

export function RenderHTML<T extends Constructor<HTMLElement>>(superclass: T): Constructor<RenderHTML> & T {
  return class extends superclass {

    private _templateInstance: TemplateInstance;
    _waitingFor: Promise<any>[];

    constructor(...args) {
      super(...args);
      this.attachShadow({mode: 'open'});
    }

    renderCallback() {
      this._waitingFor = [];
      const result: TemplateResult = this.render();
      if (this._templateInstance === undefined) {
        this._templateInstance = new KaonTemplateInstance(this, result.template);
        const fragment = this._templateInstance._clone();
        this._templateInstance.update(result.values);
        this.shadowRoot!.appendChild(fragment);
      } else {
        this._templateInstance.update(result.values);
      }
      return Promise.all(this._waitingFor);
    }

    render(): TemplateResult {
      throw new Error('you must implement render()');
    }    
    
  };
}

class KaonTemplateInstance extends TemplateInstance {
  host: RenderHTML;

  constructor(host: RenderHTML, template: Template) {
    super(template);
    this.host = host;
  }

  _createPart(templatePart: TemplatePart, node: Node): Part {
    if (templatePart.type === 'attribute') {
      if (templatePart.rawName.startsWith('on-')) {
        const eventName = templatePart.rawName.substring(3);
        return new EventPart(this, node as Element, eventName);
      }
      if (templatePart.name.endsWith('$')) {
        const name = templatePart.name.substring(0, templatePart.name.length - 1);
        return new AttributePart(this, node as Element, name, templatePart.strings!);
      }
      return new PropertyPart(this, node as Element, templatePart.rawName!, templatePart.strings!);
    }
    return super._createPart(templatePart, node);
  }

  _createInstance(template: Template) {
    return new KaonTemplateInstance(this.host, template);
  }
}

class PropertyPart extends AttributePart {

  setValue(values: any[]): void {
    const s = this.strings;
    let value: any;
    if (s.length === 2 && s[0] === '' && s[s.length - 1] === '') {
      // An expression that occupies the whole attribute value will leave
      // leading and trailing empty strings.
      value = this._getValue(values[0]);
    } else {
      // Interpolation, so interpolate
      value = '';
      for (let i = 0; i < s.length; i++) {
        value += s[i];
        if (i < s.length - 1) {
          value += this._getValue(values[i]);
        }
      }
    }
    (this.element as any)[this.name] = value;
    // TODO: get a Promise from this element to know when it's done rendering
    // and propagate that to a Promise owned by the host element (somewhow).
    // This will let us know when subtrees have finished async-rendering
    const renderComplete = (this.element as any).renderComplete;
    if (renderComplete !== undefined) {
      (this.instance as KaonTemplateInstance).host._waitingFor.push(renderComplete);
    }
  }
}

class EventPart extends Part {

  element: Element;
  eventName: string;
  private _listener: any;

  constructor(instance: TemplateInstance, element: Element, eventName: string) {
    super(instance);
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
