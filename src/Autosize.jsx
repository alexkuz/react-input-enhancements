import React, { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import './getComputedStyle';

const ALLOWED_CSS_PROPS = [
  'direction',
  'fontFamily',
  'fontKerning',
  'fontSize',
  'fontSizeAdjust',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'padding',
  'textAlign',
  'textDecoration',
  'textTransform',
  'wordSpacing'
];

let sizersListEl = null;
const sizerContainerStyle = {
  position: 'absolute',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  width: 'auto',
  minWidth: 'initial',
  maxWidth: 'initial',
  zIndex: 10000,
  left: -1000,
  top: 0
};

export default class Autosize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.minWidth,
      minWidth: props.minWidth
    };
  }

  static propTypes = {
    text: PropTypes.string,
    minWidth: PropTypes.number,
    getInputElement: PropTypes.func
  }

  static defaultProps = {
    getSizerContainer: () => document.body
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
    if (!sizersListEl) {
      sizersListEl = document.createElement('div');
      for(const [key, val] of Object.entries(sizerContainerStyle)) {
        sizersListEl.style[key] = val;
      }
      sizersListEl.style.whiteSpace = 'pre';
      this.props.getSizerContainer().appendChild(sizersListEl);
    }

    this.sizerEl = document.createElement('span');
    sizersListEl.appendChild(this.sizerEl);
  }

  componentWillUnmount() {
    sizersListEl.removeChild(this.sizerEl);
    if (sizersListEl.childNodes.length === 0) {
      this.props.getSizerContainer().removeChild(sizersListEl);
      sizersListEl = null;
    }
    this.sizerEl = null;
  }

  componentDidMount() {
    if (this.props.minWidth === undefined)
      this.initMinWidth();
    this.updateWidth(this.props.text, this.props.minWidth);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.updateWidth(nextProps.text, this.state.minWidth);
    }
  }

  getInput() {
    if (this.props.getInputElement) {
      return this.props.getInputElement();
    }

    const el = ReactDOM.findDOMNode(this);
    return el.tagName === 'INPUT' ?
      el:
      el.getElementsByTagName('INPUT')[0];
  }

  initMinWidth() {
    const input = this.getInput();

    this.setState({
      minWidth: input.offsetWidth
    });
  }

  updateWidth(text, minWidth) {
    const input = this.getInput();
    const inputStyle = window.getComputedStyle(input, null);

    if (!text) {
      this.setState({
        width: minWidth
      });
      return;
    }

    for(const [key, val] of Object.entries(inputStyle)) {
      if (ALLOWED_CSS_PROPS.indexOf(key) !== -1) {
        this.sizerEl.style[key] = val;
      }
    }

    this.sizerEl.innerText = text;

    this.setState({
      width: Math.max(
        this.sizerEl.offsetWidth + 1,
        minWidth
      )
    });
  }

  render() {
    const { minWidth, children, text, ...props } = this.props;
    const { width } = this.state;

    if (typeof children === 'function') {
      return children(width, props);
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, {
        ...props,
        style: { ...(props.style || {}), width: width ? width + 'px' : 'auto' }
      });
    }
  }
}
