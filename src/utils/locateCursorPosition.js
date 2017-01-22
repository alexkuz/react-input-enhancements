// @flow
import applyMaskToString from './applyMaskToString';

export default function locateCursorPosition(
  position: number, value: string, pattern: string, emptyChar: string
): number {
  const result = applyMaskToString(value.substr(0, position), pattern, emptyChar);

  if (result.isValid) {
    return result.lastIndex;
  }

  return -1;
}
