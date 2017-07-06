import { Constructor } from './util.js';
import { Renderable } from './renderable.js';
import { Incremental } from './incremental.js';
export interface IDomElement {
    tagnameOrConstructor: string | {
        new (): Element;
    };
    props: {
        [name: string]: any;
    } | null;
    children: IDomNode[];
}
export declare type IDomNode = IDomElement | string;
export declare function createElement(): void;
export interface Props {
    children?: any;
}
export interface Component<P extends Props> {
    props: P;
}
export declare type JSXFactory<P extends Props, C extends Component<P>> = (tagnameOrConstructor: string | C, props: P | null, ...children: P['children'][]) => any;
export declare namespace JSX {
    interface ElementClass {
        render: any;
    }
}
export interface IncrementalJsx extends Incremental {
    patchJsx(): IDomNode | IDomNode[] | undefined;
}
export declare function IncrementalJsx<T extends Constructor<Renderable & HTMLElement>>(superclass: T): Constructor<IncrementalJsx> & T;
