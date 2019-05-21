import { prettifySnakeCase, prettifyCamelCase } from '@/util/string';

describe('util/string.prettifySnakeCase', () => {
  it('should capitalize string without _', () => {
    expect(prettifySnakeCase('foo')).toBe('Foo');
  });

  it('should capitalize after _ and replace _ by " "', () => {
    expect(prettifySnakeCase('foo_bar')).toBe('Foo Bar');
  });

  it('should omit dangling _', () => {
    expect(prettifySnakeCase('_foo_bar_')).toBe('Foo Bar');
  });
});

describe('util/string.prettifyCamelCase', () => {
  it('should capitalize simple string', () => {
    expect(prettifyCamelCase('foo')).toBe('Foo');
  });

  it('should replace bump by space', () => {
    expect(prettifyCamelCase('fooBar')).toBe('Foo Bar');
  });
});
