import React from 'react';
import Autosize from 'Autosize';
import Autocomplete from 'Autocomplete';
import Dropdown from 'Dropdown';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import countries from './countries';
import pure from './pure';

import pkg from '../../../package.json';
import './bootstrap-input-inline.css';

const ValueInput1 = pure(({ value, onChange }) =>
  <Autosize text={value}>
    <Input type='text'
           standalone
           onChange={onChange}
           groupClassName='inline-input'
           addonAfter={<Glyphicon glyph='star' />} />
  </Autosize>);

const ValueInput2 = pure(({ value, onChange }) =>
  <Autosize text={value} minWidth={30}>
    <Input type='text'
           standalone
           onChange={onChange}
           groupClassName='inline-input'
           addonBefore={<Glyphicon glyph='asterisk' />} />
  </Autosize>);

const ValueInput3 = pure(({ value, onChange }) =>
  <Autocomplete text={value}
                options={countries}>
    <Input type='text'
           label='Autocomplete:'
           labelClassName='col-xs-3'
           wrapperClassName='col-xs-9'
           onChange={onChange} />
  </Autocomplete>);


const ValueInput4 = pure(({ value, onChange }) =>
  <Input label='Dropdown + Autocomplete:'
         labelClassName='col-xs-3'
         wrapperClassName='col-xs-9'>
    <Dropdown options={countries}
              value={value}>
      {inputClassName =>
        <Autocomplete text={value}
                      options={countries}>
          <input onChange={onChange}
                 type='text'
                 className={`${inputClassName} form-control`} />
        </Autocomplete>
      }
    </Dropdown>
  </Input>);

const ValueInput5 = pure(({ value, onChange }) =>
  <Input label='Dropdown + Autosize:'
         labelClassName='col-xs-3'
         wrapperClassName='col-xs-9'>
    <Dropdown options={countries}
              value={value}>
      {inputClassName =>
        <Autosize text={value}>
            <input onChange={onChange}
                   type='text'
                   className={`${inputClassName} form-control`} />
        </Autosize>
      }
    </Dropdown>
  </Input>);

const ValueInput6 = pure(({ value, onChange }) =>
  <Input label='Dropdown + Autosize + Autocomplete:'
         labelClassName='col-xs-3'
         wrapperClassName='col-xs-9'>
    <Autocomplete text={value}
                  options={countries}>
      {matchingText =>
        <Dropdown options={countries}
                  value={matchingText || value}>
          {inputClassName =>
            <Autosize text={matchingText || value} minWidth={30}>
                <input onChange={onChange}
                       type='text'
                       className={`${inputClassName} form-control`} />
            </Autosize>
          }
        </Dropdown>
      }
    </Autocomplete>
  </Input>);

export default class DemoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: null,
      value2: null,
      value3: null,
      value4: null,
      value5: null,
      value6: null
    };
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <PageHeader style={styles.header}>{pkg.name || '[[Package Name]]'}</PageHeader>
        <h5>{pkg.description || '[[Package Description]]'}</h5>
        <div style={styles.content}>
          <form className='form-horizontal'>
            <div className='form-group'>
              <div className='control-label col-xs-3'>Autosize:</div>
              <div className='col-xs-9'>
                This text has default width:{' '}
                <ValueInput1 value={this.state.value1}
                             onChange={this.handleValue1Change} />,
                and this has 30px width:{' '}
                <ValueInput2 value={this.state.value2}
                             onChange={this.handleValue2Change} />,
              </div>
            </div>
            <ValueInput3 value={this.state.value3}
                         onChange={this.handleValue3Change} />
            <ValueInput4 value={this.state.value4}
                         onChange={this.handleValue4Change} />
            <ValueInput5 value={this.state.value5}
                         onChange={this.handleValue5Change} />
            <ValueInput6 value={this.state.value6}
                         onChange={this.handleValue6Change} />
          </form>
        </div>
      </div>
    );
  }

  handleValue1Change = e => this.setState({ value1: e.target.value })

  handleValue2Change = e => this.setState({ value2: e.target.value })

  handleValue3Change = e => this.setState({ value3: e.target.value })

  handleValue4Change = e => this.setState({ value4: e.target.value })

  handleValue5Change = e => this.setState({ value5: e.target.value })

  handleValue6Change = e => this.setState({ value6: e.target.value })
}


const styles = {
  wrapper: {
    height: '100vh',
    width: '80%',
    margin: '0 auto'
  },
  header: {
  },
  content: {
    paddingTop: '20px'
  }
};
