// @flow
import { PureComponent } from 'react';
import applyMaskToString from './utils/applyMaskToString';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';
import locateCursorPosition from './utils/locateCursorPosition';

import type { MaskResult } from './utils/applyMaskToString';

type DefaultProps = {
  emptyChar: string,
  onValidate: (value: string, processedValue: MaskResult) => any,
  onValuePreUpdate: (value: string) => string
};

type Props = DefaultProps & {
  getInputElement: () => HTMLInputElement,
  value?: string,
  pattern: string,
  placeholder?: string,
  children?: any,
  onUnmaskedValueChange?: (unmaskedValue: string) => void,
  onChange?: (e: SyntheticInputEvent) => void,
  onKeyDown?: (e: SyntheticKeyboardEvent) => void,
  onMouseUp?: (e: SyntheticMouseEvent) => void,
};

type State = {
  value: string,
  preUpdateValue: string,
  isValid: boolean,
  unmaskedValue: string,
  lastIndex: number
};

function getStateFromProps(
  props: Props, value: string, lastIndex: number
): State {
  let stateValue = props.onValuePreUpdate(value);
  const preUpdateValue = stateValue;
  let processedValue = applyMaskToString(stateValue, props.pattern, props.emptyChar);
  const validatedValue = props.onValidate(stateValue, processedValue);

  if (validatedValue && validatedValue.result) {
    processedValue = validatedValue;
  } else if (validatedValue) {
    processedValue = {
      result: processedValue.result,
      unmaskedValue: processedValue.unmaskedValue,
      isValid: false
    };
  }

  if (processedValue.isValid) {
    stateValue = processedValue.result;
    lastIndex = processedValue.lastIndex;
  }

  if (!processedValue.unmaskedValue && props.placeholder) {
    stateValue= '';
  }

  return {
    value: stateValue,
    preUpdateValue,
    isValid: processedValue.isValid,
    unmaskedValue: processedValue.unmaskedValue,
    lastIndex
  };
}

export default class Mask extends PureComponent<DefaultProps, Props, State> {
  state: State;
  cursorPosition: number;

  constructor(props: Props) {
    super(props);

    const value = props.value || '';
    this.state = getStateFromProps(props, value, 0);
  }

  static defaultProps = {
    emptyChar: ' ',
    onValidate: () => {},
    onValuePreUpdate: v => v
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.pattern !== nextProps.pattern ||
      this.props.value !== nextProps.value ||
      this.props.emptyChar !== nextProps.emptyChar) {
      const nextState = getStateFromProps(
        nextProps, nextProps.value || '', this.state.lastIndex
      );

      if (nextState.value !== this.state.value ||
        nextState.lastIndex !== this.state.lastIndex) {
        this.setState(nextState);
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.value !== this.state.value) {
      this.setSelectionRange(this.cursorPosition);
    }
  }

  setSelectionRange(position: number) {
    const input = getInput(this);
    if (input === document.activeElement) {
      input.setSelectionRange(position, position);
    }
  }

  registerInput = (input: HTMLInputElement) => registerInput(this, input);

  render() {
    const { children, placeholder } = this.props;
    const { value } = this.state;
    const inputProps = {
      value,
      placeholder,
      onInput: this.handleInput,
      onKeyDown: this.handleKeyDown,
      onMouseUp: this.handleMouseUp
    };

    return renderChild(children, inputProps, { value }, this.registerInput);
  }

  // works better for IE than onChange
  handleInput = (e: SyntheticInputEvent) => {
    const value = e.target.value;

    const nextState = getStateFromProps(
      this.props, value, this.state.lastIndex
    );
    if (!nextState.isValid) {
      e.preventDefault();
      setTimeout(() =>
        this.setSelectionRange(this.cursorPosition)
      );
      return;
    }

    const cursorPosition = Math.min(
      nextState.lastIndex,
      locateCursorPosition(
        e.target.selectionStart, nextState.preUpdateValue, this.props.pattern, this.props.emptyChar
      )
    );

    if(this.cursorPosition !== cursorPosition) {
      this.cursorPosition = cursorPosition;
      setTimeout(() => this.setSelectionRange(this.cursorPosition));
    }

    if (e.target.value !== nextState.value) {
      e.target.value = nextState.value;
    }

    if (this.props.onUnmaskedValueChange) {
      this.props.onUnmaskedValueChange(nextState.unmaskedValue);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    const input = getInput(this);

    if (e.key === 'ArrowRight' && input.selectionStart >= this.state.lastIndex) {
      this.setSelectionRange(this.state.lastIndex);
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowRight' && e.metaKey && input.selectionStart < this.state.lastIndex) {
      this.setSelectionRange(this.state.lastIndex);
      e.preventDefault();
      return;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleMouseUp = (e: SyntheticMouseEvent) => {
    const input = getInput(this);

    if (input.selectionStart >= this.state.lastIndex) {
      this.setSelectionRange(this.state.lastIndex);
    }

    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  }
}
