// @flow
import ReactDOM from 'react-dom';
import deprecated from './deprecated';

import type { ComponentWithInput } from '../types';

export default function getInput(cmp: ComponentWithInput): HTMLInputElement {
  if (cmp.props.getInputElement) {
    return cmp.props.getInputElement();
  }

  if (cmp.input) {
    return cmp.input;
  }

  // eslint-disable-next-line
  deprecated('Automatic input resolving is deprecated: please provide input instance via `registerInput`');

  const el = ReactDOM.findDOMNode(cmp);
  return el.tagName === 'INPUT' ?
    el:
    el.getElementsByTagName('INPUT')[0];
}
