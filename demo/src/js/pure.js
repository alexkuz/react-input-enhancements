import React, { Component } from 'react';
import shallowCompare from 'react/lib/shallowCompare';

const getDisplayName = c => c.displayName || c.name || 'Component';

export default WrappedComponent => {
  return class Pure extends Component {

    static displayName = `$pure(${getDisplayName(WrappedComponent)})`;

    shouldComponentUpdate(nextProps) {
      return shallowCompare(this, nextProps, null);
    }

    render() {
      return (
        <WrappedComponent { ...this.props }/>
      );
    }
  };
};
