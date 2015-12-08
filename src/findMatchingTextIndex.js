export default function findMatchingTextIndex(value, options) {
  const lowerText = value && value.toLowerCase();
  if (!value) {
    return [null, null, null];
  }

  for(let idx = 0; idx < options.length; idx++) {
    const opt = options[idx];
    const optValue = opt && opt.hasOwnProperty('value') ?
      opt.value :
      typeof opt === 'string' ? opt : null;
    const optText = opt && opt.hasOwnProperty('text') ?
      opt.text :
      typeof opt === 'string' ? opt : null;

    if (optValue === value ||
      optText && optText.toLowerCase().indexOf(lowerText) === 0) {
      if (optValue !== null) {
        return [idx, optText, optValue];
      }
    }
  }

  return [null, null, null];
}
