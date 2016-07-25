;(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.productNavigation = (function () {

        var navTemplateScript,
            navTemplate,
            $container = $("#pdpPrevNext"),
            $contentContainer = $("#pdpPrevNext .nav-carousel"),
            productList;

        function init() {

            productList = JSON.parse(window.sessionStorage.getItem("products"));

            if (!_.isEmpty(productList) && containsCurrentProduct(currentProduct, productList)) {
                initCarousel(productList);

                $(".pdp__nav--prev").hover(openPrevPopup);
                $(".pdp__nav--next").hover(openNextPopup);

                $(document).on('click touchstart', function(event) {
                    if (!$(event.target).closest($container).length) {
                        closePopup();
                    }
                });
            } else {
                $container.fadeToggle(0);
            }
        }

        function initCarousel() {
            navTemplateScript = $("#navPrevNextTemplate").html();
            navTemplate = Handlebars.compile(navTemplateScript);

            $contentContainer.empty().html(navTemplate({products: productList}));

            $contentContainer.slick({
                infinite: false,
                arrows: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true
            });
        }

        function containsCurrentProduct(currentProduct, productList) {
            for (var i = 0; i < productList.length; i++) {
                if (currentProduct == productList[i].code) {
                    return true;
                }
            }

            return false;
        }

        function openPrevPopup(e) {
            $container.removeClass("next-open").addClass("prev-open");
        }

        function openNextPopup(e) {
            $container.removeClass("prev-open").addClass("next-open");
        }

        function closePopup() {
            $container.removeClass("prev-open next-open");
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

$(document).ready(function() {
    if ($("#navPrevNextTemplate").exists()) {
        MF.productNavigation.init();
    }
});