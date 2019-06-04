import firebase from 'firebase/app';
import { DateTime } from 'luxon';
import { isObject, map } from './object';
import store from '@/store';
import { unwrapPromises } from './promises';

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

function parsePropsInternal(props) {
  return map(props, ([key, value]) => {
    let parsed;
    if (isObject(value)) {
      if (Object.keys(value).length === 1 && Object.keys(value)[0].startsWith('$')) {
        parsed = parseDynamic(Object.keys(value)[0], Object.values(value)[0]);
      } else {
        parsed = parsePropsInternal(value);
      }
    } else if (typeof value === 'string' && value.startsWith('$')) {
      parsed = parseDynamic(value);
    } else {
      parsed = value;
    }
    return [key, parsed];
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function parseProps(props) {
  if (!props) {
    return props;
  }
  const propsWithPromises = parsePropsInternal(props);
  return unwrapPromises(propsWithPromises);
}
