import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import findMatchingText from './findMatchingText';

const jss = create();
jss.use(jssNested());
jss.use(jssVendorPrefixer());

function getOptionValue(opt) {
  return typeof opt === 'string' ?
    opt :
    typeof opt.label === 'string' ?
      opt.label :
      opt.text || opt.value;
}

function isHighlighted(opt, value) {
  return opt === null ? false : (getOptionValue(opt) === value);
}

function getOptionClassName(opt, isHighlighted) {
  return classNames(
    sheet.classes.option,
    isHighlighted && sheet.classes.optionHighlighted
  );
}

function getOptionKey(opt, idx) {
  return opt === null ?
    `option-separator-${idx}` :
    `option-${getOptionValue(opt)}`;
}

const sheet = jss.createStyleSheet({
  dropdown: {
    display: 'table',
    position: 'relative'
  },
  input: {
    display: 'table-cell'
  },
  caret: {
    display: 'table-cell',
    width: '10px',
    'padding-top': '5px',
    'vertical-align': 'middle',
    'padding-left': '3px'
  },
  list: {
    position: 'absolute',
    left: 0,
    top: '100%',
    'z-index': 10000,
    'max-height': '30rem',
    'min-width': '22rem',
    'overflow-y': 'auto',
    'background-color': '#FFFFFF',
    'box-shadow': '1px 1px 4px rgba(100, 100, 100, 0.3)'
  },
  option: {
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    '&:hover': {
      'background-color': '#F0F0F0'
    }
  },
  optionHighlighted: {
    'background-color': '#3333FF',
    color: '#FFFFFF',
    '&:hover': {
      'background-color': '#3333FF'
    }
  },
  separator: {
    margin: '0.5rem 0',
    width: '100%',
    height: '1px',
    'border-top': '1px solid #DDDDDD'
  }
}).attach();

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING),
    onRenderOption: PropTypes.func,
    onRenderCaret: PropTypes.func,
    onRenderList: PropTypes.func
  }

  static defaultProps = {
    onRenderOption: (className, style, opt) =>
      opt !== null ?
        <div {...{ className, style }}>
          {getOptionValue(opt)}
        </div> :
        <div className={sheet.classes.separator} />,

    onRenderCaret: (className, style, isActive, children) =>
      <div {...{ className, style }}>{children}</div>,

    onRenderList: (className, style, isActive, children) =>
      isActive && <div {...{ className, style }}>{children}</div>
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { className, onRenderCaret, onRenderList, inputClassName,
            style, options, children, value } = this.props;
    const { classes } = sheet;
    const input = typeof children === 'function' ?
      children(classNames(classes.input, inputClassName)) :
      React.cloneElement(Children.only(children), {
        className: classNames(classes.input, inputClassName)
      });
    const caret = (
      <svg width='10' height='5' fill='currentColor'>
        <path d='M0 0 H10 L5 5 z'/>
      </svg>
    );
    const matchingText = findMatchingText(value, options);

    return (
      <div className={classNames(classes.dropdown, className)}
           style={style}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}>
        {input}
        {onRenderCaret(classes.caret, { color: '' }, this.state.isActive, caret)}
        {onRenderList(classes.list, null, this.state.isActive, options.map((opt, idx) =>
          this.renderOption(opt, idx, matchingText)
        ))}
      </div>
    );
  }

  renderOption = (opt, idx, matchingText) => {
    const { onRenderOption } = this.props;
    const highlighted = isHighlighted(opt, matchingText);
    return (
      React.cloneElement(
        onRenderOption(
          getOptionClassName(opt, highlighted),
          null,
          opt,
          highlighted
        ),
        { key: getOptionKey(opt, idx) }
      )
    );
  }

  handleFocus = () => {
    this.setState({ isActive: true });
  }

  handleBlur = () => {
    this.setState({ isActive: false });
  }
}
