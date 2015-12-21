import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import classNames from 'classnames';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import * as filters from './filters';
import InputPopup from './InputPopup';

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
  const match = findMatchingTextIndex(props.value || props.defaultValue, props.options);
  const [selectedIndex, matchingText] = match;
  const shownOptions = getShownOptions(matchingText, props.options, props.optionFilters);
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
    const { options, optionFilters } = nextProps;

    if ((nextProps.defaultValue || nextProps.value) && nextState.value === null ||
        this.props.value !== nextProps.value) {
      const state = getStateFromProps(nextProps);

      if (state.value !== this.state.value) {
        this.setState(state);
      }
    } else if (this.props.options !== options ||
      this.props.optionFilters !== optionFilters) {
      const [highlightedIndex, shownOptions] = this.updateHighlightedIndex(
        nextState.value, options, optionFilters
      );
      const selectedIndex = findOptionIndex(options, shownOptions[highlightedIndex]);

      this.setState({ selectedIndex });
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
    const { onRenderCaret, onRenderList, dropdownProps,
            style, children, onValueChange, ...props } = this.props;
    const selectedOption = this.props.options[this.state.selectedIndex];

    const value = this.state.value === null ? '' : this.state.value;

    return (
      <InputPopup {...props}
                  value={this.state.isActive ?
                          value :
                          getOptionText(selectedOption)}
                  proxyProps={{ textValue: value }}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputPopupProps={dropdownProps}
                  onRenderPopup={this.renderPopup}
                  onIsActiveChange={this.handleIsActiveChange}
                  onPopupShownChange={this.handlePopupShownChange}
                  popupShown={this.state.listShown}>
        {children}
      </InputPopup>
    );
  }

  renderPopup = (popupClassName, popupStyle, isActive, popupShown) => {
    const { onRenderList, onRenderListHeader, options } = this.props;
    const { shownOptions } = this.state;

    return onRenderList(
      popupClassName,
      popupStyle,
      isActive,
      popupShown,
      shownOptions.map(this.renderOption),
      onRenderListHeader(
        options.length,
        shownOptions.length,
        shownOptions.filter(isStatic).length
      )
    );
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

    this.setState({ value });
    this.updateHighlightedIndex(value, options, optionFilters);

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = e => {
    const keyMap = {
      ArrowUp: this.handleArrowUpKeyDown,
      ArrowDown: this.handleArrowDownKeyDown,
      Enter: this.handleEnterKeyDown
    }

    if (keyMap[e.key]) {
      keyMap[e.key](e);
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  }

  handleArrowUpKeyDown = e => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, false)
    });
  }

  handleArrowDownKeyDown = e => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, true)
    });
  }

  handleEnterKeyDown = () => {
    const { highlightedIndex, shownOptions } = this.state;
    const option = shownOptions[highlightedIndex];

    setTimeout(() => {
      this.selectOption(findOptionIndex(this.props.options, option), true);
    });
  }

  selectOption(index, fireOnChange) {
    const { options, optionFilters } = this.props;
    const option = options[index];
    const shownOptions = getShownOptions(getOptionText(option), options, optionFilters);

    this.setState({
      value: getOptionText(option),
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

  handleIsActiveChange = isActive => {
    this.setState({ isActive });
  }

  handlePopupShownChange = popupShown => {
    this.setState({ listShown: popupShown });
  }
}

const sheet = jss.createStyleSheet({
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
