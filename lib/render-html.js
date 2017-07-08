import { AttributePart, TemplateInstance, Part } from '../../lit-html/lib/lit-html.js';
export function RenderHTML(superclass) {
    return class extends superclass {
        constructor(...args) {
            super(...args);
            this.attachShadow({ mode: 'open' });
        }
        renderCallback() {
            const result = this.render();
            if (this._templateInstance === undefined) {
                this._templateInstance = new KaonTemplateInstance(result.template);
                const fragment = this._templateInstance._clone();
                this._templateInstance.update(result.values);
                this.shadowRoot.appendChild(fragment);
            }
            else {
                this._templateInstance.update(result.values);
            }
        }
        render() {
            throw new Error('you must implement render()');
        }
    };
}
class KaonTemplateInstance extends TemplateInstance {
    _createPart(templatePart, node) {
        if (templatePart.type === 'attribute') {
            if (templatePart.rawName.startsWith('on-')) {
                const eventName = templatePart.rawName.substring(3);
                return new EventPart(node, eventName);
            }
            if (templatePart.name.endsWith('$')) {
                const name = templatePart.name.substring(0, templatePart.name.length - 1);
                return new AttributePart(node, name, templatePart.strings);
            }
            return new PropertyPart(node, templatePart.rawName, templatePart.strings);
        }
        return super._createPart(templatePart, node);
    }
}
class PropertyPart extends AttributePart {
    setValue(values) {
        const s = this.strings;
        if (s.length === 2 && s[0] === '' && s[s.length - 1] === '') {
            this.element[this.name] = this._getValue(values[0]);
        }
        else {
            let text = '';
            for (let i = 0; i < s.length; i++) {
                text += s[i];
                if (i < s.length - 1) {
                    text += this._getValue(values[i]);
                }
            }
            this.element[this.name] = text;
        }
    }
}
class EventPart extends Part {
    constructor(element, eventName) {
        super();
        this.element = element;
        this.eventName = eventName;
    }
    setValue(value) {
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
    handleEvent(event) {
        this._listener.call(this.element, event);
    }
}
