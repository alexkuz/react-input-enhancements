// @flow
import type { Option } from '../types';

export default function isStatic(opt: Option): boolean {
  if (opt === null) {
    return true;
  }

  if (opt) {
    return opt.static === true || opt.selector === true;
  }

  return false;
}
