# Vanilla Web Components Magic
_A collection of useful snippets for creating VanillaJS Web Components_

## index

Right now, there are only 2 snippets:

- [**addShadowRoot**](#addshadowroot): Creates a Shadow Root at `this.root` and convert the styles for use on browsers that use webcomponents.js instead of using native support.
- [**declaredProps**](#declaredprops): Used to declare properties, in a way similar to the way Polymer does it. Allows to set observers and synchronizing attributes to properties and viceversa.

## VanillaJS Web Components

Those are web components that are created without using Polymer, X-Tag, or any of those libraries that wrap the creation of web components, and instead manually creating them using directly the browser API (or the webcomponents.js polyfill).

Is a good way to create simple components that don't have any dependencies and therefore don't have "dependency hell" problems, like ones you get when trying to use Polymer 1.0 elements at the same time as Polymer 0.5 elements on a project.

You can use the *official* [boilerplate for VanillaJS components](https://github.com/webcomponents/element-boilerplate) from webcomponents.org to create an element in such way.

This project, **vanilla-components-magic** can be used to solve common problems.

### So what is vanilla-components-magic?

A collection of snippets that you can copy-paste on your source code to handle things required on web components.

More specifically, it has an snippet for the creation of the Shadow DOM and handles converting the styles for use on browsers that lack native support and use webcomponents.js instead.

It also has an snippet for setting observers for properties and synchronizing attributes and properties that work similar to the way Polymer does it.

### License

MIT and BSD, choose the one you prefer. You are not obligated, but it would be nice if you add a comment pointing to this repo. That is useful, so people reading your source code know where to find a more recent version of the snippets you are using.

### Contribution

If you want to contribute, first at all: Thanks!

Please add an issue commenting what are you planning to do before coding it and doing a pull request, to prevent duplication/waste of work.

The code must be validated using grunt-jslint (just do `npm install` and run `grunt`) and use jsdoc comments. (but not a lot of comments, so there are fewer lines to paste)

And remember that the idea is to have **small** snippets to solve common problems while creating VanillaJS components, not to fully recreate Polymer!

## Snippets

*You only need to copy-paste the snippets you need!*

### addShadowRoot

Creates a Shadow Root at `this.root` and convert the styles for use on browsers that use webcomponents.js instead of using native support.

**First, copy-paste the [addShadowRoot snippet](magic/addShadowRoot.js) into your code.**

------------------------------------------------------------------------------------------------------------------------------------------------

This snippet is a function that accept 3 arguments:

```javascript
addShadowRoot(obj, idTemplate, [tagName])
```

 - _{object}_ `obj` The element to which add the shadow root.
 - _{string}_ `idTemplate` The id of the template element.
 - _{string}_ `[tagName]` The name of the tag used by the element, used for rewriting the css. If omitted, it will use the `idTemplate` as `tagName`.

You need to set an id to the template, like this:

```html
<template id="my-element">
  <style>
    :host {
    }
  </style>
  ...
</template>
<script src="my-element.js"></script>
```

Then on your `element.createdCallback` function, you would need to call it like this:

```javascript
element.createdCallback = function () {
  ...
  addShadowRoot(this, 'my-element');
  ...
};
```

After that, you will have the Shadow Root on `this.root`.

### declaredProps

Used to declare properties, in a way similar to the way Polymer does it.

It allows to set observers for properties and synchronizing attributes to properties (and optionally from properties to attributes).

**First, copy-paste the [declaredProps snippet](magic/declaredProps.js) into your code.**

To use this, an object with the properties must be created. Here is an example that show the different possibilities:

```javascript
var properties = {
  someProperty : {
    type : Number,
    observer : 'somePropertyChanged',
    value : 0
  },
  other : {
    type : Array,
    value : function () {
      return [];
    }
  },
  name : {
    type : String,
    reflectToAttribute : true
  }
};
```

------------------------------------------------------------------------------------------------------------------------------------------------

First, is necessary to call the `declaredProps.init` function inside of the element's `createdCallback`.

```javascript
element.createdCallback = function () {
  ...
  declaredProps.init(this, properties);
  ...
};
```

To synchronize the changes of attributes to properties is necessary to call `syncProperty` inside of `attributeChangedCallback`.

```javascript
element.attributeChangedCallback = function (attr, oldVal, newVal) {
  declaredProps.syncProperty(this, properties, attr, newVal);
};
```

