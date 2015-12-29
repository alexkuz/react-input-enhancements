export default function getOptionLabel(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    (opt.label || opt.text || opt.value);
}
