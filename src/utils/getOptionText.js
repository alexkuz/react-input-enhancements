// @flow
import toString from './toString';
import type { Option } from '../types';

export default function getOptionText(opt: Option): string {
  if (typeof opt !== 'object') {
    return toString(opt);
  }

  if(opt.hasOwnProperty('text')) {
    return toString(opt.text);
  }

  if(opt.hasOwnProperty('label')) {
    return toString(opt.label);
  }

  if(opt.hasOwnProperty('value')) {
    return toString(opt.value);
  }

  return '';
}
