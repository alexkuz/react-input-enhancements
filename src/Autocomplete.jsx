import { PureComponent, PropTypes } from 'react';
import * as shapes from './shapes';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';

function setSelection(input, text, matchingText) {
  if (text === null) {
    input.value = null;
  } else {
    input.value = matchingText;
    if (text.length !== matchingText.length) {
      input.setSelectionRange(text.length, matchingText.length);
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

  static defaultProps = {
  };

  componentWillMount() {
    document.addEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
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
    const match = findMatchingTextIndex(value, options);
    const [, matchingText] = match;
    this.setState({ value, matchingText });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value ||
        this.state.matchingText !== prevState.matchingText) {
      if (this.state.matchingText) {
        const input = getInput(this);
        setSelection(input, this.state.value, this.state.matchingText);
      }
    }
  }

  registerInput = input => registerInput(this, input);

  render() {
    const { children } = this.props;
    const { matchingText, value } = this.state;
    const inputProps = {
      value: matchingText || value,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange
    };

    return renderChild(children, inputProps, { matchingText, value }, this.registerInput);
  }

  handleSelectionChange = () => {
    const input = getInput(this);
    if (input.selectionStart === input.selectionEnd &&
      input.value !== this.state.value) {
      this.setValue(input.value, this.props.options);
    }
  }

  handleChange = e => {
    const value = e.target.value;

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
      input.value = input.value.substr(0, input.selectionStart);
    }
  }

  handleEnterKeyDown = () => {
    const input = getInput(this);

    setSelection(input, this.state.matchingText, this.state.matchingText);
    input.blur();
  }
}
