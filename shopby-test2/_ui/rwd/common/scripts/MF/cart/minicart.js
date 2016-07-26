/*
 *  No Dependencies
 */

;(function ($, window, document, shoppingBag, breakpoint) {
    "use strict";

    var MF = window.MF || {};

    MF.minicart = (function () {

        var defaults = {
            layer: $("#miniCartLayer")
        };

        var $currentContainer,
            $minicartContainer,
            $minicartIcon;

        function bindMiniCart() {
            $minicartIcon = $(".miniCart");

            $minicartIcon.hoverIntent(showMiniCart, function(){
                closeMiniCart();
            });

            // TODO Here we use global variable 'mediator' which is a bad idea.
            // Instead we should use a common mediator instance per application.
            mediator.subscribe("cart:product:added", function(data) {
                showAndHideMinicart();
            });

            mediator.subscribe("cart:product:removed", refreshMiniCartCount);
        }

        function showAndHideMinicart() {
            showMiniCart();

            _.delay(function() {
                closeMiniCart();
            }, 3000);
        }

        function showMiniCart() {
            $currentContainer = $minicartIcon.exists() ? $minicartIcon.parent() : $("body");
            $minicartContainer = $currentContainer.find(".mini-cart-rollover-wrapper");

            $($minicartContainer).each(function() {
                var $that = $(this);
                refreshMiniCartCount();

                if ($that.parent().isOnScreen() && $that.parent().is(":visible")) {
                    if ($that.data("hover")) {
                        return;
                    }

                    getMiniCartData(fadeMinicart.bind($that));
                }
            });
        }

        function fadeMinicart() {
            $(this).fadeIn(function() {
                MF.scrollBars.init();
                $(this).data("hover", true);
            });
        }

        var closeMiniCart = function() {
            $minicartContainer.fadeOut(function() {
                $minicartContainer.data("hover", false);
            });
        };

        function getMiniCartData(callback) {
            $.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
                url: $minicartContainer.attr("data-rolloverPopupUrl"),
                cache: false,
                type: 'GET',
                success: function (result) {
                    if (result.length > 0 && $(".mini-cart-rollover-list", result).length > 0) {
                        $minicartContainer.empty().html(result);
                        callback();
                    }
                }
            });
        }

        function refreshMiniCartCount() {
            var url = ($minicartContainer ? $minicartContainer.attr("data-refreshMiniCartUrl") : "/ajax/headerdata/?");

            $.ajax({
                dataType: "json",
                url: url + Math.floor(Math.random() * 101) * (new Date().getTime()),
                success: function (data)
                {
                    $(".shoppingCartCount").html(data.shoppingCartCount);
                    $(".miniCart .price").html(data.miniCartPrice);
                    defaults.layer.data("needRefresh", true);
                }
            });
        }

        return {
            bindMiniCart: bindMiniCart,
            refreshMiniCartCount: refreshMiniCartCount,
            showMiniCart: showMiniCart,
            showAndHideMinicart: showAndHideMinicart,
            closeMiniCart: closeMiniCart
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.shoppingBag, MF.breakpoint));

MF.minicart.bindMiniCart();
