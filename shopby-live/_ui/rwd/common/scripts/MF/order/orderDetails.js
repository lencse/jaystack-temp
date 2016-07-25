/*
 *  requires
 */

;(function($, window, modal) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            cancelOrder: "/account/order/ajax/cancel"
        }
    };

    MF.orderDetails = (function() {

        var options;

        var cancelOrderModal, cancelOrderConfirmBtn, cancelOrderButton, returnOrderForm, returnItemsButton, amendFraudButton;

        var onReturnItemsButtonClick = function() {
            returnOrderForm.submit();
        };

        var onCancelOrderButtonClick = function() {
            cancelOrderModal.reveal({
                animation: 'fade',
                animationspeed: 500,
                close_on_background_click: true,
                close_on_esc: true
            });
        };
        
        var onFraudAmendOrderButtonClick = function(e) {
        	//TODO Make this ui friendly
        	var r = confirm("Please confirm!");
        	if (r) {
        		var url = $(e.target).data("fraud-amend-order-url");
        		postFraudAmendOrder(url).then(function(data) {
                    if (data.status === "SUCCESS") {
                        location.reload();
                    } else {
                        console.error("Order fraud amend failed");
                    }
                }).fail(function() {
                    console.error("Order fraud amend error");
                });
        	}
        };

        var onCancelOrderConfirmButtonClick = function() {
            var orderCode = $(this).attr("data-order-code");

            postCancelOrder(orderCode).then(function(data) {
                if (data.status === "SUCCESS") {
                    modal.showConfirmation(cancelOrderModal, function() {
                        location.reload();
                    });
                } else {
                    console.error("Order cancel failed");
                }
            }).fail(function() {
                console.error("Order cancel error");
            });
        };

        var postCancelOrder = function(orderCode) {
            return $.post(options.url.cancelOrder, {
                orderCode: orderCode
            });
        };
        
        var postFraudAmendOrder = function(url) {
            return $.post(url);
        };

        var initOrderDetailsObjects = function() {
            cancelOrderModal = $("#cancelOrderModal");
            cancelOrderConfirmBtn = $("#cancelOrderConfirmBtn");
            
            returnOrderForm = $("[name=returnOrderForm]");
            returnItemsButton = $("#returnItemsBtn");

            cancelOrderButton = $("#cancelOrderBtn");
            amendFraudButton = $("#amendFraudBtn");
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initOrderDetailsObjects();

            $(function() {
                cancelOrderButton.on("click", onCancelOrderButtonClick);
                cancelOrderConfirmBtn.on("click", onCancelOrderConfirmButtonClick);

                returnItemsButton.on("click", onReturnItemsButtonClick);
                
                amendFraudButton.on("click", onFraudAmendOrderButtonClick);
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.modal));

MF.orderDetails.init();
