/*
 *  requires
 */

;(function($, window) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {};

    MF.orderHistory = (function() {

        var options;

        var orderHistory, orderRow, legacyOrders, legacyOrdersUrl;

        var initOrderHistoryObjects = function() {
            orderHistory = $(".acc__history");
            orderRow = orderHistory.find(".order__row");
            legacyOrders = $(".acc__content__previous-orders");
            legacyOrdersUrl = legacyOrders.data("mf-legacy-url");
        };

        var toggleOrderPreview = function(e){
            e.preventDefault();
            var order_row = $(this).parent();
            var order_details = order_row.next();

            order_row.find(".order__row-preview").toggleClass("active");
            order_details.slideToggle();
        };

        var closeLegacyOrdersOverlay = function(){
            if( $(".mfp-close").length !== 0 ){
                $(".mfp-close").trigger( "click");
            }
        };

        var legacyOrderHistory = function(){
            if (legacyOrders.exists()) {

                MF.overlay.openWithElement({
                    element: $(".previous-orders-popup")
                });

                $(".acc__content__previous-orders a, .previous__orders__before button").on("click", function(){
                    window.open(legacyOrdersUrl,'previous_orders', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=900,width=1000');
                    closeLegacyOrdersOverlay();
                    return false;
                });

                $(".previous__orders__after button").on("click", function(){
                    closeLegacyOrdersOverlay();
                });
            }
        };

        var init = function (opts) {
            options = $.extend({}, defaultOptions, opts);

            $(function() {
                if ($(".acc__history").exists()) {
                    initOrderHistoryObjects();
                    legacyOrderHistory();

                    orderRow.on("click.MFOrderHistory", ".order__row-preview, .order__row-date", toggleOrderPreview);

                    var _orderHistory = Breakpoints.on({
                        name: "mobile",
                        matched: function() {
                            orderRow.off("click.MFOrderHistory");
                            orderHistory.find(".order__details").hide();
                            $(".order__row-preview").removeClass("active");
                        },
                        exit: function() {
                            orderRow.on("click.MFOrderHistory", ".order__row-preview, .order__row-date", toggleOrderPreview);
                        }
                    });
                }
            });

        };

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.orderHistory.init();
