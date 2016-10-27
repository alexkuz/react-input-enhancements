import getOptionText from './getOptionText';

const toLower = (val='') =>
  (val === null ? '' : val).toString().toLowerCase();

export default function findMatchingTextIndex(value, options, allMatches) {
  const lowerText = toLower(value);

  const foundOptions = options.reduce((opts, opt, idx) => {
    if (opt && opt.disabled) {
      return opts;
    }

    const optValue = opt && opt.hasOwnProperty('value') ?
      opt.value :
      typeof opt === 'string' ? opt : null;
    const optText = getOptionText(opt);
    const matchPosition = toLower(optText).indexOf(lowerText);

    if (optValue === value && opt !== null ||
      optText && lowerText && (allMatches ? matchPosition !== -1 : matchPosition === 0)) {

      return [...opts, [idx, optText, optValue, matchPosition, optText.toLowerCase()]];
    }

    return opts;
  }, []);

  foundOptions.sort((a, b) => {
    return (a[3] - b[3]) || (a[4] > b[4] ? 1 : -1);
  });

  return foundOptions.length ? foundOptions[0] : [null, null, null];
}
