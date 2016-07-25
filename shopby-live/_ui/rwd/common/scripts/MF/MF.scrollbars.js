(function($, mCustomScrollbar) {
  'use strict';

  var MF = window.MF || {};
  var $myWindow = $(window);
  var defaults = {
    horizontalScroll: false,
    autoDraggerLength: true,
    theme: "dark-thick",
    mouseWheel: {
      enable: true
    }
  }
  MF.scrollBars = (function(window, undefined) {

    function init() {

      var dataAttr = $('[data-mf-scrollbar]');

      $.each(dataAttr, function() {
        var $this = $(this),
          dataSetting = _getConfig($this),
          data = $.extend({}, defaults, dataSetting);

        if (!data.target || !$("[data-mf-target=" + data.target + "]").length) {
          return;
        }

        // need to apply setting!
        if (data.horizontalScroll) {
          centerScrollBar(data);
        } else {
          _buildScrollBar(data);
        }

      });
    }

    function destroy(data) {
      var $el = $("." + data);
      $el.mCustomScrollbar("destroy");
    }

    function update(data) {
      var $el = $("." + data);
      $el.mCustomScrollbar("update");
    }

    function centerScrollBar(data) {

      $("[data-mf-target=" + data.target + "]").mCustomScrollbar({
        horizontalScroll: data.horizontalScroll,
        theme: data.theme,
        mouseWheel: {
          enable: false
        }
      });

          var $sliderEl = $("[data-mf-target=" + data.target + "]");
          var $wrapperEl = $('.ph-tpl__slider__wrapper');

          var $elLenght = $wrapperEl.children().length;
          var $elwidth = 325;
          var $fullWrapperEl = (($elwidth + 20) * $elLenght)+20;
          var $scrollBarHandleWidth = $('.mCSB_dragger_bar').width();


            $wrapperEl.width($fullWrapperEl);
            var $thisWindow = $myWindow.innerWidth();
            var $wrapperElSize = $wrapperEl.width();
            var $size = (($wrapperElSize-$thisWindow)+($scrollBarHandleWidth*4))/$elLenght;

          clearTimeout(waitScrollbar);
          var waitScrollbar = setTimeout(function(){

            $("[data-mf-target=" + data.target + "]").mCustomScrollbar("scrollTo", $size, {
              moveDragger: true,
              autoDraggerLength: false
            });

          }, 100);
    }
    function _buildScrollBar(data) {
      $("[data-mf-target=" + data.target + "]").mCustomScrollbar({
          horizontalScroll: data.horizontalScroll,
          autoDraggerLength: data.autoDraggerLength,
          theme: data.theme,
          mouseWheelPixels:4,
          scrollInertia:150,
          mouseWheel:true
      });
    }

    function _getConfig(dataAttr) {
      if (dataAttr.data("mf-scrollbar")) {

        var _dataConfig = dataAttr.data("mf-scrollbar").split(","),
          i = 0,
          length = _dataConfig.length,
          _dataSetting = {};

        for (; i < length; i++) {
          _dataSetting[_dataConfig[i].split(":")[0]] = _dataConfig[i].split(":")[1];
        }
        return _dataSetting;
      }
    }
    return {
      init: init,
      destroy: destroy,
      update: update,
      centerScrollBar:centerScrollBar

    };
  })();

  window.MF = MF;

}(jQuery, $.fn.mCustomScrollbar));