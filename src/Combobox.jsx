import React, { Component, PropTypes, Children } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Autocomplete from './Autocomplete';
import Dropdown from './Dropdown';
import Autosize from './Autosize';

export default class Combobox extends Component {
  static propTypes = {
    autosize: PropTypes.bool,
    autocomplete: PropTypes.bool
  }

  shouldComponentUpdate = shouldPureComponentUpdate

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
        {(dropdownInputProps) =>
          <Autocomplete {...dropdownInputProps}>
            {(inputProps, { matchingText }) =>
              <Autosize {...inputProps}>
                  {(autosizeInputProps, { width }) =>
                    this.renderChildren(children, autosizeInputProps, { matchingText, width })
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
          <Autosize {...inputProps} value={textValue}>
              {(autosizeInputProps, { width }) =>
                this.renderChildren(children, autosizeInputProps, { width })
              }
          </Autosize>
        }
      </Dropdown>
    );
  }

  renderAutocompleteDropdown(children, props) {
    return (
      <Dropdown {...props}>
        {(dropdownInputProps) =>
          <Autocomplete {...dropdownInputProps}>
            {(inputProps, { matchingText }) =>
              this.renderChildren(children, inputProps, { matchingText })
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
