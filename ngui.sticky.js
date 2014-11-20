(function(window, document, undefined) {

  var module = angular.module('ngui.sticky', []);

  module.directive('uiSticky', function() {

    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {

        var $wnd = angular.element(window)
          , $parent = $element.parent()
          , yPadding = $attrs.yPadding || 16
          , _el = $element[0]
          , enabled = true;

        var oldY, windowHeight, updating = false;

        function reinit() {
          var _float = window.getComputedStyle(_el).float;
          // TODO add configurable activation
          var _enabled = _float == 'left' || _float == 'right';
          // Handle special case where "switching" occurs
          if (enabled != _enabled)
            $element.removeAttr('style');
          // Recalc dimensions
          enabled = _enabled;
          oldY = 0;
          windowHeight = window.innerHeight;
          redraw();
        }

        function redraw() {
          if (!enabled) return;
          var newY = oldY;
          var elementBox = _el.getBoundingClientRect();
          var parentBox = $parent[0].getBoundingClientRect();
          var boundTop = Math.max(-parentBox.top + yPadding, 0);
          var boundBottom = Math.min(window.innerHeight - parentBox.top - yPadding, parentBox.height);
          var alwaysAtTop = elementBox.height < windowHeight &&
            boundTop + elementBox.height < boundBottom;
          if (boundTop > oldY && boundBottom < oldY + elementBox.height)
            return;
          if (alwaysAtTop || boundTop < oldY) {
            newY = boundTop;
          } else if (boundBottom > oldY + elementBox.height) {
            newY = boundBottom - elementBox.height;
          }
          if (newY != oldY) {
            oldY = newY;
            _el.style.webkitTransform =
              _el.style.MozTransform =
                _el.style.msTransform =
                  _el.style.OTransform =
                    _el.style.transform =
                      'translateY(' + oldY + 'px)';
          }
          if (newY == 0) $element.addClass('atTop');
          else $element.removeClass('atTop');
        }

        function onScroll(ev) {
          if (!updating)
            window.requestAnimationFrame(function() {
              updating = false;
              redraw(ev);
            });
          updating = true;
        }

        reinit();
        $wnd.on('scroll', onScroll);
        $wnd.on('resize', reinit);
        $element.on('$destroy', function() {
          $wnd.off('scroll', onScroll);
          $wnd.off('resize', reinit);
        });

      }
    }

  });

})(window, document);

