export default function filterRedudantSeparators(options) {
  const length = options.length;

  return options.filter(
    (opt, idx) =>
      opt !== null ||
      (idx > 0 && idx !== length - 1 && options[idx - 1] !== null)
  );
}
