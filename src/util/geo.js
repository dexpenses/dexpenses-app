// eslint-disable-next-line import/prefer-default-export
export function parseBigQueryGeographicPoint(point) {
  if (!point) {
    return point;
  }
  const m = point.value.match(/^POINT\((.*)\)$/);
  if (!m) {
    return null;
  }
  const [lng, lat] = m[1].split(' ').map(p => Number(p));
  return { lng, lat };
}
