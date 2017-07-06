import * as idom from '../../incremental-dom/index.js';
export function Incremental(superclass) {
    return class extends superclass {
        constructor(...args) {
            super(...args);
            if (!this.shadowRoot) {
                this.attachShadow({ mode: 'open' });
            }
        }
        render() {
            console.log('Incremental.render', this.tagName);
            idom.patch(this.shadowRoot, () => this.patch());
        }
        patch() { }
    };
}
