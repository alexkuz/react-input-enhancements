import { PropTypes } from 'react';
const { shape, oneOfType, string, any } = PropTypes;

export const ITEM = shape({
  text: string,
  label: any,
  value: any
});

export const ITEM_OR_STRING = oneOfType([
  ITEM,
  string
]);
