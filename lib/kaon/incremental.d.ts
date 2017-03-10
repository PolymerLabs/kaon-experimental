import { Constructable } from './util';
import { Renderable } from './renderable';
export interface Incremental {
    patch(): any;
    _elem(tagnameOrConstructor: string | {
        new (): Element;
    }, props: {
        [name: string]: any;
    } | null, ...children: IDomNode[]): IDomNode;
}
export interface IDomElement {
    tagnameOrConstructor: string | {
        new (): Element;
    };
    attributes: (string | any)[];
    properties: Map<string, any>;
    listeners: Map<string, any>;
    children: IDomNode[];
}
export declare type IDomNode = IDomElement | string;
export declare function Incremental<T extends Constructable<Renderable & HTMLElement>>(superclass: T): Constructable<Incremental> & T;
