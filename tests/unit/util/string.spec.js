import { prettifySnakeCase } from '@/util/string';

describe('StringUtil.prettifySnakeCase', () => {
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
