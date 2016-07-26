const WARNED = [];

export default function deprecated(message) {
  if (WARNED.indexOf(message) === -1) {
    console.warn(message); // eslint-disable-line no-console
    WARNED.push(message);
  }
}
