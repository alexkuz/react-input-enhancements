import React from 'react';
import renderer from 'react-test-renderer';
import Combobox from '../src/Combobox';

describe('Combobox', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <Combobox value='test' options={['test1', 'test2']} autosize autocomplete>
        {props => <input {...props} />}
      </Combobox>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <Combobox value='test' options={['test1', 'test2']} autosize autocomplete>
        <input />
      </Combobox>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
