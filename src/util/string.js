// eslint-disable-next-line import/prefer-default-export
export function prettifySnakeCase(s) {
  if (!s) {
    return s;
  }
  return s
    .replace(/(^|_)([a-z])/g, (_, $1, $2) => `${$1}${$2.toUpperCase()}`)
    .replace(/_/g, ' ')
    .trim();
}
