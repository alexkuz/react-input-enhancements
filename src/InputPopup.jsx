// @flow
import React, { PureComponent, PropTypes } from 'react';
import renderChild from './utils/renderChild';

import type { StylingFunction } from './types';
import type { Element } from 'react';

type DefaultProps = {
  onRenderCaret: (
    styling: StylingFunction, isActive: boolean, isHovered: boolean, children: any
  ) => any,
  onRenderPopup: (
    styling: StylingFunction, isActive: boolean, popupShown: boolean
  ) => any,
  inputPopupProps: Object
};

type Props = DefaultProps & {
  isActive: boolean,
  popupShown: boolean
};

type State = {
  isActive: boolean,
  popupShown: boolean,
  hover: boolean
};

const renderCaretSVG = (
  styling: StylingFunction, isActive: boolean, hovered: boolean, popupShown: boolean
): Element<*> => {
  const svgStyling = styling('inputEnhancementsCaretSvg', isActive, hovered, popupShown);
  return popupShown ? (
    <svg {...svgStyling} width='10' height='5' fill='currentColor'>
      <path d='M0 5 H10 L5 0 z'/>
    </svg>
  ) : (
    <svg {...svgStyling} width='10' height='5' fill='currentColor'>
      <path d='M0 0 H10 L5 5 z'/>
    </svg>
  );
};


export default class InputPopup extends PureComponent<DefaultProps, Props, State> {
  state: State;
  blurTimeout: ?number;

  constructor(props: Props) {
    super(props);

    this.state = {
      isActive: props.isActive,
      popupShown: props.popupShown,
      hover: false
    };
  }

  static propTypes = {
    onRenderCaret: PropTypes.func,
    onRenderPopup: PropTypes.func,
    onIsActiveChange: PropTypes.func,
    onPopupShownChange: PropTypes.func,
    registerInput: PropTypes.func
  };

  static defaultProps: DefaultProps = {
    onRenderCaret: (styling, isActive, isHovered, children) =>
      <div {...styling('inputEnhancementsCaret', isActive, isHovered)}>{children}</div>,

    onRenderPopup: () => {},

    inputPopupProps: {}
  }

  componentWillUnmount() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.popupShown !== this.props.popupShown) {
      this.setState({ popupShown: nextProps.popupShown })
    }

    if (nextProps.isActive !== this.props.isActive) {
      this.setState({ isActive: nextProps.isActive })
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.isActive !== this.state.isActive && this.props.onIsActiveChange) {
      this.props.onIsActiveChange(this.state.isActive);
    }

    if (prevState.popupShown !== this.state.popupShown && this.props.onPopupShownChange) {
      this.props.onPopupShownChange(this.state.popupShown);
    }
  }

  render() {
    const { onRenderCaret, onRenderPopup, inputPopupProps, styling, ...restProps } = this.props;
    const { isActive, hover, popupShown } = this.state;

    const caret = renderCaretSVG(styling, isActive, hover, popupShown);

    return (
      <div {...styling('inputEnhancementsPopupWrapper')}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           {...inputPopupProps}>
        {this.renderInput(styling, restProps)}
        {onRenderCaret(styling, isActive, hover, caret)}
        {onRenderPopup(styling, isActive, popupShown)}
      </div>
    );
  }

  renderInput(styling: StylingFunction, restProps: Props) {
    const { children, onInputFocus, onInputBlur, customProps,
            onChange, onInput, value, registerInput, placeholder,
            onMouseDown, onMouseUp } = restProps;
    const { isActive, hover, popupShown } = this.state;

    const inputProps = {
      ...styling('inputEnhancementsInput', isActive, hover, popupShown),
      value,
      placeholder,
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      onChange,
      onInput,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onKeyDown: this.handleKeyDown,
      onMouseDown,
      onMouseUp
    };

    return renderChild(children, inputProps, customProps, registerInput);
  }

  handleMouseEnter = (e: SyntheticMouseEvent) => {
    this.setState({ hover: true });

    if (this.props.onInputMouseEnter) {
      this.props.onInputMouseEnter(e);
    }
  }

  handleMouseLeave = (e: SyntheticMouseEvent) => {
    this.setState({ hover: false });

    if (this.props.onInputMouseLeave) {
      this.props.onInputMouseLeave(e);
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
    const keyMap = {
      Escape: this.handleEscapeKeyDown,
      Enter: this.handleEnterKeyDown
    }

    if (keyMap[e.key]) {
      keyMap[e.key](e);
    } else {
      this.setState({
        popupShown: true
      });
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleEscapeKeyDown = () => {
    this.setState({
      popupShown: false
    });
  }

  handleEnterKeyDown = () => {
    this.setState({
      popupShown: false
    });
  }

  handleFocus = (e: SyntheticUIEvent) => {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
      return;
    }

    this.setState({
      isActive: true,
      popupShown: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleBlur = (e: SyntheticUIEvent) => {
    this.blurTimeout = setTimeout(() => {
      this.setState({
        isActive: false,
        popupShown: false
      });
      this.blurTimeout = null;
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }
}
