;(function($, window, document, mediator, cardDetailsValidator, requestResult) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            getCardDetailsData: "/ajax/checkout/cardDetails/data",
            setCardDetails: "/ajax/checkout/cardDetails/set",
            addCardDetails: "/ajax/checkout/cardDetails/add"
        },
        data: {
            root: "data",
            cardDetails: "cardDetails"
        },
        inEvents: {
            checkoutInit: "checkout:init",
            saveCardDetails: "checkout:billing:cardDetails:saveCard"
        },
        outEvents: {
            addressShow: "checkout:billing:address:show",
            addressHide: "checkout:billing:address:hide"
        }
    };

    MF.cardDetails = (function() {

        var options;

        var cardDetailsRadio, existingCardDetails, newCardDetails, cardDetailsForm, cardDetailsFormValidator,
            cardTypeSelect, expireMonthSelect, expireYearSelect, cardDetailsTemplate, cardTypeOptionTemplate,
            expiresOptionTemplate, pan;

        var onCheckoutInit = function() {
            var cardDetailsData = arguments[0][options.data.root][options.data.cardDetails];

            populateSavedCreditCardsDetails(cardDetailsData);
            populateCardDetailsRadio(cardDetailsData);

            populateCardTypesDropDown(cardDetailsData);
            populateExpiresEndsDropDown(cardDetailsData);

            MF.select.init({contextId: cardDetailsForm}); //#existingCardDetails'

            preventExpiredCardFromSelection();
        };

        var onSaveCardDetails = function() {
            if (isNewCardDetails()) {
                return saveCardDetailsForm();
            }
        };

        var saveCardDetailsForm = function() {
            return $.post(options.url.addCardDetails, cardDetailsForm.serialize());
        };

        var saveCardDetails = function() {
            if (isNewCardDetails()) {
                if(!validateForm()) {
                    throw new Error("Payment Card Form is invalid");
                }
                return saveCardDetailsForm();
            }

            // Emulating success result (ajax response)
            return $.Deferred().resolve({
                status: requestResult.status.SUCCESS
            });
        };

        var populateSavedCreditCardsDetails = function(cardDetailsData) {
            var ccPaymentInfos = cardDetailsData["ccPaymentInfos"];

            if (ccPaymentInfos.length > 0) {
                existingCardDetails.append(
                    cardDetailsTemplate({
                        ccPaymentInfos: ccPaymentInfos
                    })
                );
                existingCardDetails.show();
                $(".selectable-options > input").show().parent('.selectable-options').addClass("cr");
            }
            else {
                $(".selectable-options > input").hide();
            }
        };

        var populateCardDetailsRadio = function (cardDetailsData) {
            var ccPaymentInfos = cardDetailsData["ccPaymentInfos"];

            var selectedCardDetailId = cardDetailsData["selectedCCPaymentInfoId"];
            if (!selectedCardDetailId || !containsPaymentInfo(ccPaymentInfos, selectedCardDetailId)) {
                selectedCardDetailId = ccPaymentInfos.length > 0 ? ccPaymentInfos[0].id : "new";
            }

            cardDetailsRadio = $(cardDetailsRadio.selector);
            cardDetailsRadio.filter("[value=" + selectedCardDetailId + "]").trigger("click");
        };

        var containsPaymentInfo = function(ccPaymentInfos, ccPaymentInfoId) {
            var exists = false;

            $.each(ccPaymentInfos, function(index, ccPaymentInfo) {
                if (ccPaymentInfoId === ccPaymentInfo.id) {
                    exists = true;
                }
            });

            return exists;
        };

        var onCardDetailsRadioChange = function() {
            if (isNewCardDetails()) {
                postCardDetailsChange();
                mediator.publish(options.outEvents.addressShow);
                newCardDetails.show();
            } else {
                postCardDetailsChange(this.value);
                mediator.publish(options.outEvents.addressHide);
                newCardDetails.hide();
            }
        };

        var isNewCardDetails = function() {
            return "new" === cardDetailsRadio.filter(":checked").val() && paymentInvolvesCardDetails();
        };

        var paymentInvolvesCardDetails = function() {
            return $("input:radio[name=payment]").filter(":checked").val() !== "credit";
        };

        var postCardDetailsChange = function(paymentInfoId) {
            if (!isNewCardDetails()) {
                $.post(options.url.setCardDetails, {
                    paymentInfoId: paymentInfoId
                }).fail(function() {
                    console.log("Cannot set payment info");
                });
            }
        };

        var populateCardTypesDropDown = function(cardDetailsData) {
            var cardTypes = cardDetailsData["cardTypes"];

            cardTypeSelect.find("option:not([value=])").remove();
            $.each(cardTypes, function(cardTypeCode, cardTypeId) {
                cardTypeSelect.append(cardTypeOptionTemplate({
                    cardTypeId: cardTypeId,
                    cardTypeCode: cardTypeCode,
                    cardTypeName: $("#cardType_" + cardTypeCode).text()
                }));
            });

            // Card Types Anchors
            $("a[name=cardTypeName]").on("click", function (event) { 
                var cardLink = $(this).data("value");
                var cardOptionName = $("#checkout\\.payment\\.details\\.cardDetails\\.cardType").val(cardLink).trigger("change");
                event.preventDefault();
            });
        };

        var populateExpiresEndsDropDown = function(cardDetailsData) {
            var months = cardDetailsData["months"];
            var years = cardDetailsData["years"];

            expireMonthSelect.empty();
            $.each(months, function(count, month) {
                expireMonthSelect.append(expiresOptionTemplate(month));
            });

            expireYearSelect.empty();
            $.each(years, function(count, year) {
                expireYearSelect.append(expiresOptionTemplate(year));
            });
        };

        var initCardDetailsObjects = function() {
            cardDetailsRadio = $("[name=cardDetails]");
            existingCardDetails = $("#existingCardDetails");

            newCardDetails = $("#newCardDetails");
            cardDetailsForm = $("#cardDetailsForm");
            cardTypeSelect = cardDetailsForm.find("[name=cardType]");
            pan = cardDetailsForm.find("[name=cardNumber]");
            expireMonthSelect = cardDetailsForm.find("[name=expireMonth]");
            expireYearSelect = cardDetailsForm.find("[name=expireYear]");

            cardDetailsTemplate = Handlebars.compile($('#cardDetailsTemplate').html());
            cardTypeOptionTemplate = Handlebars.compile($('#cardTypeOptionTemplate').html());
            expiresOptionTemplate = Handlebars.compile($('#expiresOptionTemplate').html());
        };

        var validateForm = function() {
            return cardDetailsFormValidator.form();
        };

        var initCardDetailsFormValidator = function() {
            cardDetailsFormValidator = cardDetailsValidator.validate(cardDetailsForm);
        };

        var preventExpiredCardFromSelection = function(){
            if($(".cardtype-info__expired").exists()){
                if ( $("input:radio[name=payment]:checked").val() !== "credit"){
                    if (!$("input:radio[name=cardDetails]:checked").val()) {
                        $("input:radio[name=cardDetails]:first").prop("checked", true);
                    }
                }
            }
        };

        // Card Security Information Modal
        var $cardSecurityInfoModal;

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);
            initCardDetailsObjects();
            initCardDetailsFormValidator();

            $cardSecurityInfoModal = $('#cardSecurityInfoModal');
            cardSecurityOverlay();

            $(function() {
                mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(options.inEvents.saveCardDetails, onSaveCardDetails);

                $(document).on("change", cardDetailsRadio.selector, onCardDetailsRadioChange);
            });

        }

        function cardSecurityOverlay() {
            $(".cs-msg").on("click", function (event) {
                MF.overlay.openWithElement({
                    element: $cardSecurityInfoModal
                });
                event.preventDefault();
            });
        }

        function getCardDetailsForm() {
            return cardDetailsForm;
        }
        return {
            init: init,
            validateForm: validateForm,
            save: saveCardDetails,
            getCardDetailsForm: getCardDetailsForm
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.checkout.mediator, MF.cardDetailsValidator, MF.requestResult));

if ($('#checkoutReviewAndPay').length !== 0) {
    MF.cardDetails.init();
}
