import sort from 'lodash.sortby';

function getOptionText(opt) {
  return typeof opt === 'string' ?
    opt :
    typeof opt.label === 'string' ?
      opt.label :
      opt.text || opt.value;
}

function isStatic(opt) {
  return opt === null || opt.static === true;
}

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
