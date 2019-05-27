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

  it('should parse $firstOfMonth', () => {
    expect(parseProps({ start: '$firstOfMonth' }).start).toBe('2019-01-01');
  });

  it('should parse $oneYearAgo', () => {
    expect(parseProps({ start: '$oneYearAgo' }).start).toBe('2018-01-17');
  });
});
