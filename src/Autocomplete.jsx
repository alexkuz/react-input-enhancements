// @flow
import { PureComponent } from 'react';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';
import toString from './utils/toString';
import getOptionText from './utils/getOptionText';

import type { Option } from './types';

type Props = {
  value: any,
  options: Option[],
  children?: any,
  onChange?: (e: SyntheticInputEvent) => void,
  onKeyDown?: (e: SyntheticKeyboardEvent) => void,
  registerInput?: (input: HTMLInputElement) => void,
  getInputComponent: () => HTMLInputElement
};

type State = {
  matchingText: string,
  value: string
};

function updateInputSelection(input: HTMLInputElement, start: number, end: number) {
  input.setSelectionRange(start, end);
}

function updateInputNode(input: HTMLInputElement, value: string) {
  input.value = value;
}

function setSelection(input: HTMLInputElement, text: string | null, matchingText: string) {
  if (text === null) {
    updateInputNode(input, '');
  } else {
    updateInputNode(input, matchingText);

    if (text.length !== matchingText.length) {
      updateInputSelection(input, text.length, matchingText.length);
    }
  }
}

function getStateFromProps({ value, options }: Props): State {
  const match = findMatchingTextIndex(value, options);

  if (!match.noResult) {
    const { text: matchingText } = match;
    const strValue = typeof value === 'string' ?
      value : getOptionText(options[match.index]);
    return { value: strValue, matchingText };
  } else {
    return { value: toString(value), matchingText: '' };
  }
}

export default class Autocomplete extends PureComponent<void, Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    const optionsChanged = this.props.options !== nextProps.options;
    if (this.props.value !== nextProps.value || optionsChanged) {
      const nextState = getStateFromProps(nextProps);
      if (nextState.value !== this.state.value || optionsChanged) {
        this.setState(nextState);
      }
    }
  }

  componentDidUpdate() {
    const { value, matchingText } = this.state;

    if (matchingText && value.length !== matchingText.length) {
      const input = getInput(this);
      setSelection(input, this.state.value, this.state.matchingText);
    }
  }

  registerInput = (input: HTMLInputElement) => registerInput(this, input);

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

  handleChange = (e: SyntheticInputEvent) => {
    let value = e.target.value;

    const nextState = getStateFromProps({ ...this.props, value });

    if (nextState.value !== this.state.value) {
      this.setState(nextState);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
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
      const updatedValue = value.substr(0, value.length - 1);

      const nextState = getStateFromProps({ ...this.props, value: updatedValue });
      this.setState(nextState);

      updateInputNode(input, value);
    }
  }

  handleEnterKeyDown = () => {
    const { matchingText } = this.state;
    const input = getInput(this);

    setSelection(input, matchingText, matchingText);
    input.blur();
  }
}
