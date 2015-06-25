/*jslint browser: true, indent: 2 */

/**
 * declaredProps
 *
 * This snippet allows to declare properties, in a way similar to the way Polymer does it.
 *
 * It allows to set observers for properties and does synchronization from attributes to properties (and optionally, from properties to attributes).
 *
 * Paste this snippet into your code. You don't need to paste the comments.
 *
 * @example
 * // Create an object with the properties.
 * var properties = {
 *   someProperty : {
 *     type : Number,
 *     observer : 'somePropertyChanged',
 *     value : 0
 *   },
 *   other : {
 *     type : Array,
 *     value : function () {
 *       return [];
 *     }
 *   },
 *   name : {
 *     type : String,
 *     reflectToAttribute : true
 *   }
 * };
 *
 * @example
 * // You must call the `declaredProps.init` method on `createdCallback`.
 * element.createdCallback = function () {
 *   ...
 *   declaredProps.init(this, properties);
 *   ...
 * };
 *
 * @example
 * //To synchronize the changes of attributes to properties is necessary to call `syncProperty`
 * element.attributeChangedCallback = function (attr, oldVal, newVal) {
 *   declaredProps.syncProperty(this, properties, attr, newVal);
 * };
 *
 */

var declaredProps = (function () {
  'use strict';
  var exports = {};

  function parse(val, type) {
    switch (type) {
    case Number:
      return parseFloat(val || 0, 10);
    case Boolean:
      return val !== null;
    case Object:
    case Array:
      return JSON.parse(val);
    case Date:
      return new Date(val);
    default:
      return val || '';
    }
  }
  function toHyphens(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  function toCamelCase(str) {
    return str.split('-')
      .map(function (x, i) {
        return i === 0 ? x : x[0].toUpperCase() + x.slice(1);
      }).join('');
  }
  exports.serialize = function (val) {
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'number' || val instanceof Date) {
      return val.toString();
    }
    return JSON.stringify(val);
  };

  exports.syncProperty = function (obj, props, attr, val) {
    var name = toCamelCase(attr), type;
    if (props[name]) {
      type = props[name].type || props[name];
      obj[name] = parse(val, type);
    }
  };

  exports.init = function (obj, props) {
    Object.defineProperty(obj, 'props', {
      enumerable : false,
      configurable : true,
      value : {}
    });

    Object.keys(props).forEach(function (name) {
      var attrName = toHyphens(name), desc, value;

      desc = props[name].type ? props[name] : { type : props[name] };
      value = typeof desc.value === 'function' ? desc.value() : desc.value;
      obj.props[name] = obj[name] || value;

      if (obj.getAttribute(attrName) === null) {
        if (desc.reflectToAttribute) {
          obj.setAttribute(attrName, exports.serialize(obj.props[name]));
        }
      } else {
        obj.props[name] = parse(obj.getAttribute(attrName), desc.type);
      }
      Object.defineProperty(obj, name, {
        get : function () {
          return obj.props[name] || parse(obj.getAttribute(attrName), desc.type);
        },
        set : function (val) {
          var old = obj.props[name];
          obj.props[name] = val;
          if (desc.reflectToAttribute) {
            if (desc.type === Boolean) {
              if (val) {
                obj.setAttribute(attrName, '');
              } else {
                obj.removeAttribute(attrName);
              }
            } else {
              obj.setAttribute(attrName, exports.serialize(val));
            }
          }
          if (typeof obj[desc.observer] === 'function') {
            obj[desc.observer](val, old);
          }
        }
      });
    });
  };

  return exports;
}());
