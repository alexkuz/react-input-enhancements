import React, { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import applyMaskToString from './applyMaskToString';

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

export default class Mask extends Component {
  constructor(props) {
    super(props);


    const value = props.value || props.defaultValue || '';
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
    defaultValue: PropTypes.string,
    pattern: PropTypes.string.isRequired,
    emptyChar: PropTypes.string
  }

  static defaultProps = {
    emptyChar: ' ',
    onValidate: () => {},
    onValuePreUpdate: v => v
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    if (this.props.pattern !== nextProps.pattern ||
      this.props.value !== nextProps.value ||
      this.props.defaultValue !== nextProps.defaultValue ||
      this.props.emptyChar !== nextProps.emptyChar) {
      this.setValue(nextProps.value || nextProps.defaultValue, nextProps);
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
    const input = this.getInput();
    if (input === document.activeElement) {
      input.setSelectionRange(lastIndex, lastIndex);
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
    const { value } = this.state;
    const inputProps = {
      ...props,
      value,
      onChange: this.handleChange
    };

    if (typeof children === 'function') {
      return children(inputProps, { value });
    } else {
      const input = Children.only(children);
      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

  handleChange = e => {
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
