import Vue from 'vue';
import { DateTime } from 'luxon';

const dataSizes = ['B', 'KB', 'MB', 'GB', 'TB'];

function pickUnit(value) {
  let i = 0;
  let unitValue = value;
  while (unitValue > 1000 && i < dataSizes.length) {
    unitValue /= 1000;
    i += 1;
  }
  return [i, unitValue];
}

Vue.filter('dataSize', value => {
  const [i, unitValue] = pickUnit(value);
  return `${unitValue.toFixed(2)} ${dataSizes[i]}`;
});

Vue.filter('dataSizeProgress', ([value, total]) => {
  const [i, totalUnitValue] = pickUnit(total);
  return `${(value / 1000 ** i).toFixed(2)}/${totalUnitValue.toFixed(2)} ${dataSizes[i]}`;
});

const currencies = {
  EUR: '€',
};
Vue.filter('currency', money => {
  if (!money) {
    return '';
  }
  const { value, currency } = money;
  return `${value.toFixed(2)} ${currencies[currency] || currency}`;
});

Vue.filter('date', value => {
  if (!value) {
    return '';
  }
  let date = value;
  if (value.toDate) {
    date = value.toDate();
  }
  return DateTime.fromJSDate(date, {
    zone: 'Europe/Berlin',
  }).toFormat('MM/dd/yyyy');
});

Vue.filter('time', value => {
  if (!value) {
    return value;
  }
  const { hour, minute, second } = value;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}${
    second ? `:${second.toString().padStart(2, '0')}` : ''
  }`;
});

Vue.filter('address', value => (!value ? '' : `${value.street}, ${value.city}`));
