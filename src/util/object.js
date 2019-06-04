export function isObject(obj) {
  return (
    obj === Object(obj) &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !(obj instanceof Promise) &&
    !(obj instanceof RegExp)
  );
}

export function map(obj, mapper) {
  return Object.fromEntries(Object.entries(obj).map(mapper));
}
