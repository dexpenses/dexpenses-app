import firebase from 'firebase/app';
import { DateTime } from 'luxon';
import { isObject, map } from './object';
import store from '@/store';

const handlers = {
  now(mutations) {
    let date = DateTime.local();
    if (mutations) {
      Object.entries(mutations).forEach(([mutator, arg]) => {
        date = date[mutator](arg);
      });
    }
    return date.toSQLDate();
  },
  async home() {
    const ref = await firebase
      .firestore()
      .doc(`users/${store.state.user.user.uid}`)
      .get();
    if (ref.exists && ref.data().homeLocation) {
      return ref.data().homeLocation;
    }
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        },
        () => {
          resolve({ lat: 52, lng: 10 });
        }
      );
    });
  },
};

function parseDynamic(value, args) {
  const func = value.replace(/^\$/, '');

  if (!handlers[func]) {
    throw new Error('invalid prop handler reference');
  }
  return handlers[func](args);
}

function parsePropsInternal(props, promises) {
  return map(props, ([key, value]) => {
    let parsed;
    if (isObject(value)) {
      if (Object.keys(value).length === 1 && Object.keys(value)[0].startsWith('$')) {
        parsed = parseDynamic(Object.keys(value)[0], Object.values(value)[0]);
        if (parsed instanceof Promise) {
          promises.push(parsed);
        }
      } else {
        parsed = parsePropsInternal(value, promises);
      }
    } else if (typeof value === 'string' && value.startsWith('$')) {
      parsed = parseDynamic(value);
      if (parsed instanceof Promise) {
        promises.push(parsed);
      }
    } else {
      parsed = value;
    }
    return [key, parsed];
  });
}

async function unwrapPromises(obj) {
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
      entries.push([key, await unwrapPromises(value)]);
    } else {
      entries.push([key, value]);
    }
  }
  return Object.fromEntries(entries);
}

// eslint-disable-next-line import/prefer-default-export
export async function parseProps(props) {
  if (!props) {
    return props;
  }
  const promises = [];
  const propsWithPromises = parsePropsInternal(props, promises);
  await Promise.all(promises);
  return unwrapPromises(propsWithPromises);
}
