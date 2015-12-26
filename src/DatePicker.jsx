import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Mask from './Mask';
import InputPopup from './InputPopup';
import moment from 'moment';
import ReactDatePicker from 'react-date-picker';
import { create } from 'jss';
import jssNested from 'jss-nested';
import jssVendorPrefixer from 'jss-vendor-prefixer';

const jss = create();
jss.use(jssNested());
jss.use(jssVendorPrefixer());

const VALIDATORS = {
  YYYY: () => false,
  MM: val => parseInt(val, 10) > 12 ? '12' : false,
  ddd: () => {},
  DD: val => parseInt(val, 10) > 31 ? '31' : false,
};

function getStateFromProps(value, props) {
  const date = moment(value === null ? undefined : value, props.pattern, props.locale);

  return {
    date,
    value,
    pattern: props.pattern.replace(/ddd/g, '\\d\\d\\d').replace(/[DMY]/g, '0')
  };
}

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromProps(props.value, props);
  }

  static propTypes = {
  }

  static defaultProps = {
    pattern: 'ddd DD/MM/YYYY',
    placeholder: moment().format('ddd DD/MM/YYYY'),
    onRenderCalendar: (className, style, date, isActive, popupShown, onSelect, locale) =>
      popupShown && (
        <div {...{ className, style }}>
          <ReactDatePicker date={date.format('YYYY-MM-DD')}
                           className={sheet.classes.datePicker}
                           onChange={date => onSelect(moment(date, 'YYYY-MM-DD', locale))}
                           locale={locale} />
        </div>
      ),
    locale: 'en'
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUpdate(nextProps, nextState) {
    const value = nextProps.value !== this.props.value ? nextProps.value : nextState.value;
    const state = getStateFromProps(value, nextProps);

    if (state.value !== nextState.value) {
      this.setState(getStateFromProps(value, nextProps));
    }
  }

  render() {
    const { pattern, children, value, defaultValue, onChange, placeholder, ...props } = this.props;

    return (
      <Mask pattern={this.state.pattern}
            value={this.state.value}
            defaultValue={defaultValue}
            onValidate={this.handleValidate}
            onChange={this.handleChange}
            placeholder={placeholder}
            onValuePreUpdate={this.handleValuePreUpdate}>
        <InputPopup {...props}
                    onRenderPopup={this.renderPopup}
                    onPopupShownChange={this.handlePopupShownChange}
                    onIsActiveChange={this.handleIsActiveChange}
                    popupShown={this.state.popupShown}
                    isActive={this.state.isActive}>
          {children}
        </InputPopup>
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

  renderPopup = (popupClassName, popupStyle, isActive, popupShown) => {
    const { onRenderCalendar, locale } = this.props;

    return onRenderCalendar(
      popupClassName,
      popupStyle,
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

const sheet = jss.createStyleSheet({
  datePicker: {
    display: 'flex',
    'flex-direction': 'column',
    flex: '1 0 auto',
    'box-sizing': 'border-box',
    width: '28rem',
    height: '30rem',

    '& *': {
      'box-sizing': 'border-box',
      'user-select': 'none',
      outline: 'none'
    },

    '& .dp-header': {
      background: '#f0f0f0',
      'border-bottom': '1px solid #CCCCCC',
      '& .dp-cell': {
        padding: '0.5rem',
        color: '#000'
      }
    },

    '& .dp-footer': {
      display: 'flex',
      'flex-direction': 'row',
      'justify-content': 'space-around',
      padding: '0.5rem'
    },

    '& .dp-footer-today, & .dp-footer-selected': {
      padding: '0.5rem 1rem',
      'border-radius': '2rem',
      cursor: 'pointer'
    },

    '& .dp-footer-today:hover, & .dp-footer-selected:hover': {
      'background-color': '#F0F0F0'
    },

    '& .dp-body': {
      display: 'flex',
      'flex-direction': 'column',
      flex: 1
    },

    '& .dp-week-day-names': {
      color: '#000'
    },

    '& .dp-prev, & .dp-next': {
      color: '#AAA'
    },

    '& .dp-table': {
      width: '100%',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
      flex: 1
    },

    '& .dp-row': {
      display: 'flex',
      'flex-direction': 'row',
      flex: 1
    },

    '& .dp-cell': {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      flex: 1,
      padding: '0.5rem'
    },

    '& .dp-day': {
      position: 'relative',
      cursor: 'pointer',

      '&:before': {
        content: '""',
        position: 'absolute',
        'z-index': '-1',
        width: '3.1rem',
        height: '3.1rem',
        'border-radius': '2rem',
        left: '0.5rem',
        top: '0.1rem'
      }
    },


    '& .dp-day:hover:before': {
      'background-color': '#F0F0F0'
    },

    '& .dp-value': {
      color: '#FFF',
      '&:before': {
        'background-color': '#2196f3'
      },
      '&:hover:before': {
        'background-color': '#0A6EBD'
      }
    },

    '& .dp-month.dp-value': {
      'background-color': '#2196f3',
      '&:hover': {
        'background-color': '#0A6EBD'
      }
    },

    '& .dp-year.dp-value': {
      'background-color': '#2196f3',
      '&:hover': {
        'background-color': '#0A6EBD'
      }
    },

    '& .dp-current': {
      '&:before': {
        'box-shadow': '0 0 0 1px #FFF, 0 0 0 2px #2196f3'
      },
    },

    '& .dp-nav-table': {
      width: '100%',
      display: 'flex',
      'flex-direction': 'row',
      flex: 1,

      '& .dp-cell': {
        flex: 7,
        cursor: 'pointer',
        '&:hover': {
          'background-color': '#E0E0E0'
        }
      },

      '& .dp-nav-cell': {
        flex: 1
      }
    },

    '& .dp-month, & .dp-year': {
      cursor: 'pointer',
      'border-radius': '0.5rem'
    },

    '& .dp-month:hover, & .dp-year:hover': {
      'background-color': '#F0F0F0'
    }
  }
}).attach();
