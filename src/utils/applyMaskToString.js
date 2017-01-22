// @flow

export type MaskResult = {
  result: string,
  unmaskedValue: string,
  isValid: true,
  lastIndex: number
} | {
  result: string,
  unmaskedValue: string,
  isValid: false
};

export default function applyMaskToString(
  string: string, pattern: string, emptyChar: string
): MaskResult {
  let result = '';
  let stringIndex = 0;
  let lastIndex = 0;

  string = string.replace(new RegExp(emptyChar, 'g'), '');
  for (var i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    if (patternChar === '\\') {
      string = string.replace(pattern[++i], '');
    } else if (patternChar !== '0' && patternChar !== 'a') {
      string = string.replace(patternChar, '');
    }
  }

  for (var i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    const stringChar = stringIndex < string.length ? string[stringIndex] : emptyChar;
    if (stringIndex < string.length) {
      lastIndex = result.length + 1;
    }

    switch (patternChar) {
    case 'a':
      if (!/^[a-zA-Z]$/.test(stringChar) && stringChar !== emptyChar) {
        return {
          result,
          unmaskedValue: string,
          isValid: false
        };
      }
      result += stringChar;
      stringIndex++;
      break;

    case '0':
      if (!/^[0-9]$/.test(stringChar) && stringChar !== emptyChar) {
        return {
          result,
          unmaskedValue: string,
          isValid: false
        };
      }
      result += stringChar;
      stringIndex++;
      break;

    case '\\':
      if (++i < pattern.length) {
        result += pattern[i];
        if (stringChar === pattern[i]) {
          stringIndex++;
        }
      }
      break;

    default:
      result += pattern[i];
      if (stringChar === pattern[i]) {
        stringIndex++;
      }
      break;
    }
  }

  const isValid = stringIndex >= string.length;

  return isValid ? {
    result,
    unmaskedValue: string,
    isValid: true,
    lastIndex
  } : {
    result,
    unmaskedValue: string,
    isValid: false
  };
}
