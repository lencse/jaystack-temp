;(function($) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        zoomImage: "[data-zoom]"
    };

    MF.imageZoom = (function() {
        var options,
            $zoomImage,
            $stlProductContainer;

        var initZoom = function() {
            $zoomImage.each(function() {
                var $that = $(this);
                $that.wrap("<span class='zoom-wrapper'></span>")
                .css("display", "block").parent()
                .zoom({
                    url: $that.data("zoom"),
                    on: "click",
                    touch: true
                });
            });
        };

        var destroyZoom = function() {
            $zoomImage.each(function() {
                var $that = $(this);
                    $that.trigger("zoom.destroy");
            });
        };

        var init = function(opts) {
            options = $.extend({}, defaults, opts);
            $zoomImage = $(options.zoomImage);
            $stlProductContainer = options.stlContainer;
            initZoom();
        };

        return {
            init: init,
            destroy: destroyZoom
        };
    }());

    window.MF = MF;

}(jQuery));
