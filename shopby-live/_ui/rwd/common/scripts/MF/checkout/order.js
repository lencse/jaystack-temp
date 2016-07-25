;(function($, window, mediator, cardDetails) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            placeOrder: "/ajax/checkout/placeOrder",
            placeOrderAndValidatePayerAuth: "/ajax/checkout/placeOrderWithPayerAuthValidate"
        }
    };

    MF.order = (function() {

        var options;

        var placeOrder = function() {
            return $.post(options.url.placeOrder, cardDetails.getCardDetailsForm().serialize());
        };

        var placeOrderAndValidatePayerAuth = function(signedPaRes) {
            return $.post(options.url.placeOrderAndValidatePayerAuth, {
                "signedPaRes": signedPaRes
            });
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);
        };

        return {
            init: init,
            placeOrder: placeOrder,
            placeOrderAndValidatePayerAuth: placeOrderAndValidatePayerAuth
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.cardDetails));

if ($("#checkoutReviewAndPay").length !== 0) {
    MF.order.init();
}
