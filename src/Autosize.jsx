import React, { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import './utils/getComputedStyle';

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
      width: props.defaultWidth,
      defaultWidth: props.defaultWidth,
      value: props.value || props.defaultValue
    };
  }

  static propTypes = {
    value: PropTypes.string,
    defaultWidth: PropTypes.number,
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

    window.addEventListener('resize', this.handleWindownResize);
  }

  componentWillUnmount() {
    sizersListEl.removeChild(this.sizerEl);
    if (sizersListEl.childNodes.length === 0) {
      this.props.getSizerContainer().removeChild(sizersListEl);
      sizersListEl = null;
    }
    this.sizerEl = null;

    window.removeEventListener('resize', this.handleWindownResize);
  }

  componentDidMount() {
    let defaultWidth = this.props.defaultWidth;

    if (defaultWidth === undefined) {
      const input = this.getInput();
      defaultWidth = input.offsetWidth;
      this.setDefaultWidth(defaultWidth);
    }

    this.updateWidth(this.props.value || this.props.placeholder, defaultWidth);
  }

  setDefaultWidth(defaultWidth) {
    this.setState({ defaultWidth });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.value !== this.state.value) {
      this.updateWidth(nextState.value || nextProps.placeholder, nextState.defaultWidth);
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

  updateWidth(value, defaultWidth) {
    const input = this.getInput();
    const inputStyle = window.getComputedStyle(input, null);

    if (!value) {
      this.setState({
        width: defaultWidth
      });
      return;
    }

    for(const [key, val] of Object.entries(inputStyle)) {
      if (ALLOWED_CSS_PROPS.indexOf(key) !== -1) {
        this.sizerEl.style[key] = val;
      }
    }

    this.sizerEl.innerText = value;

    this.setState({
      width: Math.max(
        this.sizerEl.offsetWidth + 1,
        defaultWidth
      )
    });
  }

  render() {
    const { defaultWidth, children, ...props } = this.props;
    const { width } = this.state;
    const inputProps = {
      ...props,
      style: {
        ...(props.style || {}),
        ...(width ? { width: width + 'px' } : {})
      },
      onChange: this.handleChange
    }

    if (typeof children === 'function') {
      return children(inputProps, { width });
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, { ...inputProps, ...input.props });
    }
  }

  handleWindownResize = () => {
    this.updateWidth(this.state.value || this.props.placeholder, this.state.defaultWidth);
  }

  handleChange = e => {
    const value = e.target.value;

    if (this.props.value === undefined) {
      this.setState({ value });
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}
