const camelCaseCache = new Map();
export function toCamelCase(s) {
    let result = camelCaseCache.get(s);
    if (result == null) {
        result = s.replace(/-(\w)/, (_, p1) => p1.toUppercase());
        camelCaseCache.set(s, result);
    }
    return result;
}
