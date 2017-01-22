// @flow
import type { Option } from '../types';

export default function getOptionValue(opt: Option): any {
  if (typeof opt !== 'object') {
    return opt;
  }

  if (opt && opt.hasOwnProperty('value')) {
    return opt.value;
  }
}
