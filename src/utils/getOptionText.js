export default function getOptionText(opt) {
  if (!opt) return '';

  return Array.find(
    [opt, opt.text, opt.label, opt.value],
    value => typeof value === 'string'
  ) || '';
}
