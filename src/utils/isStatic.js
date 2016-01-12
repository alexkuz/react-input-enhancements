export default function isStatic(opt) {
  return opt === null || opt && opt.static === true;
}
