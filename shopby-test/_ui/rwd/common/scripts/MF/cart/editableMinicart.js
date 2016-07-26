/*
 *  No Dependencies
 */

;(function($, window, document, breakpoint) {
    "use strict";

    var MF = window.MF || {};

    MF.carouselMiniCart = (function() {

        var $carouselMiniCart, $bxSlider, currentSliderIndex;
        var cartActions, rolloverPopupUrl;

        function bindCarouselMiniCart() {

            $("#editableMiniCartLink").click(function(e) {
                e.preventDefault();

                if ($carouselMiniCart.hasClass("open")) {
                    closeCarouselMiniCart();
                } else {
                    openCarouselMiniCart();
                }
            });

            $($carouselMiniCart).on("click", ".close-icon", function(e) {
                e.preventDefault();

                closeCarouselMiniCart();
            });

            breakpoint.callbacks.onExit.add(function(breakpointName) {
                if (breakpointName === MF.breakpoint.MOBILE) {
                    closeCarouselMiniCart();
                }
            });
        }

        function initCarouselMiniCart() {
            initCartActions();

            bindCartActions();

            initBxSlider();
        }

        function alignSlideWidth() {
            setTimeout(function() {
                var slideSize = $(".bx-wrapper").width();
                $(".carousel-mini-cart-list__item").css({
                    "width": slideSize
                });
            }, 50);
        }

        function initBxSlider() {
            $bxSlider = $(".carousel-mini-cart-list").bxSlider({
                mode: "horizontal",
                infiniteLoop: false,
                startSlide: currentSliderIndex,
                pager: false,
                controls: true,
                nextSelector: "#right-arrow",
                prevSelector: "#left-arrow",
                nextText: "",
                prevText: "",

                onSlideAfter: function($slideElement, oldIndex, newIndex) {
                    currentSliderIndex = newIndex;
                },

                onSliderLoad: function() {
                    if(!$carouselMiniCart.hasClass("open")) {
                        alignSlideWidth();
                    }
                }
            });
        }

        function fetchCarouselMiniCartData() {
            return $.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
                url: rolloverPopupUrl,
                cache: false,
                type: "GET"
            });
        }

        function responseHasCartItems(response) {
            return response && $(".carousel-mini-cart-list", response).length > 0;
        }

        mediator.subscribe("cart:product:added", function(data) {
            if(MF.breakpoint.getActive() == 'mobile') {
                openCarouselMiniCart();
                $(window).scrollTop(0);
            }
        });

        function openCarouselMiniCart() {
            currentSliderIndex = 0;

            fetchCarouselMiniCartData().then(function(result) {

                if (responseHasCartItems(result)) {
                    $carouselMiniCart.empty().html(result);

                    initCarouselMiniCart();

                    $carouselMiniCart.slideDown(100).addClass("open");
                }

            });
        }

        function currentlyOnShoppingBagPage() {
            return $(".spb__items-list").exists();
        }

        function refreshCarouselMiniCart() {
            /*
                We should check whether we are on Shopping Bag page.
                In case we are we should reload the page to have cart items and totals updated
            */
            if(currentlyOnShoppingBagPage()) {
                window.location.reload(true);
            }

            fetchCarouselMiniCartData().then(function(result) {
                if (responseHasCartItems(result)) {
                    $carouselMiniCart.empty().html(result);
                 
                    initCarouselMiniCart();
                    
                } else {
                    closeCarouselMiniCart();
                }
            });
        }

        function closeCarouselMiniCart() {
            $carouselMiniCart.slideUp(100).removeClass("open").empty();
        }

        function initCartActions() {
            cartActions = MF.cartActions();

            cartActions.init({
                cartItemsContainer: ".carousel-mini-cart-list"
            });
        }

        function bindCartActions() {
            cartActions.callbacks.onCartItemRemoved.add(refreshCarouselMiniCart);
            cartActions.callbacks.onCartItemVariantChanged.add(refreshCarouselMiniCart);
            cartActions.callbacks.onCartItemQtyChanged.add(refreshCarouselMiniCart);

            MF.cartWishlist.init();
        }

        function init() {
            $carouselMiniCart = $("#editableMiniCartLayer");
            rolloverPopupUrl = $carouselMiniCart.data("rolloverpopupurl");

            bindCarouselMiniCart();
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.breakpoint));

MF.carouselMiniCart.init();
