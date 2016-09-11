import React, { PureComponent, PropTypes, Children } from 'react';

export default class InputPopup extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isActive: props.isActive,
      popupShown: props.popupShown,
      hover: false,
    };
  }

  static propTypes = {
    onRenderCaret: PropTypes.func,
    onRenderPopup: PropTypes.func,
    onIsActiveChange: PropTypes.func,
    onPopupShownChange: PropTypes.func
  };

  static defaultProps = {
    onRenderCaret: (styling, isActive, isHovered, children) =>
      <div {...styling('inputEnhancementsCaret', isActive, isHovered)}>{children}</div>,

    onRenderPopup: () => {},

    inputPopupProps: {}
  }

  renderCaretSVG(styling, isActive, hovered, popupShown) {
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
  }

  componentWillUnmount() {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.popupShown !== this.props.popupShown) {
      this.setState({ popupShown: nextProps.popupShown })
    }

    if (nextProps.isActive !== this.props.isActive) {
      this.setState({ isActive: nextProps.isActive })
    }
  }

  componentDidUpdate(prevProps, prevState) {
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

    const caret = this.renderCaretSVG(styling, isActive, hover, popupShown);

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

  renderInput(styling, restProps) {
    const { children, onInputFocus, onInputBlur, customProps, onChange, value } = restProps;
    const { isActive, hover, popupShown } = this.state;

    const inputProps = {
      ...styling('inputEnhancementsInput', isActive, hover, popupShown),
      value,
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      onChange,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onKeyDown: this.handleKeyDown
    };

    if (typeof children === 'function') {
      return children(inputProps, customProps);
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

  handleMouseEnter = e => {
    this.setState({ hover: true });

    if (this.props.onInputMouseEnter) {
      this.props.onInputMouseEnter(e);
    }
  }

  handleMouseLeave = e => {
    this.setState({ hover: false });

    if (this.props.onInputMouseLeave) {
      this.props.onInputMouseLeave(e);
    }
  }

  handleKeyDown = e => {
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

  handleFocus = e => {
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

  handleBlur = e => {
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
