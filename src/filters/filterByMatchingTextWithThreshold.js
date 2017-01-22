// @flow
import getOptionText from '../utils/getOptionText';
import isStatic from '../utils/isStatic';

import type { OptionFilter } from '../types';

export default function filterByMatchingTextWithThreshold(threshold: number): OptionFilter {
  return (options, value) => {
    if (!value || threshold && options.length < threshold) return options;
    value = value.toLowerCase();

    return options.filter(opt => {
      return isStatic(opt) || getOptionText(opt).toLowerCase().indexOf(value) !== -1
    });
  }
}
