# react-input-enhancements [![Gitter chat](https://img.shields.io/gitter/room/gitterHQ/gitter.svg)](https://gitter.im/react-input-enhancements)

Set of enhancements for input control

The intention of creating this library was to bring `input` component out of the dropdown/autocomplete/whatever code, so it could be easily replaced with your custom component, and also to split independent functionality into different components, which could be combined with each other (still not quite sure it was worth it, though).

---------------

**NB:** these are not "high quality, ready for production components" - they are more of a concept (which is a fancy word for "they are still quite buggy"). Think twice before using it in production.

---------------

There are currently five components:

1. [`<Autosize />`](#autosize)
2. [`<Autocomplete />`](#autocomplete)
3. [`<Dropdown />`](#dropdown)
4. [`<Mask />`](#mask)
5. [`<DatePicker />`](#datepicker)

[`<Combobox />`](#combobox) is a combination of `Dropdown`, `Autosize` and/or `Autocomplete` components.

## Demo

http://alexkuz.github.io/react-input-enhancements/

## How it works

* Each component is responsible for a corresponding behaviour (`<Autosize>` resizes `<input>` according to it's content length, `<Dropdown>` adds popup with options, and so on).
* All components accept `function` as a child, providing props as a first argument, which you should pass to your `input` component. If there is nothing else except `input`, it could be passed as a child directly (for simplicity).
* If you need to have combined behaviour in your component, let's say `<Autosize>` with `<Autocomplete>` just pass `<Autocomplete>` as a child to `<Autosize>` (see `<Combobox>` source code for reference)

#### Registering `<input>`

All components needs an access to `<input>` DOM element. To provide it, use `getInputComponent` prop:

```jsx
let input;

getInput() {
  return input;
}

<Autocomplete
  options={options}
  getInputComponent={getInput}
>
  {props =>
    <input
      ref={c => input = c}
      {...props}
    />
  }
</Autocomplete>
```
Or, if you don't want to store the node in your component:

```jsx
<Autocomplete
  options={options}
>
  {(props, otherProps, registerInput) =>
    <input
      ref={c => registerInput(c)}
      {...props}
    />
  }
</Autocomplete>
```
The first option also allows you to use shorter form with implicit parameters passing:
```jsx
let input;

getInput() {
  return input;
}

<Autocomplete
  options={options}
  getInputComponent={getInput}
>
  <input
    ref={c => input = c}
  />
</Autocomplete>
```
However, this is not preferable as there is too much magic happening.

If `<input>` element wasn't provided, component tries to find node automatically, however this behaviour is deprecated and will be removed in future versions.

## Autosize

`Autosize` resizes component to fit it's content.

```jsx
<Autosize defaultValue={value}
          minWidth={100}>
  {(inputProps, { width, registerInput }) =>
    <input type='text' {...inputProps} ref={c => registerInput(c)} />
  }
</Autosize>
```

### Autosize Props

* **`value`** *string* - Input value (for a controlled component)
* **`defaultValue`** *string* - Initial value (for a uncontrolled component)
* **`getInputElement`** *function()* - Optional callback that provides `<input>` DOM element
* **`registerInput`** *function* - Registers `<input>` DOM element
* **`defaultWidth`** *number* - Minimum input width

## Autocomplete

`Autocomplete` prompts a value based on provided `options` (see also [react-autocomplete](https://github.com/reactjs/react-autocomplete) for the same behaviour)

```jsx
<Autocomplete defaultValue={value}
              options={options}>
  {(inputProps, { matchingText, value, registerInput }) =>
    <input type='text' {...inputProps} ref={c => registerInput(c)} />
  }
</Autocomplete>
```

### Autocomplete Props

* **`value`** *string* - Input value (for a controlled component)
* **`defaultValue`** *string* - Initial value (for a uncontrolled component)
* **`getInputElement`** *function* - Optional callback that provides `<input>` DOM element
* **`registerInput`** *function* - Registers `<input>` DOM element
* **`options`** *array* - Array of options that are used to predict a value

`options` is an array of strings or objects with a `text` or `value` string properties.

## Dropdown

`Dropdown` shows a dropdown with a (optionally filtered) list of suitable options.

```jsx
<Dropdown defaultValue={value}
          options={options}>
  {(inputProps, { textValue }) =>
    <input type='text' {...inputProps} />
  }
</Dropdown>
```

### Dropdown Props

* **`value`** *string* - Input value (for a controlled component)
* **`defaultValue`** *string* - Initial value (for a uncontrolled component)
* **`options`** *array* - Array of shown options
* **`onRenderOption`** *function(className, style, option)* - Renders option in list
* **`onRenderCaret`** *function(className, style, isActive, children)* - Renders a caret
* **`onRenderList`** *function(className, style, isActive, listShown, children, header)* - Renders list of options
* **`onRenderListHeader`** *function(allCount, shownCount, staticCount)* - Renders list header
* **`dropdownProps`** *object* - Custom props passed to dropdown root element
* **`optionFilters`** *array* - List of option filters
* **`getInputElement`** *function* - Optional callback that provides `<input>` DOM element
* **`registerInput`** *function* - Registers `<input>` DOM element

`options` is an array of strings or objects with a shape:

* **`value`** - "real" value of on option
* **`text`** - text used as input value when option is selected
* **`label`** - text or component rendered in list
* **`static`** - option is never filtered out or sorted
* **`disabled`** - option is not selectable

`null` option is rendered as a separator

`optionFilters` is an array of filters for options (for convenience). By default, these filters are used:

* `filters.filterByMatchingTextWithThreshold(20)` - filters options by matching value, if options length is more than 20
* `filters.sortByMatchingText` - sorting by matching value
* `filters.limitBy(100)` - cuts options longer than 100
* `filters.notFoundMessage('No matches found')` - shows option with 'No matches found' label if all options are filtered out
* `filters.filterRedudantSeparators` - removes redudant separators (duplicated or at the begin/end of the list)

## Mask

`Mask` formats input value.

```jsx
<Mask defaultValue={value}
      pattern='0000-0000-0000-0000'>
  {(inputProps, { value }) =>
    <input type='text' {...inputProps} />
  }
</Mask>
```

### Mask Props

* **`value`** *string* - Input value (for a controlled component)
* **`defaultValue`** *string* - Initial value (for a uncontrolled component)
* **`getInputElement`** *function* - Optional callback that provides `<input>` DOM element
* **`registerInput`** *function* - Registers `<input>` DOM element
* **`pattern`** *string* - String formatting pattern. Only '0' (digit) or 'a' (letter) pattern chars are currently supported.
* **`emptyChar`** *string* - Character used as an empty symbol (`' '` by default)
* **`placeholder`** *string* - If set, it is shown when `unmaskedValue` is empty
* **`onUnmaskedValueChange`** *function(text)* - Fires when value is changed, providing unmasked value
* **`onValuePreUpdate`** *function* - Optional callback to update value before it is parsed by `Mask`

## DatePicker

`DatePicker` uses `Mask` to format date and shows calendar ([react-date-picker](https://github.com/zippyui/react-date-picker) by default) in popup.

```jsx
<DatePicker defaultValue={moment(value).format('ddd DD/MM/YYYY')}
            placeholder={moment().format('ddd DD/MM/YYYY')}
            pattern='ddd DD/MM/YYYY'
            locale='en'>
  {(inputProps, { value }) =>
    <input type='text' {...inputProps} />
  }
</DatePicker>
```

### DatePicker Props

* **`value`** *string* - Input value (for a controlled component)
* **`defaultValue`** *string* - Initial value (for a uncontrolled component)
* **`pattern`** *string* - Date formatting pattern. For now, only these tokens are supported:
  * `DD` - day of month
  * `MM` - month
  * `YYYY` - year
  * `ddd` - day of week *(not editable)*
* **`placeholder`** *string* - If set, it is shown when `unmaskedValue` is empty
* **`locale`** *string* - Date locale
* **`onRenderCalendar`** *function(className, style, date, isActive, popupShown, onSelect, locale)* - Returns calendar component shown in popup ([react-date-picker](https://github.com/zippyui/react-date-picker) by default)
* **`onChange`** *function(date)* - Fires when date is selected, providing [moment.js](http://momentjs.com/) object
* **`getInputElement`** *function* - Optional callback that provides `<input>` DOM element
* **`registerInput`** *function* - Registers `<input>` DOM element
* **`onValuePreUpdate`** *function* - Optional callback to update value before it is parsed by `DatePicker`. In this example, it parses inserted timestamp:
```js
onValuePreUpdate={v => parseInt(v, 10) > 1e8 ?
  moment(parseInt(v, 10)).format('ddd DD/MM/YYYY') : v
}
```

## Combobox

`Combobox` combines `Dropdown`, `Autosize` and/or `Autocomplete` components.

```jsx
<Combobox defaultValue={value}
          options={options}
          autosize
          autocomplete>
  {(inputProps, { matchingText, width }) =>
    <input type='text' {...inputProps} />
  }
</Combobox>
```

`Autosize` and `Autocomlete` are enabled with corresponding bool props, other properties are proxied to `Dropdown` component.

See [demo](http://alexkuz.github.io/react-input-enhancements/) for code examples.

## Some other (probably better) implementations

* [react-autocomplete](https://github.com/rackt/react-autocomplete) - Dropdown with autocompletion by Ryan Florence (that led me to create this library)
* [react-maskedinput](https://github.com/insin/react-maskedinput) - More advanced masked input by Jonny Buchanan
* [react-autosuggest](https://github.com/moroshko/react-autosuggest) - Beautifully crafted input with dropdown suggestions
