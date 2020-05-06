import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './utils/getComputedStyle';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';

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
  top: 100
};

export default class Autosize extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: props.defaultWidth,
      defaultWidth: props.defaultWidth,
      value: props.value
    };
  }

  static propTypes = {
    value: PropTypes.string,
    defaultWidth: PropTypes.number,
    getInputElement: PropTypes.func,
    getSizerContainer: PropTypes.func,
    padding: PropTypes.number
  };

  static defaultProps = {
    getSizerContainer: () => document.body,
    padding: 0
  };

  componentWillMount() {
    if (typeof document === 'undefined') {
      return;
    }

    if (!sizersListEl) {
      sizersListEl = document.createElement('div');
      for (const [key, val] of Object.entries(sizerContainerStyle)) {
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
    if (typeof window === 'undefined') {
      return;
    }
    let defaultWidth = this.props.defaultWidth;

    if (defaultWidth === undefined) {
      const input = getInput(this);
      defaultWidth = input.offsetWidth;
      this.setDefaultWidth(defaultWidth);
    }

    this.updateWidth(
      this.props.value || this.props.placeholder,
      defaultWidth,
      this.props.padding
    );
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
    if (
      nextState.value !== this.state.value ||
      nextProps.padding !== this.props.padding
    ) {
      this.updateWidth(
        nextState.value || nextProps.placeholder,
        nextState.defaultWidth,
        nextProps.padding
      );
    }
  }

  registerInput = input => registerInput(this, input);

  updateWidth(value, defaultWidth, padding) {
    const input = getInput(this);
    const inputStyle = window.getComputedStyle(input, null);

    if (!value) {
      this.setState({
        width: defaultWidth
      });
      return;
    }

    for (const key in inputStyle) {
      if (ALLOWED_CSS_PROPS.indexOf(key) !== -1) {
        this.sizerEl.style[key] = inputStyle[key];
      }
    }

    this.sizerEl.innerText = value;
    this.sizerEl.style.position = 'absolute';

    this.setState({
      width: Math.max(this.sizerEl.offsetWidth + padding + 1, defaultWidth)
    });
  }

  render() {
    const { children, style, placeholder, value } = this.props;
    const { width } = this.state;
    const inputProps = {
      style: {
        ...(style || {}),
        ...(width ? { width } : {})
      },
      placeholder,
      value,
      onChange: this.handleChange
    };

    return renderChild(children, inputProps, { width }, this.registerInput);
  }

  handleWindownResize = () => {
    this.updateWidth(
      this.state.value || this.props.placeholder,
      this.state.defaultWidth,
      this.props.padding
    );
  };

  handleChange = e => {
    const value = e.target.value;

    if (this.props.value === undefined) {
      this.setState({ value });
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };
}
