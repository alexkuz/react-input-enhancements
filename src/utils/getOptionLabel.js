// @flow
import type { Option } from '../types';

export default function getOptionLabel(opt: Option, highlighted: boolean): any {
  if (typeof opt === 'string' || typeof opt === 'number') {
    return opt;
  }

  if (opt) {
    if (typeof opt.label === 'function') {
      return opt.label(opt, highlighted);
    }

    if (opt.hasOwnProperty('label')) { return opt.label; }

    if (opt.hasOwnProperty('text')) { return opt.text; }

    if (opt.hasOwnProperty('value')) { return opt.value; }
  }
}
