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
    beforeOpen: function() {},
    afterOpen: function() {},
    beforeClose: function() {},
    afterClose: function() {}
  }, options);
  
  this.open = function() {
    
    if (_this.options.beforeOpen.call(_this, _this.elem) === false) {
      return false;
    }
    
    body.addClass('no-scroll');
    _this.options.overlay.addClass('animate');
    _this.elem.addClass('show');
    setTimeout(function() {
      _this.options.overlay.addClass('show');
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
    
    body.removeClass('no-scroll');
    _this.options.overlay.removeClass('show');
    
    _this.openTo(0, _this.options.transitionDuration);
    _this.offset = 0;
    
    _this.status = 'closed';
    
    unbindCloseHandlers();
    
    setTimeout(function() {
      _this.options.overlay.removeClass('animate');
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
    body.css({
      'right': offset + 'px',
      'transition-duration': time + 'ms',
      '-webkit-transition-duration': time + 'ms'
    });
    $('.fixed').each(function() {
      var data = $(this).data('fixedInfo');
      if (data.leftOrRight === 'left') {
        $(this).css('left', data.initialValue - offset);
      } else if (data.leftOrRight === 'right') {
        $(this).css('right', data.initialValue + offset);
      }
      $(this).css({
        'transition-duration': time + 'ms',
        '-webkit-transition-duration': time + 'ms'
      });
    });
    _this.elem.css({
      'right': offset - _this.width + 'px',
      'transition-duration': time + 'ms',
      '-webkit-transition-duration': time + 'ms'
    });
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
  
  function prepareFixedElements() {
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
  }
  
  function sizeDrawer() {
    _this.elem.css({
      'width': _this.width + 'px',
      'right': -_this.width + 'px'
    });
    
    if (_this.status === 'open') {
      _this.openTo(_this.width, 0);
    }
  }
  
  function calculateWidth() {
    switch(typeof _this.options.width) {
      case 'function':
        _this.width = _this.options.width.call(_this, _this.elem);
        break;
      case 'string':
        _this.width = (parseInt(_this.options.width) / 100) * body.width();
        break;
      case 'number':
        _this.width = _this.options.width;
        break;
    }
  }
  
  prepareFixedElements();
  calculateWidth();
  sizeDrawer();
  
  $(window).on('resize.offcanvas', function() {
    checkBreakpoint();
    calculateWidth();
    sizeDrawer();
  });
};
