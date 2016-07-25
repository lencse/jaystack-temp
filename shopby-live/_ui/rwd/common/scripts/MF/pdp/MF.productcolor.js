;(function($) {
    "use strict";

    var MF = window.MF || {};

    MF.productColor = (function() {
        var $colorContainer,
            $colorContainerMobile,
            coloredProductsTemplate;

        var init = function() {
            $colorContainer = $("#colourProducts");
            $colorContainerMobile = $("#colourProductsTablet");

             if($colorContainer.length) {
                coloredProductsTemplate = Handlebars.compile($("#coloredProductsTemplate").html());

                $(document).ready(function() {
                    renderProductThumbs();
                });
             }
        };

        var renderProductThumbs = function() {
            var productColorData = $colorContainer.data("json");

            $colorContainer.append(coloredProductsTemplate(productColorData));
            $colorContainerMobile.append(coloredProductsTemplate(productColorData));

            highlightCurrentProduct();
        };

        var highlightCurrentProduct = function() {
            var currentProduct = $colorContainer.data("current");
            $(".p-"+currentProduct+"").addClass("active");
        };

        return {
            init: init
        };
    })();

    window.MF = MF;

}(jQuery));

MF.productColor.init();
