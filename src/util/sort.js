// eslint-disable-next-line import/prefer-default-export
export function alphabeticallyBy(prop) {
  return (a, b) => {
    const aProp = a[prop].toLowerCase();
    const bProp = b[prop].toLowerCase();
    if (aProp < bProp) {
      return -1;
    }
    if (aProp > bProp) return 1;
    return 0;
  };
}
