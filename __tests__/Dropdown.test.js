import React from 'react';
import renderer from 'react-test-renderer';
import Dropdown from '../src/Dropdown';

describe('Dropdown', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <Dropdown value='test' options={['test1', 'test2']}>
        {props => <input {...props} />}
      </Dropdown>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <Dropdown value='test' options={['test1', 'test2']}>
        <input />
      </Dropdown>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
