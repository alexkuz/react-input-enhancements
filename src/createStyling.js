import { createStyling } from 'react-base16-styling';
import defaultTheme from './themes/default';
import Prefixer from 'inline-style-prefixer';

let prefixerInstance;
if (typeof window !== 'undefined' && window.navigator) {
  prefixerInstance = new Prefixer(window.navigator);
} else {
  prefixerInstance = new Prefixer({
    userAgent: 'Node.js (darwin; U; rv:v4.3.1) AppleWebKit/537.36 (KHTML, like Gecko)'
  });
}
const prefixer = prefixerInstance.prefix.bind(prefixerInstance);

const navButtonImg = type => (({
  /* eslint-disable max-len */
  prev: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI2cHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iMCAwIDI2IDUwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjIgKDEyMDQzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5wcmV2PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9InByZXYiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjM5MzE5MywgMjUuMDAwMDAwKSBzY2FsZSgtMSwgMSkgdHJhbnNsYXRlKC0xMy4zOTMxOTMsIC0yNS4wMDAwMDApIHRyYW5zbGF0ZSgwLjg5MzE5MywgMC4wMDAwMDApIiBmaWxsPSIjNTY1QTVDIj4KICAgICAgICAgICAgPHBhdGggZD0iTTAsNDkuMTIzNzMzMSBMMCw0NS4zNjc0MzQ1IEwyMC4xMzE4NDU5LDI0LjcyMzA2MTIgTDAsNC4yMzEzODMxNCBMMCwwLjQ3NTA4NDQ1OSBMMjUsMjQuNzIzMDYxMiBMMCw0OS4xMjM3MzMxIEwwLDQ5LjEyMzczMzEgWiIgaWQ9InJpZ2h0IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K',
  next: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI2cHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iMCAwIDI2IDUwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjIgKDEyMDQzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5uZXh0PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9Im5leHQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuOTUxNDUxLCAwLjAwMDAwMCkiIGZpbGw9IiM1NjVBNUMiPgogICAgICAgICAgICA8cGF0aCBkPSJNMCw0OS4xMjM3MzMxIEwwLDQ1LjM2NzQzNDUgTDIwLjEzMTg0NTksMjQuNzIzMDYxMiBMMCw0LjIzMTM4MzE0IEwwLDAuNDc1MDg0NDU5IEwyNSwyNC43MjMwNjEyIEwwLDQ5LjEyMzczMzEgTDAsNDkuMTIzNzMzMSBaIiBpZD0icmlnaHQiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo='
  /* eslint-enable max-len */
})[type]);

const dayStyle = mod => (({
  today: {
    boxShadow: '0px 0px 0 1px #FFFFFF, 0px 0px 0 2px #4A90E2',
    fontWeight: '500'
  },
  disabled: {
    color: '#dce0e0',
    cursor: 'default',
    backgroundColor: '#eff1f1'
  },
  outside: {
    cursor: 'default',
    color: '#dce0e0'
  },
  sunday: {
    backgroundColor: '#f7f8f8'
  },
  selected: {
    color: '#FFF',
    backgroundColor: '#4A90E2'
  }
})[mod]);

function getStylingFromBase16(/*base16Theme*/) {
  return {
    dayPicker: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'relative',
          userSelect: 'none'
        })
      },
      className: ''
    }),
    dayPickerMonth: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          userSelect: 'none',
          paddingBottom: '0.5rem'
        })
      },
      className: ''
    }),
    dayPickerNavBar: ({ style }) => ({
      style: {
        ...style,
        position: 'absolute',
        left: '0',
        right: '0',
        padding: '1rem 0.5rem'
      },
      className: ''
    }),
    dayPickerNavButton: ({ style }, type) => ({
      style: {
        ...style,
        left: type === 'prev' ? '1rem' : 'auto',
        right: type === 'next' ? '1rem' : 'auto',
        position: 'absolute',
        width: '1.5rem',
        height: '1.5rem',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        cursor: 'pointer',
        backgroundImage: `url("${navButtonImg(type)}")`
      },
      className: ''
    }),
    dayPickerCaption: ({ style }) => ({
      style: {
        ...style,
        height: '3.5rem',
        padding: '0.5rem',
        backgroundColor: '#F0F0F0',
        borderBottom: '1px solid #EEEEEE',
        textAlign: 'center'
      },
      className: ''
    }),
    dayPickerWeekdays: ({ style }) => ({
      style: {
        ...style,
        display: 'flex',
        padding: '0 0.5rem'
      },
      className: ''
    }),
    dayPickerWeekdaysRow: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'flex'
        })
      },
      className: ''
    }),
    dayPickerWeekday: ({ style }) => ({
      style: {
        ...style,
        width: '3.2rem',
        margin: '0.1rem',
        padding: '.5rem',
        fontSize: '.875em',
        textAlign: 'center',
        color: '#8b9898'
      },
      className: ''
    }),
    dayPickerMonthWrapper: ({ style }) => ({
      style,
      className: ''
    }),
    dayPickerWeek: ({ style }) => ({
      style: {
        ...style,
        ...prefixer({
          display: 'flex',
          padding: '0 0.5rem'
        })
      },
      className: ''
    }),
    dayPickerDay: ({ style, className }, day, modifiers, isHovered) => ({
      style: {
        ...style,
        outline: 'none',
        backgroundColor: isHovered ? '#F0F0F0' : '#FFFFFF',
        padding: '0.5rem',
        borderRadius: '10rem',
        width: '3.2rem',
        height: '3.2rem',
        margin: '0.15rem',
        textAlign: 'center',
        cursor: 'pointer',
        verticalAlign: 'middle',
        ...modifiers.reduce((s, mod) => ({
          ...s,
          ...dayStyle(mod)
        }), {})
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
        ...(disabled ? {
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          color: '#999999'
        } : (highlighted ? {
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          color: '#FFFFFF',
          backgroundColor: '#3333FF'
        } : {
          padding: '1rem 1.5rem',
          cursor: 'pointer',
          backgroundColor: hovered ? '#3333FF' : '#FFFFFF'
        }))
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
          opacity: (hovered || isActive) ? 1 : 0,
          transition: 'opacity 0.15s linear, transform 0.15s linear',
          transform: (hovered || isActive) ? 'translateY(0)' : 'translateY(5px)'
        })
      }
    }),
    inputEnhancementsPopup: prefixer({
      display: 'flex',
      position: 'absolute',
      left: 0,
      top: '100%',
      zIndex: 10000,
      maxHeight: '30rem',
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
