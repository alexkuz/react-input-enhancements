import ReactDOM from 'react-dom';
import deprecated from './deprecated';

export default function getInput(cmp) {
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
