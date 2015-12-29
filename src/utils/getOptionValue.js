export default function getOptionValue(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    opt.value;
}
