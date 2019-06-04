import { isObject } from '@/util/object';

export function collectPromises(obj) {
  return Object.entries(obj).flatMap(([, value]) => {
    if (value instanceof Promise) {
      return [value];
    }
    if (isObject(value)) {
      return collectPromises(value);
    }
    return [];
  });
}

async function unwrapPromisesSync(obj) {
  const entries = [];
  const wrapped = Object.entries(obj);
  for (let i = 0; i < wrapped.length; i += 1) {
    const [key, value] = wrapped[i];
    // await in loop does not matter because all promises are already resolved
    if (value instanceof Promise) {
      // eslint-disable-next-line no-await-in-loop
      entries.push([key, await value]);
    } else if (isObject(value)) {
      // eslint-disable-next-line no-await-in-loop
      entries.push([key, await unwrapPromisesSync(value)]);
    } else {
      entries.push([key, value]);
    }
  }
  return Object.fromEntries(entries);
}

export async function unwrapPromises(obj) {
  const promises = collectPromises(obj);
  await Promise.all(promises);
  return unwrapPromisesSync(obj);
}
