// @flow

export default function toString(val: any): string {
  return (val === null || val === undefined) ? '' : val.toString();
}
