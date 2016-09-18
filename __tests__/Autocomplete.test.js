import React from 'react';
import renderer from 'react-test-renderer';
import Autocomplete from '../src/Autocomplete';

describe('Autocomplete', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <Autocomplete value='test' options={['test1', 'test2']}>
        {props => <input {...props} />}
      </Autocomplete>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <Autocomplete value='test' options={['test1', 'test2']}>
        <input />
      </Autocomplete>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
