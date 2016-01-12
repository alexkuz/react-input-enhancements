import sort from 'lodash.sortby';
import getOptionText from '../utils/getOptionText';
import isStatic from '../utils/isStatic';

export default function sortByMatchingText(options, value) {
  value = value && value.toLowerCase();

  return sort(options, opt => {
    if (isStatic(opt)) {
      return 0;
    }

    const text = getOptionText(opt).toLowerCase();
    const matching = text.indexOf(value) === 0;
    return matching ? 1 : 2;
  });
}
