// @flow
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

type Props = {
  highlighted: boolean,
  onMouseDown: (e: SyntheticMouseEvent) => void,
  children?: any
};

export default class DropdownOption extends PureComponent<void, Props, void> {
  componentDidMount() {
    if (this.props.highlighted) {
      this.scrollToOption();
    }
  }

  componentDidUpdate(prevProps: Props) {
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
