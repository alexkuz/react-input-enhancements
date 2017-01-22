// @flow
import isStatic from '../utils/isStatic';

import type { OptionFilter, Option } from '../types';

export default function limitBy(limit: number): OptionFilter {
  return (options: Option[]): Option[] => options.slice(0, limit + options.filter(isStatic).length);
}
