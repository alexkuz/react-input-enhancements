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
      value: props.value || props.defaultValue
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setValue(nextProps.value);
    }
  }

  setValue(value) {
    const match = findMatchingTextIndex(value, this.props.options);
    const [, matchingText] = match;
    this.setState({ value, matchingText });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
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

  handleChange = e => {
    const value = e.target.value;

    if (this.props.value === undefined) {
      this.setValue(value);
    }

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
