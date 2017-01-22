// @flow
import React, { PureComponent } from 'react';
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

import type { Option, OptionFilter } from './types';

type StateValue = string;

type DefaultProps = {
  onRenderOption: (styling: Function, opt: Option, highlighted: boolean, disabled: boolean) => any,
  onRenderList: (
    styling: Function, isActive: boolean, listShown: boolean, children: any, header: any
  ) => any,
  onRenderListHeader: (allCount: number, shownCount: number, staticCount: number) => any,
  dropdownProps: Object,
  optionFilters: OptionFilter[]
};

type Props = DefaultProps & {
  theme: string | Object,
  invertTheme: boolean,

  value: any,
  options: Option[],
  children: any,
  onChange: (e: SyntheticInputEvent) => void,
  onKeyDown: (e: SyntheticKeyboardEvent) => void,
  onSelect: (value: any, text: string) => void,

  // deprecated
  onValueChange?: Function
};

type State = {
  value: StateValue,
  selectedIndex: number,
  highlightedIndex: number,
  shownOptions: Option[],
  isActive: boolean,
  listShown: boolean
};

function isOptionDisabled(opt: Option): boolean {
  if (opt === null) {
    deprecated('Using null for separator option is deprecated; use { separator: true }');
    opt = { separator: true };
  }

  if (typeof opt === 'string') {
    return false;
  }

  return !!(opt.separator || opt.disabled);
}

function isSeparatorOption(opt: Option): boolean {
  if (opt === null) {
    deprecated('Using null for separator option is deprecated; use { separator: true }');
    opt = { separator: true };
  }

  return typeof opt !== 'string' && !!(opt.separator);
}

function getOptionKey(opt: Option, idx: number): string {
  const value = getOptionValue(opt);

  return isSeparatorOption(opt) ?
    `option-separator-${idx}` :
    `option-${typeof value === 'string' ? value : (getOptionText(opt) + idx)}`;
}

function getSiblingIndex(idx: number, options: Option[], next: boolean) {
  if (idx === -1) {
    idx = next ? -1 : options.length;
  }

  const step = next ? 1 : -1;

  for (let i = 0; i < options.length; i++) {
    const currentIdx = (idx + (i + 1) * step + options.length) % options.length;
    if (!isOptionDisabled(options[currentIdx])) {
      return currentIdx;
    }
  }

  return idx;
}

function getShownOptions(
  value: StateValue, options: Option[], optionFilters: OptionFilter[]
): Option[] {
  return optionFilters.reduce((o, filter) => filter(o, value), options);
}

function findOptionIndex(options: Option[], option: Option) {
  return options.indexOf(option);
}

function getStateFromProps({ value, options, optionFilters }: Props): State {
  const match = findMatchingTextIndex(value, options);
  if (match.noResult) {
    return {
      value: '',
      isActive: false,
      listShown: false,
      selectedIndex: -1,
      highlightedIndex: -1,
      shownOptions: getShownOptions('', options, optionFilters)
    };
  }
  const { index: selectedIndex, text: matchingText } = match;
  const shownOptions = getShownOptions(matchingText, options, optionFilters);
  const highlightedIndex = findOptionIndex(shownOptions, options[selectedIndex]);

  return {
    value: matchingText,
    isActive: false,
    listShown: false,
    selectedIndex,
    highlightedIndex,
    shownOptions
  };
}

export default class Dropdown extends PureComponent<DefaultProps, Props, State> {
  styling: any;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = getStateFromProps(props);
    this.styling = createStyling(props.theme, props.invertTheme);

    if (typeof props.onValueChange !== 'undefined') {
      deprecated('`onValueChange` is deprecated, please use `onSelect` instead');
    }
  }

  static defaultProps: DefaultProps = {
    onRenderOption: (styling, opt, highlighted, disabled) =>
      !isSeparatorOption(opt) ?
        <div {...styling('inputEnhancementsOption', highlighted, disabled)}>
          {getOptionLabel(opt, highlighted, disabled)}
        </div> :
        <div {...styling('inputEnhancementsSeparator')} />,

    onRenderList: (styling, isActive, listShown, children, header) =>
      listShown && (
        <div {...styling(['inputEnhancementsPopup', 'inputEnhancementsDropdownPopup'])}>
          {header && <div {...styling('inputEnhancementsListHeader', isActive)}>{header}</div>}
          <div {...styling('inputEnhancementsListOptions', isActive)}>{children}</div>
        </div>
      ),

    onRenderListHeader: (allCount, shownCount, staticCount) => {
      if (allCount - staticCount < 20) return;

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
  };

  componentWillUpdate(nextProps: Props, nextState: State) {
    const { options, optionFilters } = nextProps;

    const optionsChanged = this.props.options !== options;

    if (nextProps.value && nextState.value === undefined ||
        this.props.value !== nextProps.value) {
      const state = getStateFromProps(nextProps);

      if (state.value !== this.state.value || optionsChanged) {
        this.setState(state);
      }
    } else if (optionsChanged ||
      this.props.optionFilters !== optionFilters) {
      const [highlightedIndex, shownOptions] = this.updateHighlightedIndex(
        nextState.value, options, optionFilters
      );
      const selectedIndex = findOptionIndex(options, shownOptions[highlightedIndex]);

      this.setState({ selectedIndex });

      const state = getStateFromProps(nextProps);

      if ((state.value !== this.state.value || optionsChanged) && !nextState.isActive) {
        this.setState(state);
      }
    } else if (this.state.isActive && !nextState.isActive) {
      this.setState({ value: getOptionText(nextProps.options[nextState.selectedIndex]) });
    }
  }

  updateHighlightedIndex(value: StateValue, options: Option[], optionFilters: OptionFilter[]) {
    const shownOptions = getShownOptions(value, options, optionFilters);
    const match = findMatchingTextIndex(value, shownOptions, true);
    const highlightedIndex = match.noResult ? -1 : match.index;

    this.setState({ highlightedIndex, shownOptions });

    return [highlightedIndex, shownOptions];
  }

  render() {
    const { dropdownProps, children } = this.props;

    const value = this.state.value === undefined ? '' : this.state.value;

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
      >
        {children}
      </InputPopup>
    );
  }

  registerInput = (input: HTMLInputElement) => registerInput(this, input);

  renderPopup = (styling: Function, isActive: boolean, popupShown: boolean) => {
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
  }

  renderOption = (opt: Option, idx: number) => {
    const { onRenderOption } = this.props;
    const highlighted = idx === this.state.highlightedIndex;
    const disabled = isOptionDisabled(opt);

    return (
      <DropdownOption
        key={getOptionKey(opt, idx)}
        onMouseDown={this.handleOptionClick.bind(this, idx)}
        highlighted={highlighted}
      >
        {onRenderOption(
          this.styling,
          opt,
          highlighted,
          disabled
        )}
      </DropdownOption>
    );
  }

  handleOptionClick(idx: number, e: SyntheticMouseEvent) {
    const option = this.state.shownOptions[idx];

    if (!option || option.separator || option.disabled) {
      e.preventDefault();
      return;
    }

    const index = findOptionIndex(this.props.options, option);

    this.setState({
      listShown: false
    }, () => {
      this.selectOption(index, true);
    });
  }

  handleChange = (e: SyntheticInputEvent) => {
    const { options, optionFilters } = this.props;

    const value = e.target.value;

    this.setState({ value });
    this.updateHighlightedIndex(value, options, optionFilters);

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleKeyDown = (e: SyntheticKeyboardEvent) => {
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

  handleArrowUpKeyDown = (e: KeyboardEvent) => {
    const { highlightedIndex, shownOptions } = this.state;

    e.preventDefault();

    this.setState({
      highlightedIndex: getSiblingIndex(highlightedIndex, shownOptions, false)
    });
  }

  handleArrowDownKeyDown = (e: KeyboardEvent) => {
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
      getInput(this).blur();
    });
  }

  selectOption(index: number, fireOnSelect: boolean) {
    const { options, optionFilters } = this.props;
    const option = options[index];
    const shownOptions = getShownOptions(getOptionText(option), options, optionFilters);

    const onSelect = this.props.onSelect || this.props.onValueChange;

    this.setState({
      value: getOptionText(option),
      highlightedIndex: findOptionIndex(shownOptions, option),
      selectedIndex: index,
      isActive: false,
      shownOptions
    });
    if (fireOnSelect && onSelect) {
      onSelect(
        getOptionValue(option),
        getOptionText(option)
      );
    }
  }

  handleIsActiveChange = (isActive: boolean) => {
    this.setState({ isActive });
  };

  handlePopupShownChange = (popupShown: boolean) => {
    this.setState({ listShown: popupShown });
  };
}
