import React from 'react';
import ReactDOM from 'react-dom';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Collapse from 'react-bootstrap/lib/Collapse';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import countries from './countries';
import pure from './pure';

import Autosize from 'Autosize';
import Autocomplete from 'Autocomplete';
import Combobox from 'Combobox';
import Mask from 'Mask';
import DatePicker from 'DatePicker';

import './bootstrap-input-inline.css';

const ValueInput1 = pure(({ value, onChange }) =>
  <div className='inline-input'>
    <InputGroup>
      <Autosize
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            type='text'
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            {...inputProps}
          />
        }
      </Autosize>
      <InputGroup.Addon>
        <Glyphicon glyph='star' />
      </InputGroup.Addon>
    </InputGroup>
  </div>
);

const ValueInput2 = pure(({ value, onChange }) =>
  <div className='inline-input'>
    <InputGroup>
      <Autosize
        value={value}
        defaultWidth={100}
        onChange={e => onChange(e.target.value)}
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            type='text'
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            {...inputProps}
          />
        }
      </Autosize>
      <InputGroup.Addon>
        <Glyphicon glyph='asterisk' />
      </InputGroup.Addon>
    </InputGroup>
  </div>
);

const code1and2 = `
  This text has no default width:{' '}
  <div className='inline-input'>
    <InputGroup>
      <Autosize
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {inputProps =>
          <FormControl
            type='text'
            {...inputProps}
          />
        }
      </Autosize>
      <InputGroup.Addon>
        <Glyphicon glyph='star' />
      </InputGroup.Addon>
    </InputGroup>
  </div>
  and this has 100px default width:{' '}
  <div className='inline-input'>
    <InputGroup>
      <Autosize
        value={value}
        defaultWidth={100}
        onChange={e => onChange(e.target.value)}
      >
        {inputProps =>
          <FormControl
            type='text'
            {...inputProps}
          />
        }
      </Autosize>
      <InputGroup.Addon>
        <Glyphicon glyph='asterisk' />
      </InputGroup.Addon>
    </InputGroup>
  </div>
`;

const ValueInput3 = pure(({ value, onChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Autocomplete:
    </Col>
    <Col xs={6}>
      <Autocomplete
        value={value}
        options={countries}
        onChange={e => onChange(e.target.value)}
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
            {...inputProps}
          />
        }
      </Autocomplete>
    </Col>
  </FormGroup>
);

const code3 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Autocomplete:
    </Col>
    <Col xs={6}>
      <Autocomplete
        value={value}
        options={countries}
        onChange={e => onChange(e.target.value)}
      >
        {(inputProps, { registerInput }) =>
          <FormControl
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
            {...inputProps}
          />
        }
      </Autocomplete>
    </Col>
  </FormGroup>
`;

const ValueInput4 = pure(({ value, onChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autocomplete):
    </Col>
    <Col xs={6}>
      <Combobox
        value={value}
        options={countries}
        dropdownProps={{ style: { width: '100%' } }}
        onSelect={onChange}
        autocomplete
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            {...inputProps}
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
            placeholder='No Country'
          />
        }
      </Combobox>
    </Col>
  </FormGroup>
);

const code4 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autocomplete):
    </Col>
    <Col xs={6}>
      <Combobox
        value={value}
        options={countries}
        dropdownProps={{ style: { width: '100%' } }}
        onSelect={onChange}
        autocomplete
      >
        {(inputProps, { registerInput }) =>
          <FormControl
            {...inputProps}
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
            placeholder='No Country'
          />
        }
      </Combobox>
    </Col>
  </FormGroup>
`;

const ValueInput5 = pure(({ value, onChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autosize):
    </Col>
    <Col xs={6}>
      <Combobox
        value={value}
        options={[...countries, 'random-string-' + Math.random()]}
        onSelect={onChange}
        autosize
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            {...inputProps}
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
            placeholder='No Country'
          />
        }
      </Combobox>
    </Col>
  </FormGroup>
);

const code5 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autosize):
    </Col>
    <Col xs={6}>
      <Combobox
        value={value}
        options={[...countries, 'random-string-' + Math.random()]}
        onSelect={onChange}
        autosize
      >
        {inputProps =>
          <FormControl
            {...inputProps}
            type='text'
            placeholder='No Country'
          />
        }
      </Combobox>
    </Col>
  </FormGroup>
`;

const ValueInput6 = pure(({ value, onChange, addonAfter, options }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autosize + Autocomplete, defaultWidth=100):
    </Col>
    <Col xs={6}>
      <InputGroup>
        <Combobox
          value={value}
          options={options}
          defaultWidth={100}
          onSelect={onChange}
          autosize
          autocomplete
        >
          {(inputProps, otherProps, registerInput) =>
            <FormControl
              {...inputProps}
              ref={c => registerInput(ReactDOM.findDOMNode(c))}
              type='text'
              placeholder='No Country'
            />
          }
        </Combobox>
        <InputGroup.Addon>
          {addonAfter}
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
);

const code6 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Combobox (Dropdown + Autosize + Autocomplete, defaultWidth=100):
    </Col>
    <Col xs={6}>
      <InputGroup>
        <Combobox
          value={value}
          options={options}
          defaultWidth={100}
          onSelect={onChange}
          autosize
          autocomplete
        >
          {(inputProps, { registerInput }) =>
            <FormControl
              {...inputProps}
              ref={c => registerInput(ReactDOM.findDOMNode(c))}
              type='text'
              placeholder='No Country'
            />
          }
        </Combobox>
        <InputGroup.Addon>
          {addonAfter}
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
`;

const ValueInput7 = pure(({ value, onChange, onUnmaskedValueChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Mask + Autosize (credit card):
    </Col>
    <Col xs={6}>
      <InputGroup
        style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'monospace' }}
      >
        <Mask
          pattern='0000-0000-0000-0000'
          placeholder='1234-5678-1234-5678'
          value={value}
          onChange={e => onChange(e.target.value)}
          onUnmaskedValueChange={onUnmaskedValueChange}
        >
          {(inputProps, otherProps, registerInput) =>
            <Autosize
              defaultWidth={100}
              {...inputProps}
              registerInput={registerInput}
            >
              {(autosizeInputProps, otherProps, registerInput) =>
                <FormControl
                  {...inputProps}
                  {...autosizeInputProps}
                  type='text'
                  ref={c => registerInput(ReactDOM.findDOMNode(c))}
                />
              }
            </Autosize>
          }
        </Mask>
        <InputGroup.Addon>
          <Glyphicon glyph='credit-card' />
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
);

const code7 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Mask + Autosize (credit card):
    </Col>
    <Col xs={6}>
      <InputGroup
        style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'monospace' }}
      >
        <Mask
          pattern='0000-0000-0000-0000'
          placeholder='1234-5678-1234-5678'
          value={value}
          onChange={e => onChange(e.target.value)}
          onUnmaskedValueChange={onUnmaskedValueChange}
        >
          {(inputProps, { registerInput }) =>
            <Autosize
              defaultWidth={100}
              {...inputProps}
            >
              {(autosizeInputProps) =>
                <FormControl
                  {...inputProps}
                  {...autosizeInputProps}
                  type='text'
                  ref={c => registerInput(ReactDOM.findDOMNode(c))}
                />
              }
            </Autosize>
          }
        </Mask>
        <InputGroup.Addon>
          <Glyphicon glyph='credit-card' />
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
`;

const ValueInput8 = pure(({ value, onChange, onUnmaskedValueChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Mask + Autosize (phone number):
    </Col>
    <Col xs={6}>
      <InputGroup
        style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'monospace' }}
      >
        <Mask
          pattern='+\ 7\ (000) 000-00-00'
          placeholder='+ 7 (XXX) XXX-XX-XX'
          value={value}
          onChange={e => onChange(e.target.value)}
          onUnmaskedValueChange={onUnmaskedValueChange}
        >
          {(inputProps, otherProps, registerInput) =>
            <Autosize
              defaultWidth={100}
              {...inputProps}
              registerInput={registerInput}
            >
              {(autosizeInputProps, otherProps, registerInput) =>
                <FormControl
                  {...inputProps}
                  {...autosizeInputProps}
                  type='text'
                  ref={c => registerInput(ReactDOM.findDOMNode(c))}
                />
              }
            </Autosize>
          }
        </Mask>
        <InputGroup.Addon>
          <Glyphicon glyph='phone' />
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
);

const code8 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      Mask + Autosize (phone number):
    </Col>
    <Col xs={6}>
      <InputGroup
        style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'monospace' }}
      >
        <Mask
          pattern='+\ 7\ (000) 000-00-00'
          placeholder='+ 7 (XXX) XXX-XX-XX'
          value={value}
          onChange={e => onChange(e.target.value)}
          onUnmaskedValueChange={onUnmaskedValueChange}
        >
          {(inputProps, { registerInput }) =>
            <Autosize
              defaultWidth={100}
              {...inputProps}
            >
              {(autosizeInputProps) =>
                <FormControl
                  {...inputProps}
                  {...autosizeInputProps}
                  type='text'
                  ref={c => registerInput(ReactDOM.findDOMNode(c))}
                />
              }
            </Autosize>
          }
        </Mask>
        <InputGroup.Addon>
          <Glyphicon glyph='phone' />
        </InputGroup.Addon>
      </InputGroup>
    </Col>
  </FormGroup>
`;

const ValueInput9 = pure(({ value, onChange }) =>
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      DatePicker:
    </Col>
    <Col xs={6}>
      <DatePicker
        value={moment(value || undefined).format('ddd DD/MM/YYYY')}
        onChange={onChange}
      >
        {(inputProps, otherProps, registerInput) =>
          <FormControl
            {...inputProps}
            style={{ ...inputProps.style, fontFamily: 'monospace' }}
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
          />
        }
      </DatePicker>
    </Col>
  </FormGroup>
);

const code9 = `
  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      DatePicker:
    </Col>
    <Col xs={6}>
      <DatePicker
        value={moment(value || undefined).format('ddd DD/MM/YYYY')}
        onChange={onChange}
      >
        {(inputProps, { registerInput }) =>
          <FormControl
            {...inputProps}
            style={{ ...inputProps.style, fontFamily: 'monospace' }}
            ref={c => registerInput(ReactDOM.findDOMNode(c))}
            type='text'
          />
        }
      </DatePicker>
    </Col>
  </FormGroup>
`;

let frDatePicker = undefined;

const ValueInput10 = pure(({ value, onChange }) => {
  const frCurrent = moment(value || undefined);
  frCurrent.locale('fr');
  const frNow = moment();
  frNow.locale('fr');

  return (
    <FormGroup>
      <Col componentClass={ControlLabel} xs={3}>
        DatePicker (FR):
      </Col>
      <Col xs={6}>
        <DatePicker
          value={frCurrent.format('YYYY.MM.DD ddd')}
          placeholder={frNow.format('YYYY.MM.DD ddd')}
          pattern='YYYY.MM.DD ddd'
          onChange={onChange}
          locale='fr'
          getInputElement={() => frDatePicker}
        >
          <FormControl
            style={{ fontFamily: 'monospace' }}
            ref={c => frDatePicker = ReactDOM.findDOMNode(c)}
            type='text'
          />
        </DatePicker>
      </Col>
    </FormGroup>
  );
});

const code10 = `
  const frCurrent = moment(value || undefined);
  frCurrent.locale('fr');
  const frNow = moment();
  frNow.locale('fr');

  // more compact and more magic form

  <FormGroup>
    <Col componentClass={ControlLabel} xs={3}>
      DatePicker (FR):
    </Col>
    <Col xs={6}>
      <DatePicker
        value={frCurrent.format('YYYY.MM.DD ddd')}
        placeholder={frNow.format('YYYY.MM.DD ddd')}
        pattern='YYYY.MM.DD ddd'
        onChange={onChange}
        locale='fr'
        getInputElement={() => frDatePicker}
      >
        <FormControl
          style={{ fontFamily: 'monospace' }}
          ref={c => frDatePicker = ReactDOM.findDOMNode(c)}
          type='text'
        />
      </DatePicker>
    </Col>
  </FormGroup>
`;

export default class DemoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries,
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: 'value--Fiji',
      value7: '',
      unmaskedValue7: '',
      value8: '',
      unmaskedValue8: '',
      value9: '',
      value10: '',
      code1and2open: false,
      code3open: false,
      code4open: false,
      code5open: false,
      code6open: false,
      code7open: false,
      code8open: false,
      code9open: false,
      code10open: false,
      asyncAlterCountries: false
    };
  }

  componentDidMount() {
    window.setTimeout(this.setDelayedState, 200);
  }

  setDelayedState = () => {
    this.setState({ value4: 'value--Albania' });
  };

  lastTime = new Date();

  alterCountries = () => {
    this.lastTime = new Date();
    this.setState({
      countries: countries.map(country => country && ({
        ...country,
        text: country.text && country.text + ' ' + Math.random().toFixed(2)
      }))
    });
  };

  countDown = () => {
    this.setState({
      countDown: (this.state.countDown - 1) || 5
    });
  }

  toggleAsyncAlterCountries = () => {
    const asyncAlterCountries = !this.state.asyncAlterCountries;
    this.setState({ asyncAlterCountries, countDown: 5 });

    clearTimeout(this.alterCountriesTimeout);
    clearTimeout(this.countDownTimeout);
    if (asyncAlterCountries) {
      this.alterCountriesTimeout = setInterval(this.alterCountries, 5000);
      this.countDownTimeout = setInterval(this.countDown, 1000);
    }
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <PageHeader style={styles.header}>
          {process.env.npm_package_name}
          <small> v{process.env.npm_package_version}</small>
        </PageHeader>
        <h5>{process.env.npm_package_description}</h5>
        <div style={styles.content}>
          <form className='form-horizontal'>
            <div className='form-group'>
              <div className='control-label col-xs-3'>Autosize (inline):</div>
              <div className='col-xs-6'>
                This text has no default width:{' '}
                <ValueInput1 value={this.state.value1}
                             onChange={this.handleValue1Change} />,
                and this has 100px default width:{' '}
                <ValueInput2 value={this.state.value2}
                             onChange={this.handleValue2Change} />
              </div>
            </div>
            {this.renderCode(code1and2, 'code1and2open')}
            <ValueInput3 value={this.state.value3}
                         onChange={this.handleValue3Change} />
            {this.renderCode(code3, 'code3open')}
            <ValueInput4 value={this.state.value4}
                         onChange={this.handleValue4Change} />
            {this.renderCode(code4, 'code4open')}
            <ValueInput5 value={this.state.value5}
                         onChange={this.handleValue5Change} />
            {this.renderCode(code5, 'code5open')}
            <ValueInput6 value={this.state.value6}
                         onChange={this.handleValue6Change}
                         options={this.state.countries}
                         addonAfter={
                          <div style={{ display: 'flex' }}>
                            <Button onClick={() => this.setState({ value6: '' })}>
                              Reset
                            </Button>
                            <Button onClick={() => this.setState({ value6: 'value--Andorra' })}
                                    style={{ marginLeft: '2rem' }}>
                              Set Andorra
                            </Button>
                            <Button onClick={this.alterCountries}
                                    style={{ marginLeft: '2rem' }}>
                              Alter Options
                            </Button>
                            <Button onClick={this.toggleAsyncAlterCountries}
                                    style={{ marginLeft: '2rem' }}>
                              {this.state.asyncAlterCountries ?
                                `Async Alter On (${this.state.countDown})` :
                                'Async Alter Off'}
                            </Button>
                          </div>
                         } />
            {this.renderCode(code6, 'code6open')}
            <ValueInput7 value={this.state.value7}
                         onChange={this.handleValue7Change}
                         onUnmaskedValueChange={
                          value => this.setState({ unmaskedValue7: value })
                         } />
            <FormControl.Static
              label='Unmasked value:'
              value={this.state.unmaskedValue7}
            />
            {this.renderCode(code7, 'code7open')}
            <ValueInput8 value={this.state.value8}
                         onChange={this.handleValue8Change}
                         onUnmaskedValueChange={
                          value => this.setState({ unmaskedValue8: value })
                         } />
            <FormControl.Static
              label='Unmasked value:'
              value={this.state.unmaskedValue8}
            />
            {this.renderCode(code8, 'code8open')}
            <ValueInput9 value={this.state.value9}
                         onChange={this.handleValue9Change} />
            {this.renderCode(code9, 'code9open')}
            <ValueInput10 value={this.state.value10}
                          onChange={this.handleValue10Change} />
            {this.renderCode(code10, 'code10open')}
          </form>
        </div>
      </div>
    );
  }

  renderCode(code, key) {
    return (
      <div className='form-group'>
        <div className='col-xs-6 col-xs-offset-3'>
          <a role='button'
             onClick={() => this.setState({ [key]: !this.state[key] })}>Show code</a>
          <Collapse in={this.state[key]}>
            <pre>{code.replace(/^\n+/, '')}</pre>
          </Collapse>
        </div>
      </div>
    );
  }

  handleValue1Change = value => this.setState({ value1: value })

  handleValue2Change = value => this.setState({ value2: value })

  handleValue3Change = value => this.setState({ value3: value })

  handleValue4Change = value => this.setState({ value4: value })

  handleValue5Change = value => this.setState({ value5: value })

  handleValue6Change = value => this.setState({ value6: value })

  handleValue7Change = value => this.setState({ value7: value })

  handleValue8Change = value => this.setState({ value8: value })

  handleValue9Change = value => this.setState({ value9: value })

  handleValue10Change = value => this.setState({ value10: value })
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
    paddingTop: '20px',
    paddingBottom: '300px'
  }
};
