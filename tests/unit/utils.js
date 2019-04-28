// eslint-disable-next-line import/prefer-default-export
export function nextTickFor(vm) {
  return new Promise(resolve => {
    vm.$nextTick(() => resolve());
  });
}
