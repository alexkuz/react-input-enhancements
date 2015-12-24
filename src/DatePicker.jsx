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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const VALIDATORS = {
  YYYY: () => false,
  MM: val => parseInt(val, 10) > 12 ? '12' : false,
  ddd: () => {},
  DD: val => parseInt(val, 10) > 31 ? '31' : false,
};

function getStateFromProps(value, props) {
  const date = moment(value, props.pattern);

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
    onRenderCalendar: (className, style, date, isActive, popupShown, onSelect) =>
      popupShown && (
        <div {...{ className, style }}>
          <ReactDatePicker date={date.format('YYYY-MM-DD')}
                           className={sheet.classes.datePicker}
                           onChange={date => onSelect(moment(date, 'YYYY-MM-DD'))} />
        </div>
      )
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
                    popupShown={this.state.popupShown}>
          {children}
        </InputPopup>
      </Mask>
    );
  }

  handlePopupShownChange = popupShown => {
    this.setState({ popupShown });
  }

  handleChange = e => {
    this.setState(getStateFromProps(e.target.value, this.props));

    if (this.props.onInputChange) {
      this.props.onInputChange(e);
    }
  }

  handleValuePreUpdate = value => {
    return value.replace(RegExp(`(${DAYS.join('|')})`, 'g'), 'ddd');
  }

  handleValueUpdate = value => {
    const state = getStateFromProps(value, this.props);
    return value.replace(/ddd/g, DAYS[state.date.day()]);
  }

  renderPopup = (popupClassName, popupStyle, isActive, popupShown) => {
    const { onRenderCalendar } = this.props;

    return onRenderCalendar(
      popupClassName,
      popupStyle,
      this.state.date,
      isActive,
      popupShown,
      this.handleSelect
    );
  }

  handleSelect = date => {
    const value = moment(date).format(this.props.pattern);
    this.setState({
      popupShown: false,
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

    '& *': {
      'box-sizing': 'border-box'
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

    '& .dp-nav-table': {
      width: '100%',
      display: 'flex',
      'flex-direction': 'row',
      flex: 1,

      '& .dp-cell': {
        flex: 7
      },

      '& .dp-nav-cell': {
        flex: 1,
        cursor: 'pointer'
      },

      '& .dp-nav-cell:hover': {
        'background-color': '#EEE'
      }
    }
  }
}).attach();
