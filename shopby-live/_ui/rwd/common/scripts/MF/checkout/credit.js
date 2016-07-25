;(function($, window, document, mediator, partCreditValidator) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            applyCredit : "/ajax/checkout/credit/apply",
            setCreditPaymentInfo : "/ajax/checkout/payment/credit/setCreditPayment",
            setPartCreditPaymentInfo : "/ajax/checkout/payment/credit/setPartCreditPayment",
            clearPaymentInfo : "/ajax/checkout/payment/credit/clear",
            creditSectionData : "/ajax/checkout/credit/get/section/data"
        },
        data: {
            root: "data",
            checkoutCredit: "credit",
            cardDetails: "cardDetails"
        },
        inEvents: {
            checkoutInit: "checkout:init",
            deliveryMethodChanged : "checkout:delivery:method:changed"
        },
        outEvents: {
            creditApplied: "checkout:credit:applied"
        }
    };

    MF.credit = (function() {

        var paymentModes = {
            credit: "credit",
            creditcard: "creditcard",
            partcredit: "partcredit"
        };

        var cartTotal, newCardDetails, billingAddress, maxCreditAmount, selectedPaymentMode;

        var onCheckoutInit = function(data) {
            var checkoutCreditData = data[defaultOptions.data.root][defaultOptions.data.checkoutCredit];
            var cardDetailsData = data[defaultOptions.data.root][defaultOptions.data.cardDetails];

            selectedPaymentMode = cardDetailsData.selectedPaymentMode;

            handleCreditPaymentOptions(checkoutCreditData);

            syncInputFocusWithRadioBtn();
        };

        var syncInputFocusWithRadioBtn = function(){
            var $partCreditAmount = $("#partCreditAmount");

            $partCreditAmount.on("focus", function() {
                $("#partcredit").prop("checked", true).trigger('click');
            });

            partCreditAmountForm().submit(function (e) {
                $partCreditAmount.blur();
                e.preventDefault();
            });
        };

        var initPaymentDetails = function() {
            newCardDetails = $("#checkoutPaymentDetails");
            billingAddress = $(".billing-address-block");
        };

        var handleCreditPaymentOptions = function(checkoutCreditData) {
            var paymentMode = paymentModes.creditcard;

            if(checkoutCreditData.creditLimit > 0) {
                populateTotalLine(checkoutCreditData);
                populateCurrencySymbol(checkoutCreditData);
                $("#partCreditPayment").show();

                if(checkoutCreditData.creditLimit >= checkoutCreditData.cartTotal) {
                    $("#creditPayment").show();
                    paymentMode = paymentModes.credit;
                } else {
                    $("#creditPayment").hide();
                }

            } else {
                $("#paymentMethod").hide();
                $("#paymentMethod").parent().addClass("chk__noCredit");
            }

            selectPaymentMode(paymentMode);
        };

        var selectPaymentMode = function(paymentMode) {
            $("input:radio[name='payment'][value='" + paymentMode + "']").click();
        };

        var populateTotalLine = function(checkoutCreditData) {
            var totalLine = $("#totalLine");
            var totalLineTemplate = Handlebars.compile($('#totalLineTemplate').html());

            cartTotal = checkoutCreditData.cartTotal;
            maxCreditAmount = Math.min(checkoutCreditData.creditLimit, cartTotal);

            totalLine.empty();

            totalLine.append(totalLineTemplate({
                "creditLimit" : checkoutCreditData.formattedCreditLimit,
                "cartTotal" : checkoutCreditData.formattedCartTotal,
                "currencySymbol" : checkoutCreditData.currency.symbol,
                "hasCredit" : checkoutCreditData.creditLimit > 0
            }));

        };

         var populateCurrencySymbol = function(checkoutCreditData) {
            var currencySymbolIcon = $("#currencySymbol");
            var currencySymbolTemplate = Handlebars.compile($('#currencySymbolTemplate').html());

            currencySymbolIcon.empty();

            currencySymbolIcon.append(currencySymbolTemplate({
                "currencySymbol" : checkoutCreditData.currency.symbol
            }));
        };

        var handlePaymentOptionSelected = function() {
            selectedPaymentMode = $(this).val();

            switch (selectedPaymentMode) {
                case (paymentModes.credit):
                    hideCardAndBillingAddress();
                    setCreditPaymentInfo();
                    break;
                case (paymentModes.partcredit):
                    showCardAndBillingAddress();
                    setPartCreditPaymentInfo();
                    break;
                default:
                    showCardAndBillingAddress();
                    clearPaymentInfo();
            }

            clearValidationMessages();
        };

        var hideCardAndBillingAddress = function() {
            newCardDetails.hide();
            billingAddress.hide();
        };

        var showCardAndBillingAddress = function() {
            newCardDetails.show();
            billingAddress.show();
        };

        var clearValidationMessages = function() {
            var form = partCreditValidator.validate(partCreditAmountForm(), maxCreditAmount);

            // jquery.validate returns undefined when .length of the jquery object is 0. Account for that
            if(form) {
                form.resetForm();
            }
        };

        var partCreditAmountForm = function() {
            return $("#partCreditAmountForm");
        };

        var applyCredit = function() {
            if(cartTotal != null && cartTotal == $("#partCreditAmount").val()) {
                selectPaymentMode(paymentModes.credit);
            }
            if(isPartCreditPayment()) {
                var isPartCreditAmountValid = partCreditValidator.validate(partCreditAmountForm(), maxCreditAmount).form();

                if(isPartCreditAmountValid) {
                    return $.post(defaultOptions.url.applyCredit, {
                        "amount" : getCreditAmount()
                    });
                } else {
                    throw new Error("Part Credit Payment Amount Is Invalid");
                }

            } else if(isFullCreditPayment()) {
                return $.post(defaultOptions.url.applyCredit, {
                    "amount" : getCreditAmount()
                });
            }

            return $.Deferred().resolve();
        };

        var getSelectedPaymentMode = function() {
            return selectedPaymentMode;
        };

        var isFullCreditPayment = function() {
            return selectedPaymentMode === paymentModes.credit;
        };

        var isPartCreditPayment = function() {
            return selectedPaymentMode === paymentModes.partcredit;
        };

        var getCreditAmount = function() {
            if(isFullCreditPayment()) {
               return cartTotal;
            } else if(isPartCreditPayment()){
                return $("#partCreditAmount").val();
            } else {
                return 0;
            }
        };

        var setCreditPaymentInfo = function() {
            return  $.post(defaultOptions.url.setCreditPaymentInfo, {})
               .fail(function() {
                   console.error("Cannot set credit payment info");
               });
        };

        var setPartCreditPaymentInfo = function() {
            return  $.post(defaultOptions.url.setPartCreditPaymentInfo, {})
               .fail(function() {
                   console.error("Cannot set part-credit payment info");
               });
        };

        var clearPaymentInfo = function() {
            return  $.post(defaultOptions.url.clearPaymentInfo, {})
               .fail(function() {
                   console.error("Cannot clear payment info");
               });
        };

        var onCreditDataFetched = function(crediData) {
            handleCreditPaymentOptions(crediData);
        };

        var resetCreditSectionOnTotalUpdate = function() {
            return $.getJSON(defaultOptions.url.creditSectionData)
               .then(onCreditDataFetched)
               .fail(function() {
                   console.error("Cannot get credit checkout section data");
               });
        };

        var bindEvents = function() {
            $("input:radio[name=payment]").on("click", handlePaymentOptionSelected);
        };

        function init() {
            bindEvents();

            initPaymentDetails();

            $(function() {
                mediator.subscribe(defaultOptions.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(defaultOptions.inEvents.deliveryMethodChanged, resetCreditSectionOnTotalUpdate);
            });
        }

        return {
            init: init,
            getSelectedPaymentMode: getSelectedPaymentMode,
            applyCredit: applyCredit
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.checkout.mediator, MF.partCreditValidator));

if ($("#checkoutReviewAndPay").length !== 0) {
    MF.credit.init();
}
