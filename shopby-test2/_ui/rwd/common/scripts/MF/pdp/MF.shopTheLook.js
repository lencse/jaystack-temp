;(function($, variantSelector, addToBagForm, imageZoom, breakpoint, pdpImageGallery) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        shopTheLookContainer: "#shopTheLook",
        shopTheLookJSON: "#pdpShopTheLookJSONData",
        shopTheLookScrollContainer: ".stl__scroll-container"
    };

    MF.shopTheLook = (function() {
        var options,
            outfitCode,
            shopTheLookData,
            $shopTheLookContainer,
            $stlProductContainer,
            $shopTheLookScrollContainer,
            $closeButton,
            $shopTheLookJSON,
            $shopTheLookBtn,
            $descriptionContainer;

        var onCloseButtonClick = function() {
            closeShopTheLook();
        };

        var closeShopTheLook = function() {
            $(document).unbind("click.stl");
            imageZoom.destroy();
            $shopTheLookScrollContainer.mCustomScrollbar("destroy");
            $shopTheLookContainer.animate({left: "110%"}, function() {
                if (breakpoint.getActive() == 'mobile') {
                    $('.pdp__description-wrapper .pdp__till').show();
                } else {
                    $descriptionContainer.animate({opacity: 1}, 50);
                }
            }).css("position", "fixed");
        };

        var getShopTheLookProducts = function() {
            if ($shopTheLookJSON.data("stl-json") !== "") {
                return $shopTheLookJSON.data("stl-json");
            }
        };

        var initGlobals = function(opts) {
            options = $.extend({}, defaults, opts);
            $shopTheLookContainer = $(options.shopTheLookContainer);
            $shopTheLookScrollContainer = $(options.shopTheLookScrollContainer);
            $closeButton = $(".close", $shopTheLookContainer);
            $shopTheLookBtn = $(".btn--shop-the-look");
            $shopTheLookJSON = $(options.shopTheLookJSON);
            $descriptionContainer = $(".pdp__description-wrapper");
        };

        var renderProducts = function() {
            var source   = $("#shopTheLookEntryTemplate").html();
            var template = Handlebars.compile(source);
            var data = getOutfitData(outfitCode);

            if(data) {
                $stlProductContainer.html(template(data))
                    .promise()
                    .done(initUI);
            }

            return $shopTheLookContainer;
        };

        var getOutfitData = function(outfitCode) {
            return shopTheLookData[outfitCode];
        };

        var initUI = function() {
            $shopTheLookContainer.css({
                        "top": getHeaderHeight() + 3,
                        "max-height": getDescriptionHeight()
            });
            initAllSelects();
            initScrollBars();
            imageZoom.init({stlContainer: $stlProductContainer});
            MF.productWishlist.init($shopTheLookContainer);
        };

        var getHeaderHeight = function() {
            return $(".header-wrapper__nav").height();
        };

        var getDescriptionHeight = function() {
            return $(".pdp__main-wrapper").height();
        };

        var initAllSelects = function() {

            var outfit = getOutfitData(outfitCode);

            _.each(outfit.products, function(obj) {
                var $container = $(".stlAdd-" + obj.product.code);
                var selector = variantSelector();
                var addToBag = addToBagForm();

                selector.init_shop_the_look($container);
                addToBag.init($("[data-cart-form='true']", $container), selector);
            });
        };

        var initScrollBars = function() {
            if ($shopTheLookScrollContainer.exists()) {
                $shopTheLookScrollContainer.mCustomScrollbar({
                    theme: "dark-thick",
                    scrollInertia: 300
                });
            }
        };

        var initCloseShopTheLook = function() {
            $shopTheLookContainer.css("position", "absolute");
            // $(document).bind("click.stl", function(event) {
            //     if (!$(event.target).closest($shopTheLookContainer).length) {
            //         closeShopTheLook();
            //     }
            // });
        };

        var isOpen = function() {
            return $shopTheLookContainer.is(":visible");
        };

        var onShopTheLookBtnClick = function() {
                shopTheLookData = getShopTheLookProducts();
                $stlProductContainer = $(".stl__container", $shopTheLookContainer);
                outfitCode = (pdpImageGallery.getOutfitCode() ? pdpImageGallery.getOutfitCode() : $shopTheLookJSON.data("default-outfit-code"));
                //We need to replicate the page position going to the top as was before the base path was implemented (the hash link used to do this) when the shop to look button is clicked so we can see the shop to look modal window if we are not at the top of the PDP page.
                window.scrollTo(0,0);
                if (breakpoint.getActive() == 'mobile') {
                    $('.pdp__description-wrapper .pdp__till').hide();
                    renderProducts().animate({left: getPosition()}, 500, initCloseShopTheLook);
                } else {
                    $descriptionContainer.animate({opacity: 0}, 50, function() {
                        renderProducts().animate({left: getPosition()}, 500, initCloseShopTheLook);
                    });
                }
        };

        var getPosition = function() {
            var brPoints = {
                'mobile' : "3.6%",
                'tablet' : "51.6%",
                'desktop' : "50.9%",
                'desktop-large' : "50.9%"
            };

            return brPoints[breakpoint.getActive()];
        };

        var bindEvents = function() {
            $shopTheLookBtn.on("click", onShopTheLookBtnClick);
            $closeButton.on("click", onCloseButtonClick);
        };

        var init = function(opts) {
            initGlobals(opts);
            bindEvents();
            $("body").scrollLeft = 0;

            $( window ).resize(function() {
                if(isOpen()) {
                    $(document).trigger("click.stl");
                }
            });
        };

        return {
            init: init,
            close: closeShopTheLook,
            isOpen: isOpen
        };
    }());

    window.MF = MF;

}(jQuery, MF.variantSelector, MF.addToBagForm, MF.imageZoom, MF.breakpoint, MF.pdpImageGallery));

MF.shopTheLook.init();
