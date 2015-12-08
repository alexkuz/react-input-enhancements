export default function limitBy(limit) {
  return options => options.slice(0, limit);
}
