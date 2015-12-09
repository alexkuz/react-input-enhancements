function getOptionText(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    typeof opt.label === 'string' ?
      opt.label :
      opt.text || opt.value;
}

export default function findMatchingTextIndex(value, options) {
  const lowerText = value && value.toLowerCase();
  if (!value) {
    return [null, null, null];
  }

  const foundOptions = options.reduce((opts, opt, idx) => {
    const optValue = opt && opt.hasOwnProperty('value') ?
      opt.value :
      typeof opt === 'string' ? opt : null;
    const optText = getOptionText(opt);

    if (optValue === value ||
      optText && optText.toLowerCase().indexOf(lowerText) === 0) {
      if (optValue !== null) {
        return [...opts, [idx, optText, optValue]];
      }
    }

    return opts;
  }, []);

  foundOptions.sort((a, b) => {
    return a[1].length - b[1].length;
  });

  return foundOptions.length ? foundOptions[0] : [null, null, null];
}
