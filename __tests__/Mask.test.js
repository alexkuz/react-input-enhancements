import React from 'react';
import renderer from 'react-test-renderer';
import Mask from '../src/Mask';

describe('Mask', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <Mask value='123' pattern='0-0-0'>
        {props => <input {...props} />}
      </Mask>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <Mask value='123' pattern='0-0-0'>
        <input />
      </Mask>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
