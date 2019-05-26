import { parseBigQueryGeographicPoint } from '@/util/geo';

describe('geo.parseBigQueryGeographicPoint', () => {
  it('should not fail on undefined', () => {
    expect(parseBigQueryGeographicPoint()).toBeUndefined();
  });
  it('should parse coordinates correctly', () => {
    expect(parseBigQueryGeographicPoint({ value: 'POINT(2.0 1.0)' })).toEqual({
      lng: 2.0,
      lat: 1.0,
    });

    expect(parseBigQueryGeographicPoint({ value: 'POINT(2.0 1)' })).toEqual({
      lng: 2.0,
      lat: 1,
    });

    expect(parseBigQueryGeographicPoint({ value: 'POINT(2 1.0)' })).toEqual({
      lng: 2,
      lat: 1.0,
    });

    expect(parseBigQueryGeographicPoint({ value: 'POINT(2 1)' })).toEqual({
      lng: 2,
      lat: 1,
    });
  });
});
