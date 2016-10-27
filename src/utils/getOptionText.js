export default function getOptionText(opt) {
  if (!opt) return '';

  const text = Array.find(
    [opt, opt.text, opt.label, opt.value],
    value => typeof value === 'string' || typeof value === 'number'
  );

  return typeof text === 'number' ?
    text.toString() : (text || '');
}
