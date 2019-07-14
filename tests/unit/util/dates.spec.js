import { DateTime } from 'luxon';
import { dateRange } from '@/util/dates';

describe('dates.dateRange', () => {
  it('should every month from 01/01 - 03/01 + 03/31', () => {
    expect(
      dateRange('months', DateTime.fromSQL('2019-01-01'), DateTime.fromSQL('2019-03-31')).map(d =>
        DateTime.fromJSDate(d).toSQLDate()
      )
    ).toEqual(['2019-01-01', '2019-02-01', '2019-03-01', '2019-03-31']);
  });

  it('should every day from 01/01 - 01/31', () => {
    expect(
      dateRange('days', DateTime.fromSQL('2019-01-01'), DateTime.fromSQL('2019-01-05')).map(d =>
        DateTime.fromJSDate(d).toSQLDate()
      )
    ).toEqual(['2019-01-01', '2019-01-02', '2019-01-03', '2019-01-04', '2019-01-05', '2019-01-05']);
  });
});
