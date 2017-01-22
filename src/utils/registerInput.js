// @flow
import type { ComponentWithInput } from '../types';

export default function registerInput(cmp: ComponentWithInput, input: HTMLElement): void {
  cmp.input = input;

  if (typeof cmp.props.registerInput === 'function') {
    cmp.props.registerInput(input);
  }
}
