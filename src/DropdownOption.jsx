import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

export default class DropdownOption extends PureComponent {
  static propTypes = {
    highlighted: PropTypes.bool,
    onMouseDown: PropTypes.func
  };

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
    return (
      <div onMouseDown={this.props.onMouseDown}>
        {this.props.children}
      </div>
    );
  }
}
