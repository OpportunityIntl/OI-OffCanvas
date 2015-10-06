# Off-Canvas Menus
Off-canvas menus for Opportunity International, built on jQuery and [Weavr](https://github.com/opportunityintl/Weavr).

## Usage
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
elem | DOM object | The drawer element. Can be a DOM object, or a jQuery object.
status | string | The status of the drawer. Either `'open'` or `'closed'`.
offset | number | The current offset of the drawer. A value of `0` means the drawer is closed. A positive value, e.g. `300`, means the drawer is open by 300px.
width | number | The calculated width of the drawer, in pixels. The value of `options.width` is parsed and saved to this property when the instance is initiated and on window resize.
