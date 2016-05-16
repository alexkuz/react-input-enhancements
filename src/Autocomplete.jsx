import React, { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import findMatchingTextIndex from './utils/findMatchingTextIndex';

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

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchingText: null,
      value: (typeof props.value === 'undefined') ? props.defaultValue : props.value
    };
  }

  static propTypes = {
    getInputElement: PropTypes.func,
    value: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING)
  }

  static defaultProps = {
  }

  shouldComponentUpdate = shouldPureComponentUpdate

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

    const el = ReactDOM.findDOMNode(this);
    return el.tagName === 'INPUT' ?
      el:
      el.getElementsByTagName('INPUT')[0];
  }

  render() {
    const { children, ...props } = this.props;
    const { matchingText, value } = this.state;
    const inputProps = {
      ...props,
      value: matchingText || value,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange
    };

    if (typeof children === 'function') {
      return children(inputProps, { matchingText, value });
    } else {
      const input = Children.only(children);
      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

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
