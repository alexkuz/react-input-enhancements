import React, { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';

const jss = create();
jss.use(jssNested());
jss.use(jssVendorPrefixer());

export default class InputPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      hover: false,
      popupShown: false
    };
  }

  static propTypes = {
    onRenderCaret: PropTypes.func,
    onRenderPopup: PropTypes.func,
    onIsActiveChange: PropTypes.func,
    onPopupShownChange: PropTypes.func
  }

  static defaultProps = {
    onRenderCaret: (className, style, isActive, children) =>
      <div {...{ className, style }}>{children}</div>,

    onRenderPopup: () => {},

    inputPopupProps: {}
  }

  renderCaretSVG(popupShown) {
    return popupShown ? (
      <svg width='10' height='5' fill='currentColor'>
        <path d='M0 5 H10 L5 0 z'/>
      </svg>
    ) : (
      <svg width='10' height='5' fill='currentColor'>
        <path d='M0 0 H10 L5 5 z'/>
      </svg>
    );
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUpdate(nextProps) {
    if (nextProps.popupShown !== this.props.popupShown) {
      this.setState({ popupShown: nextProps.popupShown })
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
    const { className, onRenderCaret, onRenderPopup, inputPopupProps } = this.props;
    const { classes } = sheet;
    const { isActive, hover, popupShown } = this.state;

    const caret = this.renderCaretSVG(popupShown);
    const caretClassName = classNames(classes.caret, (hover || isActive) && classes.caretActive);
    const popupClassName = classNames(classes.popup, isActive && classes.popupActive);

    return (
      <div className={classNames(classes.inputPopup, className)}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           onMouseEnter={() => this.setState({ hover: true })}
           onMouseLeave={() => this.setState({ hover: false })}
           {...inputPopupProps}>
        {this.renderInput()}
        {onRenderCaret(caretClassName, null, isActive, caret)}
        {onRenderPopup(
          popupClassName,
          null,
          isActive,
          popupShown
        )}
      </div>
    );
  }

  renderInput() {
    const { className, onRenderCaret, onRenderPopup, inputPopupProps,
            popup, inputClassName, inputStyle, children,
            onInputFocus, onInputBlur, proxyProps, ...props } = this.props;
    const { classes } = sheet;

    const inputProps = {
      ...props,
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      className: classNames(classes.input, inputClassName),
      onKeyDown: this.handleKeyDown,
      style: {
        ...inputStyle,
        paddingRight: '15px'
      }
    };

    if (typeof children === 'function') {
      return children(inputProps, proxyProps);
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, { ...inputProps, ...input.props });
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

const sheet = jss.createStyleSheet({
  inputPopup: {
    position: 'relative',
    display: 'inline-block'
  },
  caret: {
    position: 'absolute',
    right: '5px',
    top: 0,
    'padding-top': '5px',
    'vertical-align': 'middle',
    'padding-left': '3px',
    width: '10px',
    '& svg': {
      display: 'inline-block',
      opacity: 0,
      transition: 'opacity 0.15s linear, transform 0.15s linear',
      transform: 'translateY(5px)'
    }
  },
  caretActive: {
    '& svg': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  popup: {
    position: 'absolute',
    left: 0,
    top: '100%',
    'z-index': 10000,
    'max-height': '30rem',
    'min-width': '22rem',
    'background-color': '#FFFFFF',
    'box-shadow': '1px 1px 4px rgba(100, 100, 100, 0.3)',
    display: 'flex',
    'flex-direction': 'column'
  }
}).attach();
