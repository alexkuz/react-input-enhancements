import React from 'react';
import Autosize from 'Autosize';
import Autocomplete from 'Autocomplete';
import Dropdown from 'Dropdown';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Input from 'react-bootstrap/lib/Input';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import countries from './countries';

import pkg from '../../../package.json';
import './bootstrap-input-inline.css';

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
                <Autosize text={this.state.value1}>
                  <Input type='text'
                         standalone
                         onChange={e => this.setState({ value1: e.target.value })}
                         groupClassName='inline-input'
                         addonAfter={<Glyphicon glyph='star' />} />
                </Autosize>,
                and this has 30px width:{' '}
                <Autosize text={this.state.value2} minWidth={30}>
                  <Input type='text'
                         standalone
                         onChange={e => this.setState({ value2: e.target.value })}
                         groupClassName='inline-input'
                         addonBefore={<Glyphicon glyph='asterisk' />} />
                </Autosize>
              </div>
            </div>
            <Autocomplete text={this.state.value3}
                          options={countries}>
              <Input type='text'
                     label='Autocomplete:'
                     labelClassName='col-xs-3'
                     wrapperClassName='col-xs-9'
                     onChange={e => this.setState({ value3: e.target.value })} />
            </Autocomplete>
            <Input label='Dropdown + Autocomplete:'
                   labelClassName='col-xs-3'
                   wrapperClassName='col-xs-9'>
              <Dropdown options={countries}
                        value={this.state.value4}>
                <Autocomplete text={this.state.value4}
                              options={countries}>
                  <input onChange={e => this.setState({ value4: e.target.value })}
                         type='text'
                         className='form-control' />
                </Autocomplete>
              </Dropdown>
            </Input>
            <Input label='Dropdown + Autosize:'
                   labelClassName='col-xs-3'
                   wrapperClassName='col-xs-9'>
              <Dropdown options={countries}
                        value={this.state.value5}>
                {inputClassName =>
                  <Autosize text={this.state.value5}>
                      <input onChange={e => this.setState({ value5: e.target.value })}
                             type='text'
                             className={`${inputClassName} form-control`} />
                  </Autosize>
                }
              </Dropdown>
            </Input>
            <Input label='Dropdown + Autosize + Autocomplete:'
                   labelClassName='col-xs-3'
                   wrapperClassName='col-xs-9'>
              <Dropdown options={countries}
                        value={this.state.value6}>
                {inputClassName =>
                  <Autocomplete text={this.state.value6}
                                options={countries}>
                    {matchingText =>
                      <Autosize text={matchingText} minWidth={30}>
                          <input onChange={e => this.setState({ value6: e.target.value })}
                                 type='text'
                                 className={`${inputClassName} form-control`} />
                      </Autosize>
                    }
                  </Autocomplete>
                }
              </Dropdown>
            </Input>
          </form>
        </div>
      </div>
    );
  }
}
