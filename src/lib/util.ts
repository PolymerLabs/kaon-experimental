export interface Constructor<T> {
  new (...args: any[]): T;
}

const camelCaseCache = new Map<string, string>();
export function toCamelCase(s: string) {
  let result = camelCaseCache.get(s);
  if (result == null) {
    result = s.replace(/-(\w)/, (_, p1) => p1.toUppercase());
    camelCaseCache.set(s, result);
  }
  return result;
}
