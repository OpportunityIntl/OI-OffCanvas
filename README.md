# Off-Canvas Menus
Off-canvas menus for Opportunity International, built on jQuery and [Weavr](https://github.com/opportunityintl/Weavr).

## Usage

### Getting started
Load `OI.offcanvas.min.css` and `OI.offcanvas.min.js`. The CSS is really tiny (852 bytes), so you might want to concatenate it with another stylesheet to save on HTTP requests.

The library expects the following markup:
```html
<div class="offcanvas-overlay"></div>
<div class="drawer">
  <!-- Off-canvas menu contents -->
</div>
```

You can initialize the library with a jQuery plugin or plain Javascript:
```javascript
<script>
  // jQuery
  $('.drawer').offcanvas({options});

  // plain Javascript
  var offcanvas = new OffCanvas(document.querySelector('.drawer'), {options});
</script>
```

### Accessing public methods and properties

If you used the jQuery plugin, the OffCanvas instance is saved as jQuery data under the key `offcanvas` on the drawer element. You can retrieve the instance to access its public methods and properties with `$('.drawer').data('offcanvas')`. If you initialized the library with plain javascript, you should have stored the instance in a variable. So, for example, to open the drawer manually:

```javascript
// jQuery
$('.drawer').data('offcanvas').open();

// plain javascript, where OffCanvas instance was stored in var offcanvas
offcanvas.open()
```

### Opening the drawer

The user can open the drawer by clicking on the defined trigger element (or elements, if a jQuery collection was passed as the trigger option). You can also call the instance's `open()` method to open it manually.

### Closing the drawer

The library has 4 defined ways a user can close the drawer. You can:

1. Click the trigger element
2. Click the overlay
3. Press the escape key
4. Click any element inside the drawer with a class of `close`.

You can also call the instance's `close()` method to close it manually.

## Options
Option | Type | Description
-------|------|------------
trigger | jQuery object | The element that triggers the drawer to open and close. Defaults to `$('.offcanvas-trigger')`.
breakpoint | number | The pixel dimension below which the off-canvas menu is active. Should correspond to the media query breakpoint (if any) at which the off-canvas menu icon appears/hides. If the window is resized above the breakpoint and the drawer is open, it will close automatically. If the breakpoint is `null`, the drawer will stay open at any window width. Defaults to `null`.
width | number, string, or function(drawer) | The width of the drawer. If a number is provided, width is defined in pixels. If a string is provided, a percentage is expected. If a function is provided, it should return a number (pixels) or a string (percentage). Defaults to `300`.
transitionDuration | number| The transition time for opening and closing the drawer, in milliseconds. Defaults to `500`.
displaceBody | boolean | Whether or not the drawer should displace the body. If false, the drawer will slide out over the body. If true, the body will slide with the drawer.
direction | string | The direction the drawer should open and close from. Accepted values are `'right'` and `'left'`. Defaults to `'right'`.
beforeOpen | function(drawer) | Callback function called before the drawer opens. The context (or value of `this`) is the `OffCanvas` instance. Return `false` to prevent the drawer from opening.
afterOpen | function(drawer) | Callback function called after the drawer opens. The context (or value of `this`) is the `OffCanvas` instance.
beforeClose | function(drawer) | Callback function called before the drawer closes. The context (or value of `this`) is the `OffCanvas` instance. Return `false` to prevent the drawer from closing.
afterClose | function(drawer) | Callback function called after the drawer closes. The context (or value of `this`) is the `OffCanvas` instance.

## Public Methods

### openTo(offset, duration)
Open the drawer to a specified width. Called by the `open()` and `close()` methods. 

#### Params
**offset** | number | The pixel value to open the drawer to. A value of `0` means the drawer is closed.

**duration** | number | The duration of the transition in milliseconds.

### open()
Open the drawer.

### close()
Close the drawer.

## Public Properties
Property | Type | Description
---------|------|------------
elem | jQuery object | The drawer element.
status | string | The status of the drawer. Either `'open'` or `'closed'`.
offset | number | The current offset of the drawer. A value of `0` means the drawer is closed. A positive value, e.g. `300`, means the drawer is open by 300px.
width | number | The calculated width of the drawer, in pixels. The value of `options.width` is parsed and saved to this property when the instance is initiated and on window resize.

## Examples
Let's say the site has a full navigation bar on desktop, but switches to an off-canvas menu below 960px. The drawer should have a max-width of 300px, but we want to make sure the trigger button is always visible (I'm looking at you, iPhone 5). To add a little pizazz, we'll have the menu icon change to a close icon when the drawer is open.

```javascript
$('.drawer').offcanvas({
  breakpoint: 960,
  width: function(drawer) {
    return Math.min($(window).width() - this.options.trigger.outerWidth(), 300);
  },
  beforeOpen: function(drawer) {
    this.options.trigger.removeClass('icon-menu').addClass('icon-cross');
  },
  afterOpen: function(drawer) {
    this.options.trigger.removeClass('icon-cross').addClass('icon-menu');
  }
})
```
