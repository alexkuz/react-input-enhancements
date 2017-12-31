import { createStyling } from 'react-base16-styling';
import defaultTheme from './themes/default';
import Prefixer from 'inline-style-prefixer';

let prefixerInstance;
if (typeof window !== 'undefined' && window.navigator) {
  prefixerInstance = new Prefixer(window.navigator);
} else {
  prefixerInstance = new Prefixer({
    userAgent:
      'Node.js (darwin; U; rv:v4.3.1) AppleWebKit/537.36 (KHTML, like Gecko)'
  });
}
const prefixer = prefixerInstance.prefix.bind(prefixerInstance);

const navButtonImg = type =>
  ({
    /* eslint-disable max-len */
    prev:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC',
    next:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAXRJREFUWAnN119ugjAcwPHWzJ1gnmxzB/BBE0n24m4xfNkTaOL7wOtsl3AXMMb+Vjaa1BG00N8fSEibPpAP3xAKKs2yjzTPH9RAjhEo9WzPr/Vm8zgE0+gXATAxxuxtqeJ9t5tIwv5AtQAApsfT6TPdbp+kUBcgVwvO51KqVhMkXKsVJFXrOkigVhCIs1Y4iKlWZxB1rX4gwlpRIIpa8SDkWmggrFq4IIRaJKCYWnSgnrXIQV1r8YD+1Vrn+bReagysIFfLABRt31v8oBu1xEBttfRbltmfjgEcWh9snUS2kNdBK6WN1vrOWxObWsz+fjxevsxmB1GQDfINWiev83nhaoiB/CoOU438oPrhXS0WpQ9xc1ZQWxWHqUYe0I0qrKCQKjygDlXIQV2r0IF6ViEBxVTBBSFUQQNhVYkHIVeJAtkNsbQ7c1LtzP6FsObhb2rCKv7NBIGoq4SDmKoEgTirXAcJVGkFSVVpgoSrXICGUMUH/QBZNSUy5XWUhwAAAABJRU5ErkJggg=='
    /* eslint-enable max-len */
  }[type]);

const dayStyle = mod =>
  ({
    today: {
      boxShadow: '0px 0px 0 1px #FFFFFF, 0px 0px 0 2px #4A90E2',
      fontWeight: '500'
    },
    disabled: {
      color: '#dce0e0',
      cursor: 'default',
      backgroundColor: '#FFFFFF'
    },
    outside: {
      cursor: 'default',
      color: '#dce0e0',
      backgroundColor: '#FFFFFF'
    },
    sunday: {
      backgroundColor: '#f7f8f8'
    },
    selected: {
      color: '#FFF',
      backgroundColor: '#4A90E2'
    }
  }[mod]);

function getStylingFromBase16() {
  return {
    dayPicker: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'inline-block',
          fontSize: 14
        })
      },
      className: ''
    }),
    dayPickerWrapper: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          position: 'relative',
          userSelect: 'none',
          paddingBottom: '1rem',
          flexDirection: 'row'
        })
      },
      className: ''
    }),
    dayPickerMonthWrapper: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table-row-group'
        })
      },
      className: ''
    }),
    dayPickerMonths: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        })
      },
      className: ''
    }),
    dayPickerMonth: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table',
          width: '26rem',
          borderSpacing: '0.2rem',
          userSelect: 'none',
          margin: '0 1rem',
          marginTop: '1rem'
        })
      },
      className: ''
    }),
    dayPickerNavBar: ({ style }) => ({
      style: {
        ...style
        //   position: 'absolute',
        //   left: '0',
        //   right: '0',
        //   padding: '1rem 0.5rem'
      },
      className: ''
    }),
    dayPickerNavButton: ({ style }, type, shouldShow, isHovered) => ({
      style: {
        ...style,
        ...prefixer({
          marginRight: type === 'prev' ? '2.5rem' : 0,
          position: 'absolute',
          cursor: 'pointer',
          top: '1rem',
          right: '1.5rem',
          marginTop: '2px',
          width: '2rem',
          height: '2rem',
          display: shouldShow ? 'inline-block' : 'none',
          backgroundSize: '50%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url("${navButtonImg(type)}")`,
          opacity: isHovered ? 1 : 0.8
        })
      },
      className: ''
    }),
    dayPickerCaption: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          padding: '0 0.5rem',
          display: 'table-caption',
          textAlign: 'left',
          marginBottom: '0.5rem'
        })
      },
      className: ''
    }),
    dayPickerCaptionInner: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          fontSize: '1.6rem',
          fontWeight: '500'
        })
      },
      className: ''
    }),
    dayPickerWeekdays: ({ style }) => ({
      style: {
        ...style,
        marginTop: '1rem',
        display: 'table-header-group'
      },
      className: ''
    }),
    dayPickerWeekdaysRow: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table-row'
        })
      },
      className: ''
    }),
    dayPickerWeekday: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table-cell',
          padding: '0.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          verticalAlign: 'middle',
          outline: 'none',
          width: '14.3%'
        })
      },
      className: ''
    }),
    dayPickerWeekdayAbbr: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          textDecoration: 'none',
          border: 0
        })
      },
      className: ''
    }),
    dayPickerWeekNumber: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table-cell',
          padding: '0.5rem',
          textAlign: 'right',
          verticalAlign: 'middle',
          minWidth: '1rem',
          fontSize: '0.75em',
          cursor: 'pointer',
          borderRight: '1px solid #eaecec'
        })
      },
      className: ''
    }),
    dayPickerWeek: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'table-row'
        })
      },
      className: ''
    }),
    dayPickerFooter: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          paddingTop: '0.5rem',
          textAlign: 'center'
        })
      },
      className: ''
    }),
    dayPickerTodayButton: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          border: 'none',
          backgroundImage: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          fontSize: '0.875em'
        })
      },
      className: ''
    }),
    dayPickerDay: ({ style, className }, day, modifiers, isHovered) => ({
      style: {
        ...style,
        display: 'table-cell',
        outline: 'none',
        backgroundColor: isHovered ? '#F0F0F0' : '#FFFFFF',
        padding: '0.5rem',
        borderRadius: '10rem',
        textAlign: 'center',
        cursor: 'pointer',
        verticalAlign: 'middle',
        ...Object.keys(modifiers).reduce(
          (s, mod) => ({
            ...s,
            ...dayStyle(mod)
          }),
          {}
        )
      },
      className: ''
    }),

    inputEnhancementsListHeader: prefixer({
      flex: '0 0 auto',
      minHeight: '3rem',
      fontSize: '0.8em',
      color: '#999999',
      backgroundColor: '#FAFAFA',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid #DDDDDD'
    }),
    inputEnhancementsListOptions: prefixer({
      flex: '1 1 auto',
      overflowY: 'auto',
      // fix for IE
      // https://connect.microsoft.com/IE/feedback/details/802625
      maxHeight: '27rem'
    }),
    inputEnhancementsOption: ({ style }, highlighted, disabled, hovered) => ({
      style: {
        ...style,
        ...(disabled
          ? {
              padding: '1rem 1.5rem',
              cursor: 'pointer',
              color: '#999999'
            }
          : highlighted
            ? {
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                color: '#FFFFFF',
                backgroundColor: '#3333FF'
              }
            : {
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                backgroundColor: hovered ? '#3333FF' : '#FFFFFF'
              })
      }
    }),
    inputEnhancementsSeparator: {
      margin: '0.5rem 0',
      width: '100%',
      height: '1px',
      borderTop: '1px solid #DDDDDD'
    },

    inputEnhancementsPopupWrapper: {
      position: 'relative',
      display: 'inline-block'
    },
    inputEnhancementsCaret: {
      position: 'absolute',
      right: '5px',
      top: 0,
      paddingTop: '5px',
      verticalAlign: 'middle',
      paddingLeft: '3px',
      width: '10px'
    },
    inputEnhancementsCaretSvg: ({ style }, isActive, hovered) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'inline-block',
          opacity: hovered || isActive ? 1 : 0,
          transition: 'opacity 0.15s linear, transform 0.15s linear',
          transform: hovered || isActive ? 'translateY(0)' : 'translateY(5px)'
        })
      }
    }),
    inputEnhancementsPopup: prefixer({
      display: 'flex',
      position: 'absolute',
      left: 0,
      top: '100%',
      zIndex: 10000,
      maxHeight: '36rem',
      minWidth: '22rem',
      backgroundColor: '#FFFFFF',
      boxShadow: '1px 1px 4px rgba(100, 100, 100, 0.3)',
      flexDirection: 'column'
    }),
    inputEnhancementsInput: {
      paddingRight: '15px'
    }
  };
}

export default createStyling(getStylingFromBase16, {
  defaultBase16: defaultTheme
});
