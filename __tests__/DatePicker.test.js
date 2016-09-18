import React from 'react';
import renderer from 'react-test-renderer';
import DatePicker from '../src/DatePicker';
import moment from 'moment';

const now = moment(0);

describe('DatePicker', () => {
  it('renders correctly with function child', () => {
    const tree = renderer.create(
      <DatePicker
        value={now.format('ddd DD/MM/YYYY')}
        placeholder={now.format('ddd DD/MM/YYYY')}
      >
        {props => <input {...props} />}
      </DatePicker>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with element child', () => {
    const tree = renderer.create(
      <DatePicker
        value={now.format('ddd DD/MM/YYYY')}
        placeholder={now.format('ddd DD/MM/YYYY')}
      >
        <input />
      </DatePicker>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
