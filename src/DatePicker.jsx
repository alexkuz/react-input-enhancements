// @flow
import React, { PureComponent, Children } from 'react';
import Mask from './Mask';
import InputPopup from './InputPopup';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker-themeable';
import MomentLocaleUtils from 'react-day-picker-themeable/lib/addons/MomentLocaleUtils';
import createStyling from './createStyling';

import type { Element } from 'react';
import type { MaskResult } from './utils/applyMaskToString';

type DefaultProps = {
  pattern: string,
  placeholder: string,
  onRenderCalendar: (
    styling: Function, date: moment, isActive: boolean, popupShown: boolean,
    onSelect: (value: any) => void, locale: string
  ) => ?Element<*> | false,
  locale: string,
  emptyChar: string
};

type Props = DefaultProps & {
  value: ?string,
  theme?: any,
  invertTheme?: boolean,
  getInputElement?: () => HTMLInputElement,
  children?: any,
  onInputChange?: (e: SyntheticInputEvent) => void,
  registerInput?: (input: HTMLInputElement) => void,
  dropdownProps?: Object,
  onValuePreUpdate?: (value: string) => string,
  onChange?: (date: moment) => void
};

type State = {
  date: moment,
  value: string,
  pattern: string,
  popupShown: boolean,
  isActive: boolean
};

const VALIDATORS = {
  YYYY: () => false,
  MM: val => parseInt(val, 10) > 12 ? '12' : (val === '00' ? '01' : false),
  ddd: () => {},
  DD: val => parseInt(val, 10) > 31 ? '31' : (val === '00' ? '01' : false),
};

function getStateFromProps(
  props: Props, value: string, isActive: boolean, popupShown: boolean
): State {
  const date = moment(value === null ? undefined : value, value ? props.pattern : '', props.locale);

  return {
    date: date.isValid() ? date : moment(undefined, '', props.locale),
    value,
    pattern: props.pattern.replace(/ddd/g, '\\d\\d\\d').replace(/[DMY]/g, '0'),
    isActive,
    popupShown
  };
}

export default class DatePicker extends PureComponent<DefaultProps, Props, State> {
  state: State;
  styling: Function;

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props, props.value || '', false, false);
    this.styling = createStyling(props.theme, props.invertTheme);
  }

  static defaultProps = {
    pattern: 'ddd DD/MM/YYYY',
    placeholder: moment().format('ddd DD/MM/YYYY'),
    emptyChar: ' ',
    onRenderCalendar: (styling, date, isActive, popupShown, onSelect, locale) =>
      popupShown && (
        <div {...styling(['inputEnhancementsPopup', 'inputEnhancementsDatePickerPopup'])}>
          <DayPicker
            theme={styling(null)}
            selectedDays={day => DateUtils.isSameDay(date.toDate(), day)}
            onDayClick={(e, day) => onSelect(moment(day, null, locale))}
            locale={locale}
            localeUtils={MomentLocaleUtils}
          />
        </div>
      ),
    locale: 'en'
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== this.props.value) {
      const nextState = getStateFromProps(
        nextProps, nextProps.value || '', this.state.isActive, this.state.popupShown
      );

      if (nextState.value !== this.state.value) {
        this.setState(nextState);
      }
    }
  }

  render() {
    const { children, placeholder, registerInput, getInputElement, dropdownProps } = this.props;

    const child = (maskProps, otherProps, registerInput) =>
      (typeof children === 'function') ?
        children(maskProps, otherProps, registerInput) :
        React.cloneElement(
          Children.only(children),
          { ...maskProps, ...Children.only(children).props }
        );

    return (
      <Mask
        pattern={this.state.pattern}
        value={this.state.value}
        onValidate={this.handleValidate}
        onChange={this.handleChange}
        placeholder={placeholder}
        onValuePreUpdate={this.handleValuePreUpdate}
        registerInput={registerInput}
        getInputElement={getInputElement}
      >
        {(maskProps, otherProps, registerInput) =>
          <InputPopup
            {...maskProps}
            inputPopupProps={dropdownProps}
            styling={this.styling}
            onRenderPopup={this.renderPopup}
            onPopupShownChange={this.handlePopupShownChange}
            onIsActiveChange={this.handleIsActiveChange}
            popupShown={this.state.popupShown}
            isActive={this.state.isActive}
            registerInput={registerInput}
            customProps={otherProps}
          >
            {(inputProps, otherProps, registerInput) => child(
              inputProps,
              otherProps,
              registerInput
            )}
          </InputPopup>
        }
      </Mask>
    );
  }

  handlePopupShownChange = (popupShown: boolean) => {
    this.setState({ popupShown });
  }

  handleIsActiveChange = (isActive: boolean) => {
    this.setState({ isActive });
  }

  handleChange = (e: SyntheticInputEvent) => {
    this.setState(getStateFromProps(
      this.props, e.target.value, this.state.isActive, this.state.popupShown
    ));

    if (this.props.onInputChange) {
      this.props.onInputChange(e);
    }
  }

  handleValuePreUpdate = (value: string) => {
    if (this.props.onValuePreUpdate) {
      value = this.props.onValuePreUpdate(value);
    }
    const localeData = moment.localeData(this.props.locale);
    const days = (localeData: any)._weekdaysShort;

    return value.replace(RegExp(`(${days.join('|').replace('.', '\\.')})`, 'g'), 'ddd');
  }

  handleValueUpdate = (value: string) => {
    const localeData = moment.localeData(this.props.locale);
    const state = getStateFromProps(
      this.props,
      value.replace(/ddd/g, localeData.weekdaysShort(this.state.date)),
      this.state.isActive,
      this.state.popupShown
    );

    return value.replace(/ddd/g, localeData.weekdaysShort(state.date));
  }

  renderPopup = (styling: Function, isActive: boolean, popupShown: boolean) => {
    const { onRenderCalendar, locale } = this.props;

    return onRenderCalendar(
      styling,
      this.state.date,
      isActive,
      popupShown,
      this.handleSelect,
      locale
    );
  }

  handleSelect = (date: moment) => {
    const localeMoment = moment(date);
    localeMoment.locale(this.props.locale);
    const value = localeMoment.format(this.props.pattern);

    this.setState(getStateFromProps(this.props, value, false, false));

    this.props.onChange && this.props.onChange(date);
  }

  handleValidate = (value: string, processedValue: MaskResult) => {
    const { pattern, emptyChar } = this.props;
    const re = RegExp(emptyChar, 'g');
    let result = processedValue.result;

    Object.keys(VALIDATORS).forEach(format => {
      const pos = pattern.indexOf(format);
      if (pos !== -1) {
        let val = processedValue.result.substr(pos, format.length).replace(re, '');
        val = VALIDATORS[format](val);
        if (val) {
          result = (
            result.substr(0, pos) +
            val +
            result.substr(pos + val.length)
          );
        }
      }
    });

    return {
      ...processedValue,
      result: this.handleValueUpdate(result)
    };
  }
}
