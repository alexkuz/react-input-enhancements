import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';

const jss = create();
jss.use(jssNested());
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
    left: 0
  },
  option: {

  },
  optionHighlighted: {

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
    onRenderOption: PropTypes.func
  }

  static defaultProps = {
    onRenderOption: (opt, isHighlighted) =>
      <div className={classNames(
        sheet.classes.option,
        isHighlighted && sheet.classes.optionHighlighted
      )}>{typeof opt === 'string' ? opt : (opt.label || opt.text || opt.value)}</div>,
    getCaretProps: (className, style, isActive, children) => ({ className, style, children }),
    getListProps: (className, style) => ({ className, style })
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  isHighlighted(opt, value) {
    return opt.value === value;
  }

  render() {
    const { className, getCaretProps, getListProps, inputClassName,
            style,
            onRenderOption, options, children, value } = this.props;
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

    return (
      <div className={classNames(classes.dropdown, className)} style={style}>
        {input}
        <div {...getCaretProps(classes.caret, { color: '' }, this.state.isActive, caret)} />
        {this.state.isActive &&
          <div {...getListProps(classes.list, null, this.state.isActive)}>
            {[for(opt of options)
              React.cloneElement(
                onRenderOption(opt, this.isHighlighted(opt, value)),
                { key: opt.value }
              )
            ]}
          </div>
        }
      </div>
    );
  }
}
