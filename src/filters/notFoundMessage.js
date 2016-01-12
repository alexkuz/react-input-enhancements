import isStatic from '../utils/isStatic';

function getEmptyOption(message) {
  return { label: message, static: true, disabled: true };
}

export default function notFoundMessage(message, ignoreStatic) {
  return (options, value) => {
    if (!ignoreStatic) {
      return options.length === 0 && value ? [
        getEmptyOption(message)
      ] : options;
    }

    const staticOptions = options.filter(isStatic);

    return options.length === staticOptions.length && value ? [
      ...staticOptions,
      getEmptyOption(message)
    ] : options;
  }
}
