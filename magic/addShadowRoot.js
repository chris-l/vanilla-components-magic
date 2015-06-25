/*jslint browser: true, indent: 2, nomen: true */

/**
 * addShadowRoot
 *
 * Creates a Shadow Root at `this.root` and convert the styles for use on browsers
 * that lack native support and use webcomponents.js instead.
 *
 * You need to set an id to the template element, like this:
 *
 * Paste this snippet into your code. You don't need to paste the comments.
 *
 * <template id="my-element">
 *  <style>
 *    :host {
 *    }
 *  </style>
 *  ...
 * </template>
 * <script src="my-element.js"></script>
 *
 * Then on your `element.createdCallback` function, you would need to call it like this:
 *
 * @example
 * element.createdCallback = function () {
 *   addShadowRoot(this, 'my-element');
 *   ...
 * };
 *
 * @param {object} obj The element to add the shadow root.
 * @param {string} idTemplate The id of the template element.
 * @param {string} [tagName] The name of the tag used by the element,
 *                 used for rewriting the css. If omitted, it will use the idTemplate as tagName.
 *                 If this is extending another element, put here: element[is=tagName]
 */
var addShadowRoot = (function () {
  'use strict';
  var importDoc, shimStyle;

  importDoc = (document._currentScript || document.currentScript).ownerDocument;

  if (window.ShadowDOMPolyfill) {
    shimStyle = document.createElement('style');
    document.head.insertBefore(shimStyle, document.head.firstChild);
  }

  return function (obj, idTemplate, tagName) {
    var template, list;

    obj.root = obj.createShadowRoot();
    template = importDoc.getElementById(idTemplate);
    obj.root.appendChild(template.content.cloneNode(true));

    if (window.ShadowDOMPolyfill) {
      list = obj.root.getElementsByTagName('style');
      Array.prototype.forEach.call(list, function (style) {
        if (!template.shimmed) {
          shimStyle.innerHTML += style.innerHTML
            .replace(/:host\b/gm, tagName || idTemplate)
            .replace(/::shadow\b/gm, ' ')
            .replace(/::content\b/gm, ' ');
        }
        style.parentNode.removeChild(style);
      });
      template.shimmed = true;
    }
  };
}());

