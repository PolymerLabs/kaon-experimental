import { Constructor } from './util.js';
export interface AsyncMeasure extends HTMLElement {
    isLayoutValid: boolean;
    measure(): Promise<any>;
}
export declare const AsyncMeasure: (superclass: Constructor<HTMLElement>) => Constructor<AsyncMeasure>;
