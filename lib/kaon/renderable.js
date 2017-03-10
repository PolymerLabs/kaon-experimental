var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    let renderPromise = null;
    const renderQueue = [];
    function scheduleRender(renderable) {
        renderQueue.push(renderable);
        if (renderPromise == null) {
            renderPromise = (() => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < renderQueue.length; i++) {
                    const renderable = renderQueue[i];
                    renderQueue[i] = undefined;
                    renderable.needsRender = false;
                    try {
                        renderable.render();
                    }
                    catch (e) {
                    }
                }
                renderQueue.length = 0;
                renderPromise = null;
            }))();
        }
    }
    function Renderable(superclass) {
        return class extends superclass {
            constructor(...args) {
                super(...args);
                this.needsRender = false;
                this.invalidate();
            }
            render() { }
            invalidate() {
                if (!this.needsRender) {
                    this.needsRender = true;
                    scheduleRender(this);
                }
            }
        };
    }
    exports.Renderable = Renderable;
});
