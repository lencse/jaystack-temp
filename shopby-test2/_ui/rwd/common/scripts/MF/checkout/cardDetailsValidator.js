/*
 *  requires
 */

;(function($, window) {
    'use strict';

    var MF = window.MF || {};

    var creditCardNames = {
        'master': 'mastercard',
        'visa': 'visa',
        'amex': 'amex',
        'discover': 'discover'
    };

    var errorMessages = {
        validExpiryDate: $("#checkout\\.payment\\.details\\.cardDetails\\.expiresEnds").data("msg-required"),
        validCreditCardNumber: "Credit Card number must be valid",
        validCreditCardCvc: "Credit Card CVC must be valid"
    };

    $.validator.addMethod("futureDate", function(value, element) {
        var expireMonth = $("[name=expireMonth]").val();
        var expireYear = $("[name=expireYear]").val();

        var now = new Date();
        var currentMonth = now.getMonth() + 1;
        var currentYear = now.getFullYear();

        return currentYear < expireYear || currentYear == expireYear && currentMonth <= expireMonth;
    }, errorMessages.validExpiryDate);

    $.validator.addMethod("creditCardNumber", function(value, element, opts) {
        var validCardType = opts.cardType() === $.payment.cardType(value);
        return validCardType && $.payment.validateCardNumber(value);
    }, "Credit Card number must be valid");

    $.validator.addMethod("creditCardCVC", function(value, element, opts) {
        return $.payment.validateCardCVC(value, opts.cardType());
    }, "Credit Card CVC must be valid");

    MF.cardDetailsValidator = (function() {

        function validate(cardDetailsForm) {
            var getCardType = function() {
                var cardType = cardDetailsForm.find("[name=cardType] option:selected").val();
                return creditCardNames[cardType];
            };

            var validator = cardDetailsForm.validate({
                
                onfocusout: function(element) {
                    if ( $(element).prop('name') == 'expireMonth' && $('[name=expireYear]').val() == '' ) {
                            return true;
                        } else if ($(element).prop('name') == 'expireYear' &&  $('[name=expireMonth]').val() == '' ) {
                            return true;
                        } else {
                            $(element).valid()
                        }
                },

                groups: {
                    expireGroup: "expireMonth expireYear"
                },
                rules: {
                    cardType: {
                        maxlength: 255,
                        required: true
                    },
                    cardNumber: {
                        required: true,
                        creditCardNumber: {
                            cardType: getCardType
                        }
                    },
                    cardName: {
                        maxlength: 255,
                        required: true
                    },
                    expireMonth: {
                        maxlength: 255,
                        required: true,
                        futureDate: true
                    },
                    expireYear: {
                        maxlength: 255,
                        required: true,
                        futureDate: true
                    },
                    securityCode: {
                        required: true,
                        creditCardCVC: {
                            cardType: getCardType
                        }
                    }
                },
                errorPlacement: function(error, element) {

                    if ($(element).prop('name') == 'expireYear' || $(element).prop('name') == 'expireMonth') {
                        $('.expireMonth').find('.selecter').prepend(error);
                     } else {
                         error.insertBefore(element);
                     }
                },
                highlight: function(element, errorClass) {
                    var commonParent = $(element).closest('[data-mf-error-class]')
                    commonParent.addClass(commonParent.data('mf-error-class'));
                },
                unhighlight: function(element, errorClass, validClass) { 
                    var commonParent = $(element).closest('[data-mf-error-class]')
                    commonParent.removeClass(commonParent.data('mf-error-class'));

                    // the error message isn't removed by this time.
                    // Let the code run until error message is hidden and remove the class
                    setTimeout(function(){
                        if( $(element).closest('form').find('.' + errorClass + ':visible').length == 0 ) {
                            $('.purchaseNowBtn').closest('.bottom-btn').prev('[class*="error"]').hide();
                            $('.payment-header').next('.generic__error__message').hide();
                        }
                    }, 10);
                },
                errorContainer: ".generic__error__message"
            });

            return validator;
        }

        return {
            validate: validate
        };

    })();

    window.MF = MF;

}(jQuery, this));
