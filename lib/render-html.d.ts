import { Constructor } from "./util";
export interface RenderHTML {
    render(): any;
}
export declare function RenderHTML<T extends Constructor<HTMLElement>>(superclass: T): Constructor<RenderHTML> & T;
