export function isObject(obj) {
  return obj === Object(obj);
}

export function map(obj, mapper) {
  return Object.fromEntries(Object.entries(obj).map(mapper));
}
