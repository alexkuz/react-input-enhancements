function isStatic(opt) {
  return opt === null || opt.static === true;
}

export default function limitBy(limit) {
  return options => options.slice(0, limit + options.filter(isStatic).length);
}
