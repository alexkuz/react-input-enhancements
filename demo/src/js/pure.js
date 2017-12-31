import React, { Component } from 'react';

const getDisplayName = c => c.displayName || c.name || 'Component';

export default WrappedComponent => {
  return class Pure extends Component {
    static displayName = `$pure(${getDisplayName(WrappedComponent)})`;

    shouldComponentUpdate(nextProps) {
      return (
        !!Object.keys(nextProps).length !== Object.keys(this.props).length ||
        !!Object.keys(nextProps).find(k => nextProps[k] !== this.props[k])
      );
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
