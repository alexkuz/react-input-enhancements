import React, { PureComponent, PropTypes, Children } from 'react';
import Autocomplete from './Autocomplete';
import Dropdown from './Dropdown';
import Autosize from './Autosize';

export default class Combobox extends PureComponent {
  static propTypes = {
    autosize: PropTypes.bool,
    autocomplete: PropTypes.bool
  };

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

  renderAutosizeAutocompleteDropdown(children, props) {
    return (
      <Dropdown {...props}>
        {(dropdownInputProps, { textValue }) =>
          <Autocomplete
            value={textValue}
            onChange={dropdownInputProps.onChange}
            onKeyDown={dropdownInputProps.onKeyDown}
            options={props.options}
            getInputElement={props.getInputElement}
          >
            {(inputProps, { matchingText, registerInput }) =>
              <Autosize
                value={inputProps.value}
                onChange={inputProps.onChange}
                defaultWidth={props.defaultWidth}
                getInputElement={props.getInputElement}
                getSizerContainer={props.getSizerContainer}
              >
                  {(autosizeInputProps, { width }) =>
                    this.renderChildren(children, {
                      ...dropdownInputProps,
                      ...inputProps,
                      ...autosizeInputProps
                    }, {
                      matchingText, width, registerInput
                    })
                  }
              </Autosize>
            }
          </Autocomplete>
        }
      </Dropdown>
    );
  }

  renderAutosizeDropdown(children, props) {
    return (
      <Dropdown {...props}>
        {(inputProps, { textValue }) =>
          <Autosize
            value={textValue}
            onChange={inputProps.onChange}
            defaultWidth={props.defaultWidth}
            getInputElement={props.getInputElement}
            getSizerContainer={props.getSizerContainer}
          >
              {(autosizeInputProps, { width }) =>
                this.renderChildren(
                  children,
                  { ...inputProps, ...autosizeInputProps },
                  { width }
                )
              }
          </Autosize>
        }
      </Dropdown>
    );
  }

  renderAutocompleteDropdown(children, props) {
    return (
      <Dropdown {...props}>
        {(dropdownInputProps, { textValue }) =>
          <Autocomplete
            value={textValue}
            onChange={dropdownInputProps.onChange}
            onKeyDown={dropdownInputProps.onKeyDown}
            options={props.options}
            getInputElement={props.getInputElement}
          >
            {(inputProps, { matchingText, registerInput }) =>
              this.renderChildren(children, {
                ...dropdownInputProps,
                ...inputProps
              }, { matchingText, registerInput })
            }
          </Autocomplete>
        }
      </Dropdown>
    );
  }

  renderDropdown(children, props) {
    return (
      <Dropdown {...props}>
        {inputProps =>
          this.renderChildren(children, inputProps)
        }
      </Dropdown>
    );
  }

  renderChildren(children, props, params={}) {
    if (typeof children === 'function') {
      return children(props, params);
    } else {
      const input = Children.only(children);

      return React.cloneElement(input, { ...props, ...input.props });
    }
  }
}
