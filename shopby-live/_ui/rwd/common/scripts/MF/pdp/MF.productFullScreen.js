;
(function($, window, document, fsSlider, variantSelector, addToBagForm) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        fullScreenEnableBtn: "#enableFullScreen",
        fullScreenCloseBtn: "#closeFullScreen",
        fullScreenContainer: "#fullScreenContainer"
    };

    MF.productFullscreen = (function() {

        var options;

        var enableFullScreen = function() {
            $(options.fullScreenContainer).addClass("active");
            $("html, body").scrollTop(0);

            showScrollBars(false);
            fsSlider.init();
        };

        var disableFullScreen = function() {
            $(options.fullScreenContainer).removeClass("active");
            showScrollBars(true);
            fsSlider.unslick();
        };

        var showScrollBars = function(isScrollable) {
            $("body").toggleClass("fsActive", !isScrollable);
        };

        var init = function(opts) {
            options = $.extend({}, defaults, opts);

            $(document).ready(function() {
                $(options.fullScreenEnableBtn).on("click", enableFullScreen);
                $(options.fullScreenCloseBtn).on("click", disableFullScreen);
            });

            Breakpoints.on({
                name: "mobile",
                matched: disableFullScreen
            });

            var selector = variantSelector();
            var addToBag = addToBagForm();

            selector.init($("#fullScreenContainer"));
            addToBag.init($("[data-cart-form='true']", "#fullScreenContainer"), selector);
        };

        return {
            init: init,
            enable:  enableFullScreen,
            disable: disableFullScreen
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.fsSlider, MF.variantSelector, MF.addToBagForm));

MF.productFullscreen.init();