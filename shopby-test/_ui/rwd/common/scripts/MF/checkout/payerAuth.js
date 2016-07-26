/*
 *  requires jQuery
 */
;(function($, window) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {};

    MF.payerAuth = (function() {

        var options;

        var $paReqForm, $payerAuthValidation;

        var callbacks = {
            onPaResReady: $.Callbacks("unique stopOnFalse")
        };

        var submitPAReqForm = function(paReqData) {
            var paReqForm = $paReqForm.get(0);

            paReqForm.action = paReqData.acsUrl;
            paReqForm.elements["PaReq"].value = paReqData.paReq;
            paReqForm.elements["MD"].value = paReqData.merchantData;
            paReqForm.elements["TermUrl"].value = paReqData.termUrl;

            paReqForm.submit();
        };

        var openPopup = function() {
            MF.overlay.openWithElement({
                element: ".checkout__payer-auth-popup",
                modal: true
            });
        };

        var closePopup = function() {
            MF.overlay.close();
        };

        var showAuthWindow = function(paReqData) {
            openPopup();

            submitPAReqForm(paReqData);
        };
       
        var publishPaRes = function(paResData) {
            callbacks.onPaResReady.fire(paResData);

            closePopup();
        };

        var initObjects = function() {
            $payerAuthValidation = $(".checkout__payer-auth-popup");
            $paReqForm = $payerAuthValidation.find("form");
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            if ($("#checkoutReviewAndPay").exists()) {
                initObjects();
            }
        };

        return {
            init: init,
            callbacks: callbacks,
            showAuthWindow: showAuthWindow,
            publishPaRes: publishPaRes
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.payerAuth.init();
