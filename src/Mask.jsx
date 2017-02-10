import { PureComponent, PropTypes } from 'react';
import applyMaskToString from './applyMaskToString';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';

function getStateFromProps(value, props) {
  value = props.onValuePreUpdate(value);
  let processedValue = applyMaskToString(value, props.pattern, props.emptyChar);
  const validatedValue = props.onValidate(value, processedValue);
  if (validatedValue && validatedValue.result) {
    processedValue = validatedValue;
  } else if (validatedValue) {
    processedValue.isValid = false;
  }
  const state = processedValue.isValid ?
    { value: processedValue.result, lastIndex: processedValue.lastIndex } :
    {};

  if (!processedValue.unmaskedValue && props.placeholder) {
    state.value = '';
  }

  return [state, processedValue];
}

export default class Mask extends PureComponent {
  constructor(props) {
    super(props);

    const value = props.value || '';
    const [state] = getStateFromProps(value, props);
    this.state = {
      value,
      lastIndex: 0,
      ...state
    };
  }

  static propTypes = {
    getInputElement: PropTypes.func,
    value: PropTypes.string,
    pattern: PropTypes.string.isRequired,
    emptyChar: PropTypes.string
  };

  static defaultProps = {
    emptyChar: ' ',
    onValidate: () => {},
    onValuePreUpdate: v => v
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pattern !== nextProps.pattern ||
      this.props.value !== nextProps.value ||
      this.props.emptyChar !== nextProps.emptyChar) {
      this.setValue(nextProps.value, nextProps);
    }
  }

  setValue(value, props) {
    const [state, processedValue] = getStateFromProps(value, props);

    if (processedValue.isValid) {
      this.setState(
        state,
        () => this.setSelectionRange(this.state.lastIndex)
      );
    } else {
      this.setSelectionRange(this.state.lastIndex);
    }

    return processedValue;
  }

  setSelectionRange(lastIndex) {
    const input = getInput(this);
    if (input === document.activeElement) {
      input.setSelectionRange(lastIndex, lastIndex);
    }
  }

  registerInput = input => registerInput(this, input);

  render() {
    const { children, placeholder } = this.props;
    const { value } = this.state;
    const inputProps = {
      value,
      placeholder,
      onInput: this.handleInput
    };

    return renderChild(children, inputProps, { value }, this.registerInput);
  }

  // works better for IE than onChange
  handleInput = e => {
    const value = e.target.value;

    if (this.props.value === undefined) {
      const processedValue = this.setValue(value, this.props);
      if (!processedValue.isValid) {
        e.preventDefault();
        return;
      }

      e.target.value = processedValue.result;

      if (this.props.onUnmaskedValueChange) {
        this.props.onUnmaskedValueChange(processedValue.unmaskedValue);
      }
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}
