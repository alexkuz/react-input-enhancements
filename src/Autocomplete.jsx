import React, { PureComponent, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import * as shapes from './shapes';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import deprecated from './utils/deprecated';

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
        const input = this.getInput();
        setSelection(input, this.state.value, this.state.matchingText);
      }
    }
  }

  getInput() {
    if (this.props.getInputElement) {
      return this.props.getInputElement();
    }

    if (this.input) {
      return this.input;
    }

    // eslint-disable-next-line
    deprecated('Automatic input resolving is deprecated: please provide input instance via `getInputElement` or `registerInput`');

    const el = ReactDOM.findDOMNode(this);
    return el.tagName === 'INPUT' ?
      el:
      el.getElementsByTagName('INPUT')[0];
  }

  render() {
    const { children } = this.props;
    const { matchingText, value } = this.state;
    const inputProps = {
      value: matchingText || value,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange
    };

    if (typeof children === 'function') {
      return children(inputProps, { matchingText, value, registerInput: this.registerInput });
    } else {
      const input = Children.only(children);
      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

  registerInput = c => this.input = c;

  handleSelectionChange = () => {
    const input = this.getInput();
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
    const input = this.getInput();
    if (input.selectionStart !== input.selectionEnd &&
        input.selectionEnd === input.value.length &&
        input.selectionStart !== 0) {
      input.value = input.value.substr(0, input.selectionStart);
    }
  }

  handleEnterKeyDown = () => {
    const input = this.getInput();

    setSelection(input, this.state.matchingText, this.state.matchingText);
    input.blur();
  }
}
