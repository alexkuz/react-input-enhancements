// @flow
import getOptionText from './getOptionText';
import getOptionValue from './getOptionValue';

import type { Option } from '../types';

type MatchResult = {
  index: number,
  text: string,
  value: any,
  position: number,
  lowercaseText: string
}

type NoResult = { noResult: true };

const toLower = (val: any = ''): string =>
  ((val === null || val === undefined) ? '' : val).toString().toLowerCase();

export default function findMatchingTextIndex(
  value: any, options: Option[], allMatches: boolean = false
): MatchResult | NoResult {
  const lowerText = toLower(value);

  const foundOptions: MatchResult[] = options.reduce((opts: MatchResult[], opt, index) => {
    if (opt === null || opt === undefined || opt.disabled || opt.separator) {
      return opts;
    }

    const optValue = getOptionValue(opt);
    const optText = getOptionText(opt);
    const matchPosition = toLower(optText).indexOf(lowerText);

    if (optValue === value ||
      optText && lowerText && (allMatches ? matchPosition !== -1 : matchPosition === 0)) {

      return [...opts, {
        index,
        text: optText,
        value: optValue,
        position: matchPosition,
        lowercaseText: optText.toLowerCase()
      }];
    }

    return opts;
  }, []);

  foundOptions.sort((a, b) => {
    return (a.position - b.position) || (a.lowercaseText > b.lowercaseText ? 1 : -1);
  });

  return foundOptions.length ? foundOptions[0] : { noResult: true };
}
