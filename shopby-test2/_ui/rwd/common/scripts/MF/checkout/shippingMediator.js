/*
 *  requires
 */

;(function($, window, newAddress, giftMessage, packageType, shippingAddressForm) {
    "use strict";

    var MF = window.MF || {};
    var ADDRESS_TYPE = "delivery";

    var defaultOptions = {
        data: {
            root: "data"
        }
    };

    MF.shippingMediator = (function() {

        var options;

        var $continueButton;

        var onContinueButtonClick = function() {
            var checkoutReviewAndPayUrl = $(this).data("review-and-pay-url");

            window.location = checkoutReviewAndPayUrl;
        };

        var initShippingObjects = function() {
            $continueButton = $("#continueBtn");
        };

        var bindEvents = function() {
            $continueButton.on("click", onContinueButtonClick);
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initShippingObjects();

            bindEvents();

            $(function() {
                shippingAddressForm.show();

                giftMessage.loadGiftMessageData();

                packageType.loadPackageTypes();
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.newAddress, MF.giftMessage, MF.packageType, MF.shippingAddressForm));

if ($('#checkoutShipping').length !== 0) {
    MF.shippingMediator.init();
}
