import { parseProps } from './relative-dates';

// eslint-disable-next-line import/prefer-default-export
export function parseLayout(rawLayout) {
  return rawLayout.map(item => ({
    ...item,
    props: parseProps(item.props),
  }));
}
