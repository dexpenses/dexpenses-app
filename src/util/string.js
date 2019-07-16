export function prettifySnakeCase(s) {
  if (!s) {
    return s;
  }
  return s
    .replace(/(^|_)([a-z])/g, (_, $1, $2) => `${$1}${$2.toUpperCase()}`)
    .replace(/_/g, ' ')
    .trim();
}

export function prettifyCamelCase(s) {
  if (!s) {
    return s;
  }
  return s[0].toUpperCase() + s.slice(1).replace(/([a-z])([A-Z])/g, (_, $1, $2) => `${$1} ${$2}`);
}

export function ext(f) {
  const parts = f.split('.');
  if (parts.length === 0) {
    return null;
  }
  return parts[parts.length - 1];
}
