import { Constructor } from './util.js';
export interface Renderable {
    needsRender: boolean;
    renderCallback(): any;
    invalidate(): any;
}
export declare function Renderable<T extends Constructor<HTMLElement>>(superclass: T): Constructor<Renderable> & T;
