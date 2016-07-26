export default function registerInput(cmp, input) {
  cmp.input = input;

  if (typeof cmp.props.registerInput === 'function') {
    cmp.props.registerInput(input);
  }
}
