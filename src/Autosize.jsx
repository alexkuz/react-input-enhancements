// @flow
import { PureComponent } from 'react';
import './utils/getComputedStyle';
import getInput from './utils/getInput';
import registerInput from './utils/registerInput';
import renderChild from './utils/renderChild';

type DefaultProps = {
  getSizerContainer: () => HTMLElement,
  padding: number
};

type Props = DefaultProps & {
  defaultWidth?: number,
  value: string,
  placeholder?: string,
  children?: any,
  style?: Object,
  onChange?: (e: SyntheticInputEvent) => void
};

type State = {
  value: string,
  width: number
};

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

const toDashCase = (str: string) => str.replace(/([A-Z])/g, (m, l) => '-' + l.toLowerCase());

let sizersListEl: ?HTMLElement = null;

const sizerContainerStyle = {
  position: 'absolute',
  visibility: 'hidden',
  whiteSpace: 'pre',
  width: 'auto',
  minWidth: 'initial',
  maxWidth: 'initial',
  zIndex: 10000,
  left: -1000,
  top: 100
};

function getStateFromProps(
  props: Props, stateValue: string, initialWidth?: number,
  input?: HTMLInputElement, sizerEl?: ?HTMLElement
): State {
  const widthValue = (props.value === undefined ? stateValue : props.value) || props.placeholder;
  const inputStyle = input && window.getComputedStyle(input, null);

  let width;

  if (!widthValue || !sizerEl || !input) {
    width = props.defaultWidth || initialWidth || 0;
  } else {
    for(const key in inputStyle) {
      if (ALLOWED_CSS_PROPS.indexOf(key) !== -1) {
        sizerEl.style.setProperty(toDashCase(key), inputStyle[key]);
      }
    }

    sizerEl.innerText = widthValue;

    width = Math.max(
      sizerEl.offsetWidth + props.padding + 1,
      props.defaultWidth || initialWidth || 0
    );
  }

  return {
    width,
    value: stateValue
  };
}

export default class Autosize extends PureComponent<DefaultProps, Props, State> {
  state: State;
  sizerEl: ?HTMLElement;
  initialWidth: number;

  constructor(props: Props) {
    super(props);
    this.state = getStateFromProps(props, props.value);
  }

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
      for(const key in sizerContainerStyle) {
        sizersListEl.style.setProperty(toDashCase(key), sizerContainerStyle[key]);
      }
      this.props.getSizerContainer().appendChild(sizersListEl);
    }

    this.sizerEl = document.createElement('span');
    sizersListEl.appendChild(this.sizerEl);

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    if (sizersListEl) {
      if (this.sizerEl) {
        sizersListEl.removeChild(this.sizerEl);
      }
      if (sizersListEl.childNodes.length === 0) {
        this.props.getSizerContainer().removeChild(sizersListEl);
        sizersListEl = null;
      }
    }

    this.sizerEl = null;

    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }

    const input = getInput(this);
    this.initialWidth = input.offsetWidth;
    const nextState = getStateFromProps(
      this.props, this.state.value, this.initialWidth, input, this.sizerEl
    );

    if (nextState.width !== this.state.width) {
      this.setState(nextState); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.value !== this.props.value ||
      nextProps.padding !== this.props.padding
    ) {
      const input = getInput(this);
      const nextState = getStateFromProps(
        nextProps, this.state.value,
        this.initialWidth, input, this.sizerEl
      );

      if (nextState.width !== this.state.width) {
        this.setState(nextState);
      }
    }
  }

  registerInput = (input: HTMLInputElement) => registerInput(this, input);

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
    }

    return renderChild(children, inputProps, { width }, this.registerInput);
  }

  handleWindowResize = () => {
    const input = getInput(this);
    const nextState = getStateFromProps(
      this.props, this.state.value, this.initialWidth, input, this.sizerEl
    );

    if (nextState.width !== this.state.width) {
      this.setState(nextState);
    }
  }

  handleChange = (e: SyntheticInputEvent) => {
    const value = e.target.value;

    const input = getInput(this);
    const nextState = getStateFromProps(
      this.props, value, this.initialWidth, input, this.sizerEl
    );

    if (nextState.width !== this.state.width) {
      this.setState(nextState);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
}
