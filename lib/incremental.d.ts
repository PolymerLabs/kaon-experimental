import { Constructor } from './util.js';
import { Renderable } from './renderable.js';
export interface Incremental {
    patch(): any;
}
export declare function Incremental<T extends Constructor<Renderable & HTMLElement>>(superclass: T): Constructor<Incremental & Renderable & HTMLElement> & T;
