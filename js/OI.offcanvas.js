(function($){
  $.fn.offcanvas = function(options) {
    return this.each(function() {
      if (!$(this).data('offcanvas')) {
        $(this).data('offcanvas', new OffCanvas($(this), options));
      }
    });
  };
})(jQuery);

var OffCanvas = function(elem, options) {
  var _this = this;
  var body = $('body');
  this.elem = $(elem);
  this.status = 'closed';
  this.offset = 0;
  this.width = null;

  this.options = $.extend({
    trigger: $('.offcanvas-trigger'),
    overlay: $('.offcanvas-overlay'),
    breakpoint: null,
    width: 300,
    transitionDuration: 500,
    displaceBody: true,
    direction: 'right',
    beforeOpen: function() {},
    afterOpen: function() {},
    beforeClose: function() {},
    afterClose: function() {}
  }, options);
  
  this.open = function() {
    
    if (_this.options.beforeOpen.call(_this, _this.elem) === false) {
      return false;
    }
    
    _this.options.overlay.addClass('show');
    _this.elem.addClass('show');
    setTimeout(function() {
      body.addClass('no-scroll');
      _this.openTo(_this.width, _this.options.transitionDuration);
      _this.offset = _this.width;
    }, 1);
    _this.status = 'open';
    
    bindCloseHandlers();
    
    setTimeout(function() {
      _this.options.afterOpen.call(_this, _this.elem);
    }, _this.options.transitionDuration);
  };
  
  this.close = function() {
    if (_this.options.beforeClose.call(_this, _this.elem) === false) {
      return false;
    }
    
    _this.openTo(0, _this.options.transitionDuration);
    _this.offset = 0;
    
    _this.status = 'closed';
    
    unbindCloseHandlers();
    
    setTimeout(function() {
      body.removeClass('no-scroll');
      _this.options.overlay.removeClass('show');
      _this.elem.removeClass('show');
      _this.options.afterClose.call(_this, _this.elem);
    }, _this.options.transitionDuration);
  };
  
  this.options.trigger.on('click', function() {
    if (_this.status === 'open') {
      _this.close();
    } else {
      _this.open();
    }
  });
  
  this.openTo = function(offset, time) {
    if (_this.options.displaceBody) {
      var bodyStyle = {
        'transition-duration': time + 'ms',
        '-webkit-transition-duration': time + 'ms'
      };
      bodyStyle[_this.options.direction] = offset + 'px';
      body.css(bodyStyle);
      
      $('.fixed').each(function() {
        var data = $(this).data('fixedInfo');
        var fixedStyle = {
          'transition-duration': time + 'ms',
          '-webkit-transition-duration': time + 'ms'
        };
        var polarity = (data.leftOrRight === 'left' ? -1 : 1) * (_this.options.direction === 'left' ? -1 : 1);
        fixedStyle[data.leftOrRight] = data.initialValue + (polarity * offset) + 'px';
        $(this).css(fixedStyle);
      });
    }
    
    _this.options.overlay.css({
      'opacity': Math.min(Math.max(offset / _this.width, 0), 1),
      'transition-duration': time + 'ms',
      '-webkit-transition-duration': time + 'ms'
    });
    
    var drawerStyle = {
      'transition-duration': time + 'ms',
      '-webkit-transition-duration': time + 'ms'
    };
    drawerStyle[_this.options.direction] = offset - _this.width + 'px';
    _this.elem.css(drawerStyle);
  };
  
  function bindCloseHandlers() {
    $(document).bind('keyup.offcanvas', function (e) {
      if (e.keyCode == '27') {
        _this.close();
      }
    });
    
    _this.elem.find('.close').bind('click.offcanvas', _this.close);
    _this.options.overlay.bind('click.offcanvas', _this.close);
  }
  
  function unbindCloseHandlers() {
    $(document).unbind('keyup.offcanvas');
    _this.elem.find('.close').unbind('click.offcanvas');
    _this.options.overlay.unbind('click.offcanvas');
  }
  
  function checkBreakpoint() {
    if (_this.status === 'open' && _this.options.breakpoint !== null) {
      if ($(window).width() > _this.options.breakpoint) {
        _this.close();
      }
    }
  }
  
  function prepareDisplacedElements() {
    if (_this.options.displaceBody) {
      $('.fixed').each(function() {
        var data = {
          leftOrRight: null,
          initialValue: null,
        };
        
        if ($(this).css('left') !== 'auto') {
          data.leftOrRight = 'left';
          data.initialValue = parseInt($(this).css('left'));
        } else if ($(this).css('right') !== 'auto') {
          data.leftOrRight = 'right';
          data.initialValue = parseInt($(this).css('right'));
        }
        
        $(this).data('fixedInfo', data);
      });
      
      var bodyStyle = {};
      bodyStyle[_this.options.direction] = 0;
      body.css(bodyStyle);
    }
  }
  
  function sizeDrawer() {
    var drawerStyle = {};
    drawerStyle['width'] = _this.width + 'px';
    drawerStyle[_this.options.direction] = -_this.width + 'px';
    _this.elem.css(drawerStyle);
    
    if (_this.status === 'open') {
      _this.openTo(_this.width, 0);
    }
  }
  
  function calculateWidth() {
    switch(typeof _this.options.width) {
      case 'function':
        var value = _this.options.width.call(_this, _this.elem);
        if (typeof value === 'number') {
          _this.width = value;
        } else if (typeof value === 'string') {
          _this.width = (parseInt(value) / 100) * body.width();
        }
        break;
      case 'string':
        _this.width = (parseInt(_this.options.width) / 100) * body.width();
        break;
      case 'number':
        _this.width = _this.options.width;
        break;
    }
  }
  
  prepareDisplacedElements();
  calculateWidth();
  sizeDrawer();
  
  $(window).on('resize.offcanvas', function() {
    checkBreakpoint();
    calculateWidth();
    sizeDrawer();
  });
};
