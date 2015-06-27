/*jslint browser: true, indent: 2, nomen: true */
/**
 * `unresolved` support.
 *
 * Support of the "unresolved" attribute on body, which is used to prevent FOUC.
 * Contrary to the other snippets, this snippet is for use on a *app* that uses
 * only VanillaJS components, and is NOT used inside the actual elements.
 *
 * If Polymer or similar are being used on the app, this snippet is not necessary.
 * Polymer handles this on its own.
 *
 * USE:
 *
 * Just copy-paste this inside a <script> tag AFTER the line loading the webcomponent.js polyfill.
 *
 */
(function () {
  'use strict';
  var head, style;

  if (window.WebComponents) {
    window.addEventListener('WebComponentsReady', function () {
      document.body.removeAttribute('unresolved');
    });
  } else {
    // Create the same style as webcomponents.js
    style = document.createElement('style');
    style.textContent = 'body {transition:opacity ease-in 0.2s;}\n' +
      'body[unresolved] {opacity:0; display:block; overflow:hidden; position:relative;}';
    head = document.querySelector('head');
    head.insertBefore(style, head.firstChild);

    document.addEventListener('DOMContentLoaded', function () {
      document.body.removeAttribute('unresolved');
    });
  }
}());
