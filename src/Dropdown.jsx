import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as shapes from './shapes';
import findMatchingTextIndex from './utils/findMatchingTextIndex';
import * as filters from './filters';
import InputPopup from './InputPopup';
import getOptionText from './utils/getOptionText';
import getOptionLabel from './utils/getOptionLabel';
import getOptionValue from './utils/getOptionValue';
import isStatic from './utils/isStatic';
import DropdownOption from './DropdownOption';
import createStyling from './createStyling';
import deprecated from './utils/deprecated';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';

function getOptionKey(opt, idx) {
  const value = getOptionValue(opt);

  return opt === null
    ? `option-separator-${idx}`
    : `option-${typeof value === 'string' ? value : getOptionText(opt) + idx}`;
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
  return Array.findIndex(options, opt => opt === option);
}

function getStateFromProps(props) {
  const value = props.value;
  const match = findMatchingTextIndex(value, props.options);
  const [selectedIndex, matchingText] = match;
  const shownOptions = getShownOptions(
    matchingText,
    props.options,
    props.optionFilters
  );
  const highlightedIndex = findOptionIndex(
    shownOptions,
    props.options[selectedIndex]
  );

  return {
    value: matchingText || null,
    isActive: false,
    listShown: false,
    selectedIndex,
    highlightedIndex,
    shownOptions
  };
}

export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = getStateFromProps(props);
    this.styling = createStyling(props.theme);

    if (typeof props.onValueChange !== 'undefined') {
      deprecated(
        '`onValueChange` is deprecated, please use `onSelect` instead'
      );
    }
  }

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING),
    onRenderOption: PropTypes.func,
    onRenderList: PropTypes.func,
    optionFilters: PropTypes.arrayOf(PropTypes.func)
  };

  static defaultProps = {
    onRenderOption: (styling, opt, highlighted, disabled) =>
      opt !== null ? (
        <div {...styling('inputEnhancementsOption', highlighted, disabled)}>
          {getOptionLabel(opt, highlighted, disabled)}
        </div>
      ) : (
        <div {...styling('inputEnhancementsSeparator')} />
      ),

    onRenderList: (styling, isActive, listShown, children, header) =>
      listShown && (
        <div
          {...styling([
            'inputEnhancementsPopup',
            'inputEnhancementsDropdownPopup'
          ])}
        >
          {header && (
            <div {...styling('inputEnhancementsListHeader', isActive)}>
              {header}
            </div>
          )}
          <div {...styling('inputEnhancementsListOptions', isActive)}>
            {children}
          </div>
        </div>
      ),

    onRenderListHeader: (allCount, shownCount, staticCount) => {
      if (allCount - staticCount < 20) return null;
      const allItems = `${allCount - staticCount} ${
        allCount - staticCount === 1 ? 'item' : 'items'
      }`;
      return allCount === shownCount
        ? `${allItems} found`
        : `${shownCount - staticCount} of ${allItems} shown`;
    },

    dropdownProps: {},

    optionFilters: [
      filters.filterByMatchingTextWithThreshold(20),
      filters.sortByMatchingText,
      filters.limitBy(100),
      filters.notFoundMessage('No matches found'),
      filters.filterRedudantSeparators
    ]
  };

  componentWillUpdate(nextProps, nextState) {
    const { options, optionFilters } = nextProps;
    const optionsChanged = this.props.options !== options;

    if (
      (nextProps.value && nextState.value === null) ||
      this.props.value !== nextProps.value
    ) {
      const state = getStateFromProps(nextProps);

      if (state.value !== this.state.value || optionsChanged) {
        this.setState(state);
      }
    } else if (optionsChanged || this.props.optionFilters !== optionFilters) {
      const [highlightedIndex, shownOptions] = this.updateHighlightedIndex(
        nextState.value,
        options,
        optionFilters
      );
      const selectedIndex = findOptionIndex(
        options,
        shownOptions[highlightedIndex]
      );

      this.setState({ selectedIndex });

      const state = getStateFromProps(nextProps);

      if (state.value !== this.state.value && !nextState.isActive) {
        this.setState(state);
      }
    } else if (this.state.isActive && !nextState.isActive) {
      this.setState({
        value: getOptionText(nextProps.options[nextState.selectedIndex])
      });
    }
  }

  updateHighlightedIndex(value, options, optionFilters) {
    const shownOptions = getShownOptions(value, options, optionFilters);
    const match = findMatchingTextIndex(value, shownOptions, true);
    const [highlightedIndex] = match;

    this.setState({ highlightedIndex, shownOptions });

    return [highlightedIndex, shownOptions];
  }

  render() {
    const { dropdownProps, onRenderCaret, children } = this.props;

    const value = this.state.value === null ? '' : this.state.value;

    return (
      <InputPopup
        styling={this.styling}
        value={value}
        customProps={{ textValue: value }}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        inputPopupProps={dropdownProps}
        onRenderPopup={this.renderPopup}
        onIsActiveChange={this.handleIsActiveChange}
        onPopupShownChange={this.handlePopupShownChange}
        popupShown={this.state.listShown}
        isActive={this.state.isActive}
        registerInput={this.registerInput}
        onRenderCaret={onRenderCaret}
      >
        {children}
      </InputPopup>
    );
  }

  registerInput = input => registerInput(this, input);

  renderPopup = (styling, isActive, popupShown) => {
    const { onRenderList, onRenderListHeader, options } = this.props;
    const { shownOptions } = this.state;

    return onRenderList(
      styling,
      isActive,
      popupShown,
      shownOptions.map(this.renderOption),
      onRenderListHeader(
        options.length,
        shownOptions.length,
        shownOptions.filter(isStatic).length
      )
    );
  };

  renderOption = (opt, idx) => {
    const { onRenderOption } = this.props;
    const highlighted = idx === this.state.highlightedIndex;
    const disabled = opt && opt.disabled;

    return (
      <DropdownOption
        key={getOptionKey(opt, idx)}
        onMouseDown={this.handleOptionClick.bind(this, idx)}
        highlighted={highlighted}
      >
        {onRenderOption(this.styling, opt, highlighted, disabled)}
      </DropdownOption>
    );
  };

  handleOptionClick(idx, e) {
    const option = this.state.shownOptions[idx];

    if (!option || option.disabled) {
      e.preventDefault();
      return;
    }

    this.setState(
      {
        listShown: false
      },
      () => {
        this.selectOption(findOptionIndex(this.props.options, option), true);
      }
    );
  }

  handleChange = e => {
    const { options, optionFilters } = this.props;
    const value = e.target.value;

    this.setState({ value });
    this.updateHighlightedIndex(value, options, optionFilters);

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  handleKeyDown = e => {
    const keyMap = {
      ArrowUp: this.handleArrowUpKeyDown,
      ArrowDown: this.handleArrowDownKeyDown,
      Enter: this.handleEnterKeyDown
    };

    if (keyMap[e.key]) {
      keyMap[e.key](e);
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  handleArrowUpKeyDown = e => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, false)
    });
  };

  handleArrowDownKeyDown = e => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, true)
    });
  };

  handleEnterKeyDown = () => {
    const { highlightedIndex, shownOptions } = this.state;
    const option = shownOptions[highlightedIndex];

    setTimeout(() => {
      this.selectOption(findOptionIndex(this.props.options, option), true);
      getInput(this).blur();
    });
  };

  selectOption(index, fireOnSelect) {
    const { options, optionFilters } = this.props;
    const option = options[index];
    const shownOptions = getShownOptions(
      getOptionText(option),
      options,
      optionFilters
    );

    const onSelect = this.props.onSelect || this.props.onValueChange;

    this.setState({
      value: getOptionText(option),
      highlightedIndex: findOptionIndex(shownOptions, option),
      selectedIndex: index,
      isActive: false,
      shownOptions
    });
    if (fireOnSelect && onSelect) {
      onSelect(getOptionValue(option), getOptionText(option));
    }
  }

  handleIsActiveChange = isActive => {
    this.setState({ isActive });
  };

  handlePopupShownChange = popupShown => {
    this.setState({ listShown: popupShown });
  };
}
