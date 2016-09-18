import React, { PureComponent, PropTypes, Children } from 'react';
import Mask from './Mask';
import InputPopup from './InputPopup';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker-themeable';
import MomentLocaleUtils from 'react-day-picker-themeable/lib/addons/MomentLocaleUtils';
import createStyling from './createStyling';

const VALIDATORS = {
  YYYY: () => false,
  MM: val => parseInt(val, 10) > 12 ? '12' : false,
  ddd: () => {},
  DD: val => parseInt(val, 10) > 31 ? '31' : false,
};

function getStateFromProps(value, props) {
  const date = moment(value === null ? undefined : value, value ? props.pattern : '', props.locale);

  return {
    date: date.isValid() ? date : moment(undefined, '', props.locale),
    value,
    pattern: props.pattern.replace(/ddd/g, '\\d\\d\\d').replace(/[DMY]/g, '0')
  };
}

export default class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = getStateFromProps(props.value, props);
    this.styling = createStyling(props.theme, props.invertTheme);
  }

  static propTypes = {
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    onRenderCalendar: PropTypes.func,
    getInputElement: PropTypes.func,
    locale: PropTypes.string
  };

  static defaultProps = {
    pattern: 'ddd DD/MM/YYYY',
    placeholder: moment().format('ddd DD/MM/YYYY'),
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

  componentWillUpdate(nextProps, nextState) {
    const value = nextProps.value !== this.props.value ? nextProps.value : nextState.value;
    const state = getStateFromProps(value, nextProps);

    if (state.value !== nextState.value) {
      this.setState(getStateFromProps(value, nextProps));
    }
  }

  render() {
    const { children, placeholder, registerInput, getInputElement } = this.props;

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

  handlePopupShownChange = popupShown => {
    this.setState({ popupShown });
  }

  handleIsActiveChange = isActive => {
    this.setState({ isActive });
  }

  handleChange = e => {
    this.setState(getStateFromProps(e.target.value, this.props));

    if (this.props.onInputChange) {
      this.props.onInputChange(e);
    }
  }

  handleValuePreUpdate = value => {
    const localeData = moment.localeData(this.props.locale);
    const days = localeData._weekdaysShort;

    return value.replace(RegExp(`(${days.join('|').replace('.', '\\.')})`, 'g'), 'ddd');
  }

  handleValueUpdate = value => {
    const localeData = moment.localeData(this.props.locale);
    const state = getStateFromProps(
      value.replace(/ddd/g, localeData.weekdaysShort(this.state.date)),
      this.props
    );

    return value.replace(/ddd/g, localeData.weekdaysShort(state.date));
  }

  renderPopup = (styling, isActive, popupShown) => {
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

  handleSelect = date => {
    const localeMoment = moment(date);
    localeMoment.locale(this.props.locale);
    const value = localeMoment.format(this.props.pattern);
    this.setState({
      popupShown: false,
      isActive: false,
      ...getStateFromProps(value, this.props)
    });
    this.props.onChange && this.props.onChange(date);
  }

  handleValidate = (value, processedValue) => {
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
