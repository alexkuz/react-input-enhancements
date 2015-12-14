import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import * as filters from './filters';

const jss = create();
jss.use(jssNested());
jss.use(jssVendorPrefixer());

function isStatic(opt) {
  return opt === null || opt.static === true;
}

function getOptionText(opt) {
  return (typeof opt === 'string' || !opt ?
    opt :
    opt.text || opt.value) || '';
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

function getOptionClassName(opt, isHighlighted, isDisabled) {
  return classNames(
    sheet.classes.option,
    isHighlighted && sheet.classes.optionHighlighted,
    isDisabled && sheet.classes.optionDisabled
  );
}

function getOptionKey(opt, idx) {
  const value = getOptionValue(opt);

  return opt === null ?
    `option-separator-${idx}` :
    `option-${typeof value === 'string' ? value : (getOptionText(opt) + idx)}`;
}

function getSiblingIndex(idx, options, next) {
  if (idx === null) {
    idx = next ? -1 : options.length;
  }

  const step = next ? 1 : -1;

  for (let i = 0; i < options.length; i++) {
    const currentIdx = (idx + (i + 1) * step + options.length) % options.length;
    if (options[currentIdx] !== null && !options[currentIdx].disabled) {
      return currentIdx;
    }
  }

  return idx;
}

function getShownOptions(value, options, optionFilters) {
  return optionFilters.reduce((o, filter) => filter(o, value), options);
}

function findOptionIndex(options, option) {
  return options.findIndex(opt => opt === option);
}

function getStateFromProps(props) {
  const shownOptions = getShownOptions(null, props.options, props.optionFilters);
  const match = findMatchingTextIndex(props.value || props.defaultValue, props.options);
  const [selectedIndex, matchingText] = match;
  const highlightedIndex = findOptionIndex(shownOptions, props.options[selectedIndex]);

  return {
    value: matchingText || null,
    isActive: false,
    listShown: false,
    selectedIndex,
    highlightedIndex,
    shownOptions
  };
}

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.optionRefs = {};

    this.state = getStateFromProps(props);
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

    onRenderList: (className, style, isActive, listShown, children, header) =>
      listShown && (
        <div {...{ className, style }}>
          {header && <div className={sheet.classes.listHeader}>{header}</div>}
          <div className={sheet.classes.listOptions}>{children}</div>
        </div>
      ),

    onRenderListHeader: (allCount, shownCount, staticCount) => {
      if (allCount - staticCount < 20) return null;
      const allItems = `${allCount - staticCount} ${
        (allCount - staticCount) === 1 ? 'item' : 'items'
      }`;
      return allCount === shownCount ?
        `${allItems} found` :
        `${shownCount - staticCount} of ${allItems} shown`;
    },

    dropdownProps: {},

    optionFilters: [
      filters.filterByMatchingTextWithThreshold(20),
      filters.sortByMatchingText,
      filters.limitBy(100),
      filters.notFoundMessage('No matches found'),
      filters.filterRedudantSeparators
    ]
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUpdate(nextProps, nextState) {
    const { options, optionFilters, defaultValue, value } = nextProps;

    if ((this.props.defaultValue !== defaultValue ||
    this.props.value !== value) && nextState.value === null) {
      this.setState(getStateFromProps(nextProps));
    } else if (this.props.options !== options ||
      this.props.optionFilters !== optionFilters) {
      const [highlightedIndex, shownOptions] = this.updateHighlightedIndex(
        nextState.value, options, optionFilters
      );
      const selectedIndex = findOptionIndex(options, shownOptions[highlightedIndex]);

      this.setState({ selectedIndex, value });
    }
  }

  updateHighlightedIndex(value, options, optionFilters) {
    const shownOptions = getShownOptions(value, options, optionFilters);
    const match = findMatchingTextIndex(value, shownOptions, true);
    const [highlightedIndex] = match;

    this.setState({ highlightedIndex, shownOptions });

    return [highlightedIndex, shownOptions];
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.highlightedIndex !== prevState.highlightedIndex &&
      this.state.highlightedIndex !== null) {
      const optionEl = this.optionRefs['option-' + this.state.highlightedIndex];
      if (optionEl) {
        const optionHeight = optionEl.offsetHeight;
        const listEl = optionEl.parentNode;
        const listHeight = listEl.clientHeight;
        listEl.scrollTop = optionEl.offsetTop - (listHeight - optionHeight) / 2;
      }
    }
  }

  render() {
    const { dropdownClassName, onRenderCaret, onRenderList, onRenderListHeader,
            dropdownStyle, dropdownProps, options } = this.props;
    const { classes } = sheet;
    const { shownOptions, isActive, hover, listShown } = this.state;

    const caret = (
      <svg width='10' height='5' fill='currentColor'>
        <path d='M0 0 H10 L5 5 z'/>
      </svg>
    );
    const caretClassName = classNames(classes.caret, hover && classes.caretActive);
    const listClassName = classNames(classes.list, isActive && classes.listActive);

    return (
      <div className={classNames(classes.dropdown, dropdownClassName)}
           style={dropdownStyle}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           onMouseEnter={() => this.setState({ hover: true })}
           onMouseLeave={() => this.setState({ hover: false })}
           ref='dropdown'
           {...dropdownProps}>
        {this.renderInput()}
        {onRenderCaret(caretClassName, null, isActive, caret)}
        {onRenderList(
          listClassName,
          null,
          isActive,
          listShown,
          shownOptions.map(this.renderOption),
          onRenderListHeader(
            options.length,
            shownOptions.length,
            shownOptions.filter(isStatic).length
          )
        )}
      </div>
    );
  }

  renderInput() {
    const { dropdownClassName, onRenderCaret, onRenderList, className,
            style, children, onValueChange, ...props } = this.props;
    const { classes } = sheet;
    const selectedOption = this.state.shownOptions[this.state.highlightedIndex];

    const inputProps = {
      ...props,
      value: (this.state.isActive ?
        this.state.value :
        getOptionText(selectedOption)),
      defaultValue: null,
      className: classNames(classes.input, className),
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      style: {
        paddingRight: '15px'
      }
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
    const highlighted = idx === this.state.highlightedIndex;
    const disabled = opt && opt.disabled;

    return (
      React.cloneElement(
        onRenderOption(
          getOptionClassName(opt, highlighted, disabled),
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
    const option = this.state.shownOptions[idx];
    this.setState({
      listShown: false
    }, () => {
      this.selectOption(findOptionIndex(this.props.options, option), true);
    });
  }

  handleChange = e => {
    const { options, optionFilters } = this.props;
    const value = e.target.value;

    if (this.props.value === undefined) {
      this.setState({ value });
      this.updateHighlightedIndex(value, options, optionFilters);
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
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, false),
      listShown: true
    });
  }

  handleArrowDownKeyDown = e => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, true),
      listShown: true
    });
  }

  handleEscapeKeyDown = () => {
    this.setState({
      listShown: false
    });
  }

  handleEnterKeyDown = () => {
    const { highlightedIndex, shownOptions } = this.state;
    const option = shownOptions[highlightedIndex];

    this.setState({
      listShown: false
    }, () => {
      this.selectOption(findOptionIndex(this.props.options, option), true);
    });
  }

  selectOption(index, fireOnChange) {
    const { options, optionFilters } = this.props;
    const option = options[index];
    const shownOptions = getShownOptions(getOptionText(option), options, optionFilters);

    this.setState({
      value: getOptionText(option),
      textValue: getOptionText(option),
      highlightedIndex: findOptionIndex(shownOptions, option),
      selectedIndex: index,
      shownOptions
    });
    if (fireOnChange && this.props.onValueChange) {
      this.props.onValueChange(
        getOptionValue(option),
        getOptionText(option)
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
    const { selectedIndex } = this.state;

    this.setState({
      isActive: false,
      listShown: false
    }, () => {
      this.selectOption(selectedIndex, false);
    });
  }
}

const sheet = jss.createStyleSheet({
  dropdown: {
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
  list: {
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
  },
  listHeader: {
    'flex-shrink': 0,
    height: '3rem',
    'font-size': '0.8em',
    color: '#999999',
    'background-color': '#FAFAFA',
    padding: '0.5rem 1rem',
    'border-bottom': '1px solid #DDDDDD'
  },
  listOptions: {
    'flex-grow': 1,
    'overflow-y': 'auto'
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
  optionDisabled: {
    color: '#999999',
    '&:hover': {
      'background-color': 'inherit'
    }
  },
  separator: {
    margin: '0.5rem 0',
    width: '100%',
    height: '1px',
    'border-top': '1px solid #DDDDDD'
  }
}).attach();
