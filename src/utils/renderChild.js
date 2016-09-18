import React, { Children } from 'react';

export default function renderChild(children, inputProps, otherProps, registerInput) {
  if (typeof children === 'function') {
    return children(inputProps, otherProps, registerInput);
  } else {
    const input = Children.only(children);

    let props = {
      ...inputProps,
      ...input.props
    };

    if (props.style) {
      props = {
        ...props,
        style: {
          ...(inputProps.style || {}),
          ...(input.props.style || {})
        }
      }
    }

    return React.cloneElement(input, props);
  }
}
