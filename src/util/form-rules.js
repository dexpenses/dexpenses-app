export const required = v => !!v || 'Required.';

export const maxLength = l => v => !v || v.length <= l || `Max length is ${l}`;

function validateIntRange(value, min, max) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    return 'Must be a number.';
  }
  if (value >= min && value <= max) {
    return true;
  }
  return `Value must be between ${min} and ${max}.`;
}
export const intRange = (min, max) => v => !v || validateIntRange(v, min, max);
