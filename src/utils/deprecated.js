// @flow
const WARNED: string[] = [];

export default function deprecated(message: string) {
  if (WARNED.indexOf(message) === -1) {
    console.warn(message);
    WARNED.push(message);
  }
}
