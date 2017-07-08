export interface InvalidationFunction {
    (a: any, b: any): boolean;
}
export declare const Invalidate: {
    ALWAYS: (a: any, b: any) => boolean;
    NOT_IDENTICAL: (a: any, b: any) => boolean;
};
export interface PropertyOptions {
    invalidate?: InvalidationFunction;
    eventName?: string;
}
export declare function property(options?: PropertyOptions): (clazz: any, propName: string) => any;
export declare function initializeProperties(clazz: any): void;
