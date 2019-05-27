import { DateTime } from 'luxon';

const relativeDateFunction = {
  now: now => now,
  firstOfMonth: now => now.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }),
  oneYearAgo: now => now.minus({ years: 1 }),
};

function parseDate(value) {
  const func = value.replace(/^\$/, '');

  if (relativeDateFunction[func]) {
    return relativeDateFunction[func](DateTime.local()).toSQLDate();
  }
  return value;
}

/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/prefer-default-export
export function parseProps(props) {
  if (!props) {
    return props;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(props)) {
    if (value === Object(value)) {
      props[key] = parseProps(value);
    } else if (typeof value === 'string' && value.startsWith('$')) {
      props[key] = parseDate(value);
    }
  }
  return props;
}
