// @flow
import React, { Children } from 'react';

import type RegisterInput from './registerInput';

export default function renderChild(
  children: any, inputProps: Object, otherProps: Object, registerInput: RegisterInput
): any {
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
