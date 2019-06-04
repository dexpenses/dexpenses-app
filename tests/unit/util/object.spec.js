import { isObject } from '@/util/object';

describe('util/isObject', () => {
  it.each([
    ['the empty object', {}],
    ['single property object', { foo: 'bar' }],
    ['Object.create({})', Object.create({})],
    ['Object.create(Object.prototype)', Object.create(Object.prototype)],
    ['Object.create(null)', Object.create(null)],
  ])('should be true for %s', (name, testValue) => {
    expect(isObject(testValue)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['number', 1],
    ['string', 'string'],
    ['boolean', true],
    ['anonymous function', () => true],
    [
      'function',
      function func() {
        return true;
      },
    ],
    ['empty array', []],
    ['array', ['e']],
    ['promise', Promise.resolve(1)],
    ['regex', /regex/],
  ])('should be false for %s', (name, testValue) => {
    expect(isObject(testValue)).toBe(false);
  });
});
