import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class DropdownOption extends Component {
  static propTypes = {
    highlighted: PropTypes.bool
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    if (this.props.highlighted) {
      this.scrollToOption();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.highlighted && this.props.highlighted) {
      this.scrollToOption();
    }
  }

  scrollToOption() {
    try {
      const optionEl = findDOMNode(this);
      if (optionEl) {
        const optionHeight = optionEl.offsetHeight;
        const listEl = optionEl.parentNode;
        const listHeight = listEl.clientHeight;
        listEl.scrollTop = optionEl.offsetTop - (listHeight - optionHeight) / 2;
      }
    } catch(e) {}
  }

  render() {
    return <div {...this.props} />;
  }
}
