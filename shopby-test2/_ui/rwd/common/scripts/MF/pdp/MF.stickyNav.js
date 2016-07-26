;(function($, breakpoint) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        addToBtn: ".btn--add-to-basket, #contactUsButton",
        productContainer: "[data-product='main']",
        wrapperClass: "sticky__nav__wrapper"
    };

    MF.stickyNav = (function() {
        var options,
            stHeight,
            addToBtnOffsetTop,
            $productContainer,
            $headerContainer,
            enabled;

        var initStickyNav = function() {
            var scrtop = $(window).scrollTop();

            if (scrtop > addToBtnOffsetTop && enabled) {
                stick();
            } else {
                unstuck();
            }
        };

        var stick = function() {
            if ($productContainer.hasClass("is-stuck")) {
                return;
            }

            if (breakpoint.getActive() === breakpoint.MOBILE || breakpoint.getActive() === breakpoint.TABLET) {
                return;
            }

            $headerContainer.css("margin-bottom", $productContainer.height()+30);
            $productContainer.addClass("is-stuck");
        };

        var unstuck = function() {
            $productContainer.removeClass("is-stuck");
            $headerContainer.css("margin-bottom", 0);
        };

        var stickEnable = function() {
            enabled = true;
        };

        var stickDisable = function() {
            enabled = false;
        };

        var init = function(opts) {
            options = $.extend({}, defaults, opts);
            $productContainer = $(options.productContainer, $(".no-touch"));
            stHeight = $productContainer.height();
            $headerContainer = $productContainer.siblings(".pdp__header");
            enabled = true;

            if($(options.addToBtn, $productContainer).exists() && enabled) {
                addToBtnOffsetTop = $(options.addToBtn, $productContainer).offset().top;
                $productContainer.wrapInner("<div class='"+ options.wrapperClass +"'></div>");

                $(window).scroll(function() {
                    initStickyNav();
                });
            }
        };

        return {
            init: init,
            enable: stickEnable,
            disable: stickDisable
        };
    }());

    window.MF = MF;
}(jQuery, MF.breakpoint));

MF.stickyNav.init();