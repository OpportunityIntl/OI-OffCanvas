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
    
    body.addClass('animate-drawer');
    _this.elem.addClass('animate');
    setTimeout(function() {
      body.addClass('open-drawer');
      _this.openTo(_this.options.width, _this.options.transitionDuration);
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
    
    body.removeClass('open-drawer');
    _this.elem.removeClass('show');
    
    _this.openTo(0, _this.options.transitionDuration);
    
    _this.status = 'closed';
    
    unbindCloseHandlers();
    
    setTimeout(function() {
      body.removeClass('animate-drawer');
      _this.elem.removeClass('animate');
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
    $('.fixed').css({
      'right': offset + 'px',
      'transition-duration': time + 'ms',
      '-webkit-transition-duration': time + 'ms'
    });
    _this.elem.css({
      'right': offset - _this.options.width + 'px',
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
  
  _this.elem.css({
    width: _this.options.width + 'px',
    right: -_this.options.width + 'px'
  });
  
  $(window).on('resize.offcanvas', function() {
    checkBreakpoint();
  });
};
