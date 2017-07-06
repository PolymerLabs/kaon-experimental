const renderPromise = Promise.resolve();
function scheduleRender(renderable) {
    renderPromise.then(() => render(renderable));
}
function render(renderable) {
    renderable.needsRender = false;
    try {
        renderable.render();
    }
    catch (e) {
        console.warn('error rendering', renderable['tagName']);
        console.error(e);
    }
}
export function Renderable(superclass) {
    return class extends superclass {
        constructor(...args) {
            super(...args);
            this.needsRender = false;
            this.invalidate();
        }
        render() {
        }
        invalidate() {
            if (!this.needsRender) {
                this.needsRender = true;
                scheduleRender(this);
            }
        }
    };
}
