export default function getOptionText(opt) {
  if (!opt) return '';

  return [
    opt, opt.text, opt.label, opt.value
  ].find(value => typeof value === 'string') || '';
}
