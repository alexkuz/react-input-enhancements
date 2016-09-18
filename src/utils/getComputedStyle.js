// Source: https://github.com/jonathantneal/Polyfills-for-IE8/blob/master/getComputedStyle.js

(typeof window !== 'undefined') &&
!('getComputedStyle' in window) &&
(window.getComputedStyle = (function (window) {
  function getPixelSize(element, style, property, fontSize) {
    const sizeWithSuffix = style[property];
    const size = parseFloat(sizeWithSuffix);
    const suffix = sizeWithSuffix.split(/\d/)[0];
    let rootSize;

    fontSize = fontSize != null ?
      fontSize :
      /%|em/.test(suffix) && element.parentElement ?
        getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) :
        16;
    rootSize = property == 'fontSize' ?
      fontSize :
      /width/i.test(property) ?
        element.clientWidth :
        element.clientHeight;

    return (suffix == 'em') ?
      size * fontSize :
      (suffix == 'in') ?
        size * 96 :
        (suffix == 'pt') ?
          size * 96 / 72 :
          (suffix == '%') ?
            size / 100 * rootSize :
            size;
  }

  function setShortStyleProperty(style, property) {
    const borderSuffix = property == 'border' ? 'Width' : '';
    const t = property + 'Top' + borderSuffix;
    const r = property + 'Right' + borderSuffix;
    const b = property + 'Bottom' + borderSuffix;
    const l = property + 'Left' + borderSuffix;

    style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]]
    : style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]]
    : style[l] == style[r] ? [style[t], style[r], style[b]]
    : [style[t], style[r], style[b], style[l]]).join(' ');
  }

  function CSSStyleDeclaration(element) {
    const currentStyle = element.currentStyle;
    const style = this;
    const fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

    for (const property in currentStyle) {
      if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
        style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
      } else if (property === 'styleFloat') {
        style['float'] = currentStyle[property];
      } else {
        style[property] = currentStyle[property];
      }
    }

    setShortStyleProperty(style, 'margin');
    setShortStyleProperty(style, 'padding');
    setShortStyleProperty(style, 'border');

    style.fontSize = fontSize + 'px';

    return style;
  }

  CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,
    getPropertyPriority() {},
    getPropertyValue(prop) {
      return window[prop] || '';
    },
    item() {},
    removeProperty() {},
    setProperty() {},
    getPropertyCSSValue() {}
  };

  function getComputedStyle(element) {
    return new CSSStyleDeclaration(element);
  }

  return getComputedStyle;
})(window));
