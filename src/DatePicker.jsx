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
  MM: val => parseInt(val, 10) > 12,
  DD: val => parseInt(val, 10) > 31
};

function parseDate(value, pattern) {
  return moment(value, pattern).format('YYYY-MM-DD');
}

export default class DatePicker extends Component {
  static propTypes = {
  }

  static defaultProps = {
    pattern: 'DD/MM/YYYY',
    onRenderCalendar: (className, style, value, pattern, isActive, popupShown) =>
      popupShown && (
        <div {...{ className, style }}>
          <ReactDatePicker date={parseDate(value, pattern)}
                           className={sheet.classes.datePicker} />
        </div>
      )
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { pattern, children, value, defaultValue, onChange, ...props } = this.props;
    return (
      <Mask pattern={pattern.replace(/[dDmMyY]/g, '0')}
            value={value}
            defaultValue={defaultValue}
            onValidate={this.handleValidate}
            onChange={onChange}>
        <InputPopup {...props} onRenderPopup={this.renderPopup}>
          {children}
        </InputPopup>
      </Mask>
    );
  }

  renderPopup = (popupClassName, popupStyle, isActive, popupShown) => {
    const { onRenderCalendar, value, pattern } = this.props;

    return onRenderCalendar(
      popupClassName,
      popupStyle,
      value,
      pattern,
      isActive,
      popupShown
    );
  }

  handleValidate = (value, processedValue) => {
    const { pattern, emptyChar } = this.props;
    const re = RegExp(emptyChar, 'g');

    return Object.keys(VALIDATORS).some(format => {
      const pos = pattern.indexOf(format);
      if (pos !== -1) {
        const value = processedValue.substr(pos, format.length).replace(re, '');
        return VALIDATORS[format](value);
      }
    });
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
