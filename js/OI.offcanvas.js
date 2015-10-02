(function($){
  $.fn.offcanvas = function(options) {
    return this.each(function() {
      new OffCanvas($(this), options);
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
    overlay: $('.offcanvas-overlay')
  }, options);
  
  this.open = function() {
    body.addClass('animate-drawer');
    _this.elem.addClass('animate');
    setTimeout(function() {
      body.addClass('open-drawer');
      _this.elem.addClass('show');
    }, 1);
    _this.status = 'open';
  };
  
  this.close = function() {
    body.removeClass('open-drawer');
    _this.elem.removeClass('show');
    setTimeout(function() {
      body.removeClass('animate-drawer');
      _this.elem.removeClass('animate');
    }, 500);
    _this.status = 'closed';
  };
  
  this.options.trigger.on('click', function() {
    if (_this.status === 'open') {
      _this.close();
    } else {
      _this.open();
    }
  });
};
