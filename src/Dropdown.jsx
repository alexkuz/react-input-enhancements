import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import findMatchingTextIndex from './findMatchingTextIndex';
import filterByMatchingText from './filterByMatchingText';
import sortByMatchingText from './sortByMatchingText';
import limitBy from './limitBy';

const jss = create();
jss.use(jssNested());
jss.use(jssVendorPrefixer());

function getOptionText(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    typeof opt.label === 'string' ?
      opt.label :
      opt.text || opt.value;
}

function getOptionValue(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    opt.value;
}

function getOptionLabel(opt) {
  return typeof opt === 'string' || !opt ?
    opt :
    (opt.label || opt.text || opt.value);
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
    `option-${getOptionText(opt)}`;
}

function getSiblingIndex(idx, options, next) {
  if (next) {
    if (idx === null) {
      return 0;
    }
    while(++idx < options.length) {
      if (options[idx] !== null && !options[idx].disabled) {
        return idx;
      }
    }
    return 0;
  } else {
    if (idx === null) {
      return options.length - 1;
    }
    while(--idx >= 0) {
      if (options[idx] !== null && !options[idx].disabled) {
        return idx;
      }
    }
    return options.length - 1;
  }
}

function getShownOptions(value, options, optionFilters) {
  return optionFilters.reduce((o, filter) => filter(o, value), options);
}

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.optionRefs = {};

    const shownOptions = getShownOptions(null, props.options, props.optionFilters);
    const match = findMatchingTextIndex(props.value || props.defaultValue, shownOptions);
    const [selectedIndex] = match;

    this.state = {
      value: null,
      isActive: false,
      listShown: false,
      selectedIndex,
      shownOptions
    };
  }

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING),
    onRenderOption: PropTypes.func,
    onRenderCaret: PropTypes.func,
    onRenderList: PropTypes.func,
    optionFilters: PropTypes.arrayOf(PropTypes.func)
  }

  static defaultProps = {
    onRenderOption: (className, style, opt) =>
      opt !== null ?
        <div {...{ className, style }}>
          {getOptionLabel(opt)}
        </div> :
        <div className={sheet.classes.separator} />,

    onRenderCaret: (className, style, isActive, children) =>
      <div {...{ className, style }}>{children}</div>,

    onRenderList: (className, style, isActive, listShown, children) =>
      listShown && <div {...{ className, style }}>{children}</div>,

    dropdownProps: {},

    optionFilters: [filterByMatchingText, sortByMatchingText, limitBy(100)]
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    const { options, optionFilters } = nextProps;

    if (this.props.options !== options || this.props.optionFilters !== optionFilters) {
      this.updateSelectedIndex(this.state.value, options, optionFilters)
    }
  }

  updateSelectedIndex(value, options, optionFilters) {
    const shownOptions = getShownOptions(value, options, optionFilters);
    const match = findMatchingTextIndex(value, shownOptions);
    const [selectedIndex] = match;

    this.setState({ selectedIndex, shownOptions });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedIndex !== prevState.selectedIndex &&
      this.state.selectedIndex !== null) {
      const optionEl = this.optionRefs['option-' + this.state.selectedIndex];
      if (optionEl) {
        const optionHeight = optionEl.offsetHeight;
        const listEl = optionEl.parentNode;
        const listHeight = listEl.clientHeight;
        listEl.scrollTop = optionEl.offsetTop - (listHeight - optionHeight) / 2;
      }
    }
  }

  render() {
    const { dropdownClassName, onRenderCaret, onRenderList,
            dropdownStyle, dropdownProps } = this.props;
    const { classes } = sheet;

    const caret = (
      <svg width='10' height='5' fill='currentColor'>
        <path d='M0 0 H10 L5 5 z'/>
      </svg>
    );
    const caretClassName = classNames(classes.caret, this.state.isActive && classes.caretActive);
    const listClassName = classNames(classes.list, this.state.isActive && classes.listActive);

    return (
      <div className={classNames(classes.dropdown, dropdownClassName)}
           style={dropdownStyle}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           ref='dropdown'
           {...dropdownProps}>
        {this.renderInput()}
        {onRenderCaret(caretClassName, null, this.state.isActive, caret)}
        {onRenderList(
          listClassName,
          null,
          this.state.isActive,
          this.state.listShown,
          this.state.shownOptions.map(this.renderOption)
        )}
      </div>
    );
  }

  renderInput() {
    const { dropdownClassName, onRenderCaret, onRenderList, className,
            style, children, onValueChange, ...props } = this.props;
    const { classes } = sheet;
    const selectedOption = this.state.shownOptions[this.state.selectedIndex];

    const inputProps = {
      ...props,
      value: (this.state.isActive ?
        this.state.value :
        getOptionText(selectedOption)),
      defaultValue: null,
      className: classNames(classes.input, className),
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange
    };

    if (typeof children === 'function') {
      return children(inputProps, {
        textValue: this.state.textValue
      });
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

  renderOption = (opt, idx) => {
    const { onRenderOption } = this.props;
    const highlighted = idx === this.state.selectedIndex;

    return (
      React.cloneElement(
        onRenderOption(
          getOptionClassName(opt, highlighted),
          null,
          opt,
          highlighted
        ),
        {
          key: getOptionKey(opt, idx),
          ref: o => this.optionRefs['option-' + idx] = o,
          onMouseDown: this.handleOptionClick.bind(this, idx)
        }
      )
    );
  }

  handleOptionClick(idx) {
    this.selectOption(idx);
    this.setState({
      selectedIndex: idx,
      listShown: false
    });
  }

  handleChange = e => {
    const { options, optionFilters } = this.props;
    const value = e.target.value;

    if (this.props.value === undefined) {
      this.setState({ value });
      this.updateSelectedIndex(value, options, optionFilters);
    }
    this.setState({ textValue: value });

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = e => {
    const keyMap = {
      ArrowUp: this.handleArrowUpKeyDown,
      ArrowDown: this.handleArrowDownKeyDown,
      Escape: this.handleEscapeKeyDown,
      Enter: this.handleEnterKeyDown
    }

    if (keyMap[e.key]) {
      keyMap[e.key](e);
    } else {
      this.setState({
        listShown: true
      });
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleArrowUpKeyDown = e => {
    const { selectedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      selectedIndex: getSiblingIndex(selectedIndex, shownOptions, false),
      listShown: true
    });
  }

  handleArrowDownKeyDown = e => {
    const { selectedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      selectedIndex: getSiblingIndex(selectedIndex, shownOptions, true),
      listShown: true
    });
  }

  handleEscapeKeyDown = () => {
    this.setState({
      listShown: false
    });
  }

  handleEnterKeyDown = () => {
    this.selectOption(this.state.selectedIndex);
    this.setState({
      isActive: false,
      listShown: false
    });
  }

  selectOption(selectedIndex) {
    const { shownOptions } = this.state;
    this.setState({
      textValue: getOptionText(shownOptions[selectedIndex])
    });
    if (this.props.onValueChange) {
      this.props.onValueChange(
        getOptionValue(shownOptions[selectedIndex]),
        getOptionText(shownOptions[selectedIndex])
      );
    }
  }

  handleFocus = () => {
    this.setState({
      isActive: true,
      listShown: true
    });
  }

  handleBlur = () => {
    this.selectOption(this.state.selectedIndex);
    this.setState({
      isActive: false,
      listShown: false,
      value: getOptionValue(this.state.shownOptions[this.state.selectedIndex])
    });
  }
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
  caretActive: {
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
