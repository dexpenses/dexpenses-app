import { parseProps } from './relative-dynamic-props';

// eslint-disable-next-line import/prefer-default-export
export async function parseLayout(rawLayout) {
  return Promise.all(
    rawLayout.map(item => parseProps(item.props).then(props => ({ ...item, props })))
  );
}
