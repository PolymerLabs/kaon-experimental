export interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function toCamelCase(s: string): string;
