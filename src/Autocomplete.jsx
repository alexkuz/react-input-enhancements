import { Component, PropTypes, Children } from 'react';
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as shapes from './shapes';
import findMatchingText from './findMatchingText';

function setSelection(input, text, matchingText) {
  input.value = matchingText;
  input.setSelectionRange(text.length, matchingText.length);
}

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchingText: null
    };
  }

  static propTypes = {
    getInputElement: PropTypes.func,
    text: PropTypes.string,
    options: PropTypes.arrayOf(shapes.ITEM_OR_STRING)
  }

  static defaultProps = {
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
  }

  componentWillUnmount() {
    const input = this.getInput();
    input.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidMount() {
    const input = this.getInput();
    input.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.keyCode === 8) {
      const input = this.getInput();
      if (input.selectionStart !== input.selectionEnd &&
          input.selectionEnd === input.value.length &&
          input.selectionStart !== 0) {
        input.value = input.value.substr(0, input.selectionStart);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) {
      const matchingText = findMatchingText(nextProps.text, this.props.options);
      this.setState({ matchingText });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text && this.state.matchingText) {
      const input = this.getInput();
      setSelection(input, this.props.text, this.state.matchingText);
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

  render() {
    const { minWidth, children, ...props } = this.props;
    const { matchingText } = this.state;

    if (typeof children === 'function') {
      return children(matchingText, props);
    } else {
      return Children.only(children);
    }
  }
}
