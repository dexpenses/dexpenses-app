import { DateTime } from 'luxon';

const relativeDateFunction = {
  now: now => now,
};

function parseDate(value, mutations) {
  const func = value.replace(/^\$/, '');

  if (!relativeDateFunction[func]) {
    throw new Error('invalid relative date start point');
  }
  let date = relativeDateFunction[func](DateTime.local());
  if (mutations) {
    Object.entries(mutations).forEach(([mutator, arg]) => {
      date = date[mutator](arg);
    });
  }
  return date.toSQLDate();
}

// eslint-disable-next-line import/prefer-default-export
export function parseProps(props) {
  if (!props) {
    return props;
  }
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      let parsed;
      if (value === Object(value)) {
        if (Object.keys(value).length === 1 && Object.keys(value)[0].startsWith('$')) {
          parsed = parseDate(Object.keys(value)[0], Object.values(value)[0]);
        } else {
          parsed = parseProps(value);
        }
      } else if (typeof value === 'string' && value.startsWith('$')) {
        parsed = parseDate(value);
      } else {
        parsed = value;
      }
      return [key, parsed];
    })
  );
}
