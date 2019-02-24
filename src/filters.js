import Vue from 'vue';

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

Vue.filter('dataSize', (value) => {
  const [i, unitValue] = pickUnit(value);
  return `${unitValue.toFixed(2)} ${dataSizes[i]}`;
});

Vue.filter('dataSizeProgress', ([value, total]) => {
  const [i, totalUnitValue] = pickUnit(total);
  return `${(value / (1000 ** i)).toFixed(2)}/${totalUnitValue.toFixed(2)} ${dataSizes[i]}`;
});
