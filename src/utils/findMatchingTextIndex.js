function getOptionText(opt) {
  return (typeof opt === 'string' || !opt ?
    opt :
    opt.text || opt.value) || '';
}

function isEmpty(value) {
  return value === null || value === '';
}

export default function findMatchingTextIndex(value, options, allMatches) {
  const lowerText = value && value.toLowerCase();

  const foundOptions = options.reduce((opts, opt, idx) => {
    const optValue = opt && opt.hasOwnProperty('value') ?
      opt.value :
      typeof opt === 'string' ? opt : null;
    const optText = getOptionText(opt);
    const matchPosition = optText.toLowerCase().indexOf(lowerText);

    if (optValue === value ||
      isEmpty(optValue) && isEmpty(value) ||
      optText && lowerText && (allMatches ? matchPosition !== -1 : matchPosition === 0)) {

      return [...opts, [idx, optText, optValue, matchPosition]];
    }

    return opts;
  }, []);

  foundOptions.sort((a, b) => {
    return (a[3] - b[3]) || (a[1].length - b[1].length);
  });

  return foundOptions.length ? foundOptions[0] : [null, null, null];
}
