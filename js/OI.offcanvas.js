(function($){
  $.fn.offcanvas = function(options) {
    return this.each(function() {
      new OffCanvas($(this), options);
    });
  };
})(jQuery);

var OffCanvas = function(elem, options) {
  var _this = this;
  this.elem = $(elem);

  this.options = $.extend({
    
  }, options);
};
