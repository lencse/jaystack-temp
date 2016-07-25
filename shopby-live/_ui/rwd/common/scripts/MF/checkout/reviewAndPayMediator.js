/*
 *  requires
 */
;(function($, window, mediator, order, cardDetails, deliveryAddress,
    billingAddress, payerAuth, requestResult, credit, giftMessage,
    busyOverlay, spinnerHandler, ajaxManager) {

    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        outEvents: {
            checkoutInit: "checkout:init"
        }
    };

    MF.reviewAndPayMediator = (function() {

        var options;

        var $purchaseNowButton, $paymentErrorMessage;

        var checkoutDataReady, documentReady, readyToPlaceOrder = true;

        var getAjaxCheckoutData = function() {
            return $.getJSON("/ajax/checkout/data")
                .fail(function() {
                    console.error("cannot get checkout data");
                });
        };

        var switchOffPurchaseNowBtn = function() {
            $purchaseNowButton.prop('disabled', true).css('opacity', 0.3);
        };

        var switchOnPurchaseNowBtn = function() {
            $purchaseNowButton.prop('disabled', false).css('opacity', 1);
        };

        var onCheckoutDataAndPageReady = function(ajaxCheckoutData) {
            busyOverlay.disable();

            mediator.publish(options.outEvents.checkoutInit, ajaxCheckoutData[0]);

            mediator.subscribe('addressInfo:edit:enterEditMode', switchOffPurchaseNowBtn);
            mediator.subscribe('addressInfo:edit:enterViewMode', switchOnPurchaseNowBtn);
        };

        var enablePurchaseNowButton = function() {
            spinnerHandler.hideSpinner($purchaseNowButton);
            busyOverlay.disable();
        };

        var disablePurchaseNowButton = function() {
            spinnerHandler.showSpinner($purchaseNowButton);
            busyOverlay.enable();
        };

        var reportError = function(msg) {
            return function() {
                $paymentErrorMessage.text(msg).show();
                cardDetails.validateForm();
                transitionToInitialState();
                enablePurchaseNowButton();
            };
        };

        var statusSuccess = function(response) {
            if(response && response.status) {
                return response.status === requestResult.status.SUCCESS;
            }

            return true;
        };

        var transitionTo = function(eventName, msg) {
            return function(response) {
                if(statusSuccess(response)) {
                    PlaceOrderProcess[eventName](msg);
                } else {
                    console.warn("Can not transition to event ", eventName,
                        " because response status reports error", response);
                    transitionToInitialState();
                }
            };
        };

        var redirectToProvidedUrl = function(response) {
            window.location = response.data.redirectTo;
        };

        var transitionToInitialState = function() {
            PlaceOrderProcess.current = "Initial";
            enablePurchaseNowButton();
        };

        var showFailureMessage = function(response) {
            var errorMessage = response.message || "An error occurred during order placement process";
            $paymentErrorMessage.text(errorMessage).show();
        };


        var hideFailureMessage = function() {
            $paymentErrorMessage.text("").hide();
        };

        var showFailureMessageAndTransitionToInitialState = function(response) {
            showFailureMessage(response);
            transitionToInitialState();
        };

        var failureHandlersByReason = {
            "payment_auth_enroll": function(response) {
                PlaceOrderProcess["payerAuthEnrolled"](response.data.paReqData);
            },
            "payment_auth_validate": showFailureMessageAndTransitionToInitialState,
            "payment_authorization_reject": showFailureMessageAndTransitionToInitialState,
            "stock_reservation_failed": redirectToProvidedUrl,
            "general_error": showFailureMessageAndTransitionToInitialState,
            "default": showFailureMessageAndTransitionToInitialState
        };

        var handlePaymentFailure = function(response) {
            var failureHandler = failureHandlersByReason[response.data.reason] || failureHandlersByReason["default"];
            return failureHandler(response);
        };

        var PlaceOrderProcess = StateMachine.create({
            initial: { state: "Initial", event: "start", defer: true },
            error: function(eventName, from, to, args, errorCode, errorMessage, error) {
                console.warn("event " + eventName + " raised an error :- ", errorCode, String(error));

                // Go back to the "Initial" state in case some callback fails
                if(errorCode === StateMachine.Error.INVALID_CALLBACK) {
                    transitionToInitialState();
                }
                enablePurchaseNowButton();
                showHideNewAddressSelected();
            },
            events: [
                { name: "start", from: "Initial", to: "SaveBillingAddress" },
                { name: "saveBillingAddress", from: "Initial", to: "SaveBillingAddress" },
                { name: "applyCredit", from: "SaveBillingAddress", to: "ApplyCredit" },
                { name: "saveCardDetailsWithoutAddress", from: "SaveBillingAddress", to: "PlaceOrder" },
                { name: "saveCardDetails", from: "ApplyCredit", to: "SaveCardDetails" },
                { name: "placeOrder", from: "SaveCardDetails", to: "PlaceOrder" },
                { name: "placeOrderWithoutAddress", from: "SaveCardDetailsWithoutAddress", to: "PlaceOrderWithoutAddress" },
                { name: "payerAuthEnrolledWithoutAddress", from: "PlaceOrderWithoutAddress", to: "PayerAuthEnrolledWithoutAddress" },
                { name: "payerAuthValidateWithoutAddress", from: "PayerAuthEnrolledWithoutAddress", to: "PayerAuthValidateWithoutAddress" },
                { name: "payerAuthEnrolled", from: "PlaceOrder", to: "PayerAuthEnrolled" },
                { name: "payerAuthValidate", from: "PayerAuthEnrolled", to: "PayerAuthValidate" }
            ],
            callbacks: {
                onInitial: function() {
                    PlaceOrderProcess.saveBillingAddress();
                },
                onleaveInitial: function() {
                    hideFailureMessage();
                },
                onSaveBillingAddress: function() {
                	if(isGiftCardOnly == true && $('#credit').is(':checked')){
                		credit.applyCredit()
                        .then(transitionTo("saveCardDetailsWithoutAddress"))
                        .fail(reportError("Apply Credit Failed"));
                	}
                else {
                	try {
                        billingAddress.save()
                            .then(transitionTo("applyCredit"))
                            .fail(reportError("Save Billing Address Failed"));
                    } catch (e) {
                        (reportError("Save Billing Address Failed"))();
                    }
                }
                },
                onApplyCredit: function() {
                    credit.applyCredit()
                        .then(transitionTo("saveCardDetails"))
                        .fail(reportError("Apply Credit Failed"));
                },
                onSaveCardDetailsWithoutAddress: function() {
                    cardDetails.save()
                    .then(requestResult.onSuccess(transitionTo("placeOrder")))
                    .then(requestResult.onError(showFailureMessageAndTransitionToInitialState))
                    .then(requestResult.onFail(showFailureMessageAndTransitionToInitialState))
                    .fail(reportError("Save Card Details Failed"));
                },
                onSaveCardDetails: function() {
                    cardDetails.save()
                        .then(requestResult.onSuccess(transitionTo("placeOrder")))
                        .then(requestResult.onError(showFailureMessageAndTransitionToInitialState))
                        .then(requestResult.onFail(showFailureMessageAndTransitionToInitialState))
                        .fail(reportError("Save Card Details Failed"));
                },
                onPlaceOrder: function() {
                    order.placeOrder()
                        .then(requestResult.onSuccess(redirectToProvidedUrl))
                        .then(requestResult.onFail(handlePaymentFailure))
                        .fail(reportError("Order Placement Failed"));
                },
                onPlaceOrderWithoutAddress: function() {
                    order.placeOrder()
                        .then(requestResult.onSuccess(redirectToProvidedUrl))
                        .then(requestResult.onFail(handlePaymentFailure))
                        .fail(reportError("Order Placement Failed"));
                },
                onPayerAuthEnrolled: function(eventName, from, to, paReqData) {
                    busyOverlay.disable();
                    payerAuth.showAuthWindow(paReqData);

                    payerAuth.callbacks.onPaResReady.add(function(paResData) {
                        PlaceOrderProcess["payerAuthValidate"](paResData);
                    });
                },
                onPayerAuthValidate: function(eventName, from, to, paResData) {
                    busyOverlay.enable();
                    order.placeOrderAndValidatePayerAuth(paResData.paRes)
                        .then(requestResult.onSuccess(redirectToProvidedUrl))
                        .then(requestResult.onFail(handlePaymentFailure))
                        .fail(reportError("Order Placement Failed. Payer authentication was unsuccessful."));
                },
                onPayerAuthEnrolledWithoutAddress: function(eventName, from, to, paReqData) {
                    busyOverlay.disable();
                    payerAuth.showAuthWindow(paReqData);

                    payerAuth.callbacks.onPaResReady.add(function(paResData) {
                        PlaceOrderProcess["payerAuthValidate"](paResData);
                    });
                },
                onPayerAuthValidateWithoutAddress: function(eventName, from, to, paResData) {
                    busyOverlay.enable();
                    order.placeOrderAndValidatePayerAuth(paResData.paRes)
                        .then(requestResult.onSuccess(redirectToProvidedUrl))
                        .then(requestResult.onFail(handlePaymentFailure))
                        .fail(reportError("Order Placement Failed. Payer authentication was unsuccessful."));
                }
            }
        });

        var onPurchaseNowButtonClick = function() {
            if (readyToPlaceOrder) {
                isAddNewShippingAddressSelected();
                disablePurchaseNowButton();
                PlaceOrderProcess.start();
            }
        };

        var initReviewAndPayObjects = function() {
            $purchaseNowButton = $(".purchaseNowBtn");
            $paymentErrorMessage = $(".payment__error-message");

            ajaxManager.createAjaxGroup("checkout", {
                criteria: {
                    "url" : "^/ajax/checkout"
                },
                ajaxStart: function() {
                    readyToPlaceOrder = false;
                },
                ajaxStop: function() {
                    readyToPlaceOrder = true;
                }
            });

            checkoutDataReady = getAjaxCheckoutData();
            documentReady = $.Deferred();

            // When document is ready the documentReady will be resolved
            $(documentReady.resolve);
        };

        var isAddNewShippingAddressSelected = function() {
            if(deliveryAddress.deliveryAddressSelector.isNewAddress()) {
                deliveryAddress.deliveryAddressSelector.isFormValid();
                showHideNewAddressSelected();
            }
        };

        var showHideNewAddressSelected = function() {
            if(deliveryAddress.deliveryAddressSelector.isNewAddress()) {
                showFailureMessageAndTransitionToInitialState();
                $("#newAddressSelected").show();
                $("#newAddressSelected2").show();
                return false;
            }else{
                $("#newAddressSelected").hide();
                $("#newAddressSelected2").hide();
                return true;
            }
        };

        var onCheckoutDataReady = function(checkoutData) {
            giftMessage.updateCitesRestriction(checkoutData.data.giftMessage);
        };

        var onDocumentReady = function() {
            $purchaseNowButton.on("click", onPurchaseNowButtonClick);
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            busyOverlay.enable();

            initReviewAndPayObjects();

            checkoutDataReady.then(onCheckoutDataReady);

            documentReady.then(onDocumentReady);

            $.when(checkoutDataReady, documentReady).then(onCheckoutDataAndPageReady);
        };

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.order,
    MF.cardDetails,MF.deliveryAddress,
    MF.billingAddress, MF.payerAuth,
    MF.requestResult, MF.credit,
    MF.giftMessage, MF.busyOverlay,
    MF.spinnerHandler, MF.ajaxManager));

if ($("#checkoutReviewAndPay").length !== 0) {
    MF.reviewAndPayMediator.init();
}
