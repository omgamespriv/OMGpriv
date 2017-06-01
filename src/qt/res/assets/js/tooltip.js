(function($) {
  "use strict";

  function init(element) {
      if (element === $) {
          element = $('[data-title]');
      }

      if (element === undefined)
          element = this;

      return element.off('mouseenter').on('mouseenter', createTooltip)
  }

  function createTooltip(event) {
      var target  = false,
          tooltip = false,
          data    = false,
          top     = false;

      if($("input, textarea").is(':focus') || $('.iw-contextMenu').css('display') == 'inline-block')
          return;

      event.stopPropagation();

      $("#tooltip").remove();

      target  = $(this),
      data    = target.attr('data-title'),
      tooltip = $('<div id="tooltip"></div>');

      if(!data || data == '')
          return false;

      data = data.replace(/&#013;|\n|\x0A/g, '<br />')

      .replace(/%column%/g, function() {
          return $(target.parents("table").find("thead tr th")[target[0].cellIndex]).text();
      }).replace(/%([.\w\-]+),([.\w\-]+)%/g, function($0, $1, $2){
          return target.children($1).attr($2);
      }).replace(/%([.\w\-]+)%/g, function($0, $1){
          return target.children($1).text();
      });

      tooltip.css('opacity', 0)
             .html(data)
             .appendTo('body');

      if(target.css('cursor') != "pointer" && target.prop("tagName") != "A")
          target.css('cursor', 'help');

      function displayTooltip() {
          if($(window).width() < tooltip.outerWidth() * 1.5)
              tooltip.css('max-width', $(window).width() / 2);
          else
              tooltip.css('max-width', 340);

          var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
              pos_top  = target.offset().top - tooltip.outerHeight() - 20;

          if(pos_left < 0)
          {
              pos_left = target.offset().left + target.outerWidth() / 2 - 20;
              tooltip.addClass('left');
          }
          else
              tooltip.removeClass('left');

          if(pos_left + tooltip.outerWidth() > $(document).width())
          {
              pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
              tooltip.addClass('right');
          }
          else
              tooltip.removeClass('right');

          if(pos_left + target.outerWidth() > $(document).width())
          {
              pos_left = event.pageX;
              tooltip.removeClass('left right');
          }

          if(pos_top < 0)
          {
              pos_top = target.offset().top + target.outerHeight() + 25;
              tooltip.addClass('top');
              top = true;
          }
          else
              tooltip.removeClass('top');

          tooltip.css({left: pos_left, top: pos_top})
                 .animate({top: (top ? '-' : '+') + '=10', opacity: 1}, 100);
      };

      displayTooltip();
      $(window).resize(displayTooltip);

      function removeTooltip() {
          tooltip.animate({top: (top ? '+' : '-') + '=10', opacity: 0}, 100, function() {
              $(this).remove();
          });
      };

      target.on('contextmenu mouseleave', removeTooltip);
  }

  $.fn.tooltip = init;
})(jQuery);

jQuery($.fn.tooltip);
