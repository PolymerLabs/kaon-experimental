import { Constructable } from './util';
export interface KaonBase extends HTMLElement {
    isLayoutValid: boolean;
    render(): any;
    invalidate(): any;
}
export declare let Kaon: (superclass: Constructable<HTMLElement>) => Constructable<KaonBase>;
