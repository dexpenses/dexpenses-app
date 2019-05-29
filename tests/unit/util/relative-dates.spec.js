import { parseProps } from '@/util/relative-dates';
import MockDate from 'mockdate';
import { DateTime } from 'luxon';

describe('relative-dates', () => {
  beforeEach(() => {
    MockDate.set(DateTime.fromSQL('2019-01-17').toJSDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should parse $now', () => {
    expect(parseProps({ start: '$now' }).start).toBe('2019-01-17');
  });

  it('should parse first of month', () => {
    expect(
      parseProps({
        start: { $now: { set: { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 } } },
      }).start
    ).toBe('2019-01-01');
  });

  it('should parse $oneYearAgo', () => {
    expect(parseProps({ start: { $now: { minus: { years: 1 } } } }).start).toBe('2018-01-17');
  });
});
