import { Interval } from 'luxon';

export function pluralizeUnit(unit) {
  return unit.endsWith('s') ? unit : `${unit}s`;
}

export function dateRange(unit, from, to) {
  const units = pluralizeUnit(unit);
  const d = Interval.fromDateTimes(from, to).toDuration(units);
  return [
    from.toJSDate(),
    ...Array(Math.floor(d[units]))
      .fill()
      .map((_, i) => from.plus({ [units]: i + 1 }).toJSDate()),
    to.toJSDate(),
  ];
}
