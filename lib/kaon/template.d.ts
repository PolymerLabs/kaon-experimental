import { Constructable } from './util';
import { KaonBase } from './base';
export declare const template: (selector: any) => (clazz: any) => any;
export interface TemplateStamping extends KaonBase {
    template: HTMLTemplateElement;
}
export declare const TemplateStampingMixin: (superclass: Constructable<any>) => Constructable<TemplateStamping>;
