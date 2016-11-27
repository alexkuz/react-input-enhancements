import { PureComponent, PropTypes } from 'react';
import * as shapes from './shapes';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';

function updateInputSelection(input, start, end) {
  input.setSelectionRange(start, end);
}

function updateInputNode(input, value) {
  input.value = value;
}

function setSelection(input, text, matchingText) {
  if (text === null) {
    updateInputNode(input, null);
  } else {
    updateInputNode(input, matchingText);
    if (text.length !== matchingText.length) {
      updateInputSelection(input, text.length, matchingText.length);
    }
  }
}

export default class Autocomplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchingText: null,
      value: props.value
    };
  }

  static propTypes = {
    getInputElement: PropTypes.func,
    value: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING).isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value &&
      nextProps.value !== this.state.value) {
      this.setValue(nextProps.value, nextProps.options);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.options !== nextProps.options &&
      this.props.value === nextProps.value) {
      const match = findMatchingTextIndex(nextState.value, nextProps.options);
      const [, matchingText] = match;
      this.setState({ matchingText });
    }
  }

  setValue(value, options) {
    if (value === this.state.value) {
      return;
    }
    const match = findMatchingTextIndex(value, options);
    const [, matchingText] = match;
    this.setState({ value, matchingText });
  }

  componentDidUpdate() {
    const matchingText = this.state.matchingText || '';
    const value = this.state.value || '';

    if (matchingText && value.length !== matchingText.length) {
      const input = getInput(this);
      setSelection(input, this.state.value, this.state.matchingText);
    }
  }

  registerInput = input => registerInput(this, input);

  render() {
    const { children } = this.props;
    const { matchingText, value } = this.state;
    const inputProps = {
      value: matchingText || value,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      onBlur: this.handleBlur
    };

    return renderChild(children, inputProps, { matchingText, value }, this.registerInput);
  }

  handleChange = e => {
    let value = e.target.value;

    this.setValue(value, this.props.options);

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = e => {
    const keyMap = {
      Backspace: this.handleBackspaceKeyDown,
      Enter: this.handleEnterKeyDown
    }

    if (keyMap[e.key]) {
      keyMap[e.key](e);
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleBackspaceKeyDown = () => {
    const input = getInput(this);
    if (input.selectionStart !== input.selectionEnd &&
        input.selectionEnd === input.value.length &&
        input.selectionStart !== 0) {
      const value = input.value.substr(0, input.selectionStart);
      this.setValue(value.substr(0, value.length - 1), this.props.options);
      updateInputNode(input, value);
    }
  }

  handleEnterKeyDown = () => {
    const input = getInput(this);

    setSelection(input, this.state.matchingText, this.state.matchingText);
    input.blur();
  }

  handleBlur = () => {
    const input = this.getInput();
    setSelection(input, this.state.matchingText, this.state.matchingText);
  }
  
}
