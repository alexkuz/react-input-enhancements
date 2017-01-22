// @flow
import React, { PureComponent } from 'react';
import Autocomplete from './Autocomplete';
import Dropdown from './Dropdown';
import Autosize from './Autosize';
import renderChild from './utils/renderChild';

const CARET_PADDING = 15;

type Props = {
  autosize: boolean,
  autocomplete: boolean,
  children: any
};

export default class Combobox extends PureComponent<void, Props, void> {
  render() {
    const { autosize, autocomplete, children, ...props } = this.props;

    if (autosize && autocomplete) {
      return this.renderAutosizeAutocompleteDropdown(children, props);
    } else if (autosize) {
      return this.renderAutosizeDropdown(children, props);
    } else if (autocomplete) {
      return this.renderAutocompleteDropdown(children, props);
    } else {
      return this.renderDropdown(children, props);
    }
  }

  renderAutosizeAutocompleteDropdown(children: any, props: Object) {
    return (
      <Dropdown {...props}>
        {(dropdownInputProps, { textValue }, registerInput) =>
          <Autocomplete
            value={textValue}
            onChange={dropdownInputProps.onChange}
            onKeyDown={dropdownInputProps.onKeyDown}
            options={props.options}
            registerInput={registerInput}
            getInputComponent={props.getInputComponent}
          >
            {(inputProps, { matchingText }, registerInput) =>
              <Autosize
                value={inputProps.value}
                onChange={inputProps.onChange}
                defaultWidth={props.defaultWidth}
                getSizerContainer={props.getSizerContainer}
                registerInput={registerInput}
                getInputComponent={props.getInputComponent}
                padding={CARET_PADDING}
              >
                  {(autosizeInputProps, { width }, registerInput) =>
                    renderChild(
                      children,
                      {
                        ...dropdownInputProps,
                        ...inputProps,
                        ...autosizeInputProps
                      },
                      { matchingText, width },
                      registerInput
                    )
                  }
              </Autosize>
            }
          </Autocomplete>
        }
      </Dropdown>
    );
  }

  renderAutosizeDropdown(children: any, props: Object) {
    return (
      <Dropdown {...props}>
        {(inputProps, { textValue }, registerInput) =>
          <Autosize
            value={textValue}
            onChange={inputProps.onChange}
            defaultWidth={props.defaultWidth}
            getSizerContainer={props.getSizerContainer}
            registerInput={registerInput}
            getInputComponent={props.getInputComponent}
            padding={CARET_PADDING}
          >
              {(autosizeInputProps, { width }, registerInput) =>
                renderChild(
                  children,
                  { ...inputProps, ...autosizeInputProps },
                  { width },
                  registerInput
                )
              }
          </Autosize>
        }
      </Dropdown>
    );
  }

  renderAutocompleteDropdown(children: any, props: Object) {
    return (
      <Dropdown {...props}>
        {(dropdownInputProps, { textValue }, registerInput) =>
          <Autocomplete
            value={textValue}
            onChange={dropdownInputProps.onChange}
            onKeyDown={dropdownInputProps.onKeyDown}
            options={props.options}
            registerInput={registerInput}
            getInputComponent={props.getInputComponent}
          >
            {(inputProps, { matchingText }, registerInput) =>
              renderChild(
                children, {
                  ...dropdownInputProps,
                  ...inputProps
                },
                { matchingText },
                registerInput
              )
            }
          </Autocomplete>
        }
      </Dropdown>
    );
  }

  renderDropdown(children: any, props: Object) {
    return (
      <Dropdown {...props}>
        {(inputProps, otherProps, registerInput) =>
          renderChild(
            children,
            inputProps,
            otherProps,
            registerInput
          )
        }
      </Dropdown>
    );
  }
}
