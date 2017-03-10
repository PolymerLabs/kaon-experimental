import { Constructable } from './util';
export interface Renderable {
    needsRender: boolean;
    render(): any;
    invalidate(): any;
}
export declare function Renderable<T extends Constructable<HTMLElement>>(superclass: T): Constructable<Renderable> & T;
