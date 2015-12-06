export default function findMatchingText(text, options) {
  if (!text) {
    return null;
  }

  const lowerText = text.toLowerCase();

  for(const opt of options) {
    const optText = (opt && opt.text ? opt.text : opt);
    if (optText && optText.toLowerCase().indexOf(lowerText) === 0) {
      return optText;
    }
  }

  return null;
}
