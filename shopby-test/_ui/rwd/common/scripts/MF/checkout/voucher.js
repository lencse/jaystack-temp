;(function($, window, mediator) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            redeemVoucher: "/ajax/checkout/voucher/redeem",
            releaseVoucher: "/ajax/checkout/voucher/release",
            getVoucherData: "/ajax/checkout/voucher/data"
        },
        data: {
            root: "data"
        },
        outEvents: {
            voucherRedeemed: "checkout:voucher:redeemed"
        }
    };

    MF.voucherSelector = (function() {

        var options;

        var voucherCode, voucherForm, voucherFormValidator;

        var initVoucherObjects = function() {
            voucherCode = $("[name=voucherCode]");
            voucherForm = $("#voucherForm");
            voucherFormValidator = validate(voucherForm);
        };

        var publishVoucherRedeemedEvent = function() {
            if (shouldPublishVoucherChangeEvent()) {
                mediator.publish(options.outEvents.voucherRedeemed);
            }
        };

        var shouldPublishVoucherChangeEvent = function() {
            return true;
        };

        var submitVoucher = function(e) {

            e.preventDefault();

            if ($('[name=voucherCode]').val() != '' ) {
                if (voucherFormValidator.form()) {
                    $.post(options.url.redeemVoucher, {
                        voucherCode: voucherCode[0].value
                    })
                        .then(function(data) {
                            if (data.status === "SUCCESS") {
                                publishVoucherRedeemedEvent();
                                //console.log("voucher successfully applied");
                                $("#voucherResult").html($("#voucherCodeApplied").text()).delay(4000, function(){
                                    location.reload();
                                });
                            }
                            if(data.message === 'anonymous.user')
                            {
                                $("#voucherResult").html($("#anonymousUserAlert").text());
                            }
                            else if(data.message === 'voucher.redeem.error'){
                                $("#voucherResult").html($("#voucherCodeInvalid").text());
                            }
                        })
                        .fail(function() {
                            console.error("voucher is not valid");
                        });
                }
            }
            else{
                $("#voucherResult").html($("#voucherCodeMissing").text());
            }
        };

        function validate(voucherForm) {
            var validator = voucherForm.validate({
                onfocusout: false,
                rules: {
                    voucherCode: {
                        maxlength: 255,
                        required: true
                    }
                },
                messages: {
                    voucherCode: {
                        required: $("#voucherCodeMissing").text()
                    }
                },
                errorPlacement: function(error, element) {
                    var voucherText = error.text();
                    $('.spb__voucher__result').empty().append('<div class="spb__voucher__result__error">' +voucherText+ '</div>');
                }
            });
            return validator;
        }

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initVoucherObjects();
               $("#voucherButton").on("click", submitVoucher);
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator));

if ($('.spb').length !== 0) {
    MF.voucherSelector.init();
}
