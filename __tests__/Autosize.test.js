import React from 'react';
import renderer from 'react-test-renderer';
import Autosize from '../src/Autosize';

describe('Autosize', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <Autosize value='test'>
        {props => <input {...props} />}
      </Autosize>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <Autosize value='test'>
        <input />
      </Autosize>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
