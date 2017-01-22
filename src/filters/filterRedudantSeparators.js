// @flow
import type { OptionFilter, Option } from '../types';
import deprecated from '../utils/deprecated';

function isSeparatorOption(opt: Option): boolean {
  if (opt === null) {
    deprecated('Using null for separator option is deprecated; use { separator: true }');
    opt = { separator: true };
  }

  return typeof opt !== 'string' && opt && !!(opt.separator);
}

function filterRedudantSeparators(options: Option[]): Option[] {
  return options.reduce((opts, opt) =>
    (isSeparatorOption(opt) && opts.length && isSeparatorOption(opts[opts.length - 1])) ?
      opts : [...opts, opt]
  , []);
}

export default (filterRedudantSeparators: OptionFilter);
