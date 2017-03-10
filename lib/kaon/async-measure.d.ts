import { Constructable } from './util';
export interface AsyncMeasure extends HTMLElement {
    isLayoutValid: boolean;
    measure(): Promise<any>;
}
export declare const AsyncMeasureMixin: (superclass: Constructable<HTMLElement>) => Constructable<AsyncMeasure>;
