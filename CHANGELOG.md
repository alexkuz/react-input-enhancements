0.5.2 / 2016-09-18
------------------
* `DatePicker` value can be patched now with `onValuePreUpdate` callback.

0.5.1 / 2016-09-18
------------------
* Fix server rendering, tests added

0.5.0 / 2016-09-18
------------------
* IE11 fixes

0.5.0-beta2 / 2016-09-17
------------------------
* Just some refactoring
* API changed - `registerInput` goes as a third parameter now:
```jsx
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
```

0.5.0-beta1 / 2016-09-11
------------------------

* Auto-resolving `input` node is deprecated - now you have to provide it yourself, i.e.:
```jsx
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
```
* `onValueChange` is deprecated - use `onSelect` instead
* Components do not proxy props anymore (unless these props are used in component)
* Not-so-themeable [react-date-picker](https://github.com/Hacker0x01/react-date-picker) is replaced with [react-day-picker-themeable](https://github.com/alexkuz/react-day-picker-themeable), this library no longer depends on `jss`
* `DatePicker` and `Dropdown` are now themeable (via [react-base16-styling](https://github.com/alexkuz/react-base16-styling))

0.4.12 / 2016-06-20
-------------------

  * 0.4.12
  * upgrade moment for DatePicker

0.4.11 / 2016-05-16
-------------------

  * 0.4.11
  * fix managing null value in dropdown

0.4.10 / 2016-05-01
-------------------

  * 0.4.10
  * fix bluring Dropdown
  * fix disabled option
  * 0.4.9
  * remove a hack (proposed in [#13](https://github.com/alexkuz/react-input-enhancements/issues/13))

0.4.8 / 2016-03-18
------------------

  * 0.4.8
  * better async dropdown update

0.4.7 / 2016-03-10
------------------

  * 0.4.7
  * fix dependencies

0.4.6 / 2016-03-10
------------------

  * 0.4.6
  * sync options changes with input text

0.4.5 / 2016-01-29
------------------

  * 0.4.5
  * fix weird react error on dropdown options traversing

0.4.4 / 2016-01-13
------------------

  * 0.4.4
  * allow function as option label

0.4.3 / 2016-01-12
------------------

  * Merge branch 'master' of https://github.com/alexkuz/react-input-enhancements
  * 0.4.3
  * some refactoring
  * Merge pull request [#4](https://github.com/alexkuz/react-input-enhancements/issues/4) from nadav-dav/master
    moved react-pure-renderer from devDependencies to dependencies
  * moved react-pure-renderer from devDependencies to dependencies

0.4.2 / 2015-12-29
------------------

  * 0.4.2
  * consistent Autocomplete/Dropdown options parsing

0.4.1 / 2015-12-28
------------------

  * 0.4.1
  * fix: proper autocomplete for emptyish values
  * Update README.md
  * update demo

0.4.0 / 2015-12-26
------------------

  * 0.4.0
  * datepicker

0.3.11 / 2015-12-24
-------------------

  * 0.3.11
  * proxy onRenderCaret in dropdown

0.3.10 / 2015-12-24
-------------------

  * 0.3.10
  * merge branches
  * build demo
  * DatePicker (WIP)

0.3.9 / 2015-12-21
------------------

  * 0.3.9
  * fix sorting and autocompleting
  * build demo
  * reset Dropdown state value on losing focus
  * controlled mode for Dropdown
  * DatePicker (WIP)
  * refactor Dropdown - extract InputPopup

0.3.8 / 2015-12-18
------------------

  * 0.3.8
  * call Mask.onChange with updated value

0.3.7 / 2015-12-18
------------------

  * 0.3.7
  * remove hmr from production version

0.3.6 / 2015-12-17
------------------

  * 0.3.6
  * fix dead loop in Dropdown

0.3.5 / 2015-12-15
------------------

  * 0.3.5
  * fix dropdown initializing

0.3.4 / 2015-12-15
------------------

  * Merge branch 'master' of https://github.com/alexkuz/react-input-enhancements
  * 0.3.4
  * fix dropdown value reset
  * Update README.md

0.3.3 / 2015-12-14
------------------

  * 0.3.3
  * make dropdown more stable

0.3.2 / 2015-12-14
------------------

  * 0.3.2
  * fix dropdown onValueChange event

0.3.1 / 2015-12-14
------------------

  * 0.3.1
  * add keywords
  * 0.3.0
  * rearrange files
  * add Mask; Dropdown fixes

0.2.0 / 2015-12-09
------------------

  * 0.2.0
  * rebuild
  * oups!; back to first version

0.1.4 / 2015-12-09
------------------

  * 0.1.4
  * tune dropdown header style

0.1.3 / 2015-12-09
------------------

  * 0.1.3
  * fix dropdown options key

0.1.2 / 2015-12-09
------------------

  * 0.1.2
  * dropdown fixes
  * update build
  * 0.1.1
  * dropdown caret styling

0.1.0 / 2015-12-08
------------------

  * build demo
  * update demo code
  * first version
  * some fixes, dropdown layout (WIP)
  * update build
  * fix demo build
  * update readme
  * init
  * Initial commit
