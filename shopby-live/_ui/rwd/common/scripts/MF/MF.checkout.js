/*
 *  require 
 *  ACC.config.commonResourcePath
 *  MF.pickupinstore.validatePickupinStoreCartEntires
 */

;(function ($, window, document, ACC){
    'use strict';

    var MF = window.MF || {};

    MF.checkout = (function () {

        var defaults = {
            spinner: $("<img id='taxesEstimateSpinner' src='" + ACC.config.commonResourcePath + "/images/spinner.gif' />"),
        };

        function init()
        {
            bindCheckO();
        }

        function bindCheckO(){
            var cartEntriesError = false;

            // Alternative checkout flows options
            $('.doFlowSelectedChange').change(function ()
            {
                if ('multistep-pci' == $('#selectAltCheckoutFlow').attr('value'))
                {
                    $('#selectPciOption').css('display', '');
                }
                else
                {
                    $('#selectPciOption').css('display', 'none');

                }
            });

            // Alternative checkout flows version of the doCheckout method to handle the checkout buttons on the cart page.
            $('#checkoutButtonTop,#checkoutButtonBottom').click(function ()
            {
                var checkoutUrl = $(this).data('checkout-url');
                
                cartEntriesError = MF.pickupinstore.validatePickupinStoreCartEntires();
                if (!cartEntriesError)
                {
                    var expressCheckoutObject = $('.doExpressCheckout');
                    if(expressCheckoutObject.is(":checked"))
                    {
                        window.location = expressCheckoutObject.data("expressCheckoutUrl");
                    }
                    else
                    {
                        window.location = checkoutUrl;
                    }
                }
                return false;
            });

            $('#estimateTaxesButton').click(function ()
            {
                $('#zipCodewrapperDiv').removeClass("form_field_error");
                $('#countryWrapperDiv').removeClass("form_field_error");

                var countryIso = $('#countryIso').val();
                if (countryIso === "")
                {
                    $('#countryWrapperDiv').addClass("form_field_error");
                }
                var zipCode = $('#zipCode').val();
                if (zipCode === "")
                {
                    $('#zipCodewrapperDiv').addClass("form_field_error");
                }

                if (zipCode !== "" && countryIso !== "")
                {
                    $("#order_totals_container").append(defaults.spinner);
                    $.getJSON("cart/estimate", {zipCode: zipCode, isocode: countryIso  }, function (estimatedCartData)
                    {
                        $("#estimatedTotalTax").text(estimatedCartData.totalTax.formattedValue);
                        $("#estimatedTotalPrice").text(estimatedCartData.totalPrice.formattedValue);
                        $(".estimatedTotals").show();
                        $(".realTotals").hide();
                        $("#taxesEstimateSpinner").remove();

                    });
                }
            });
        }

        return {
            init: init
        };
    })();

    window.MF = MF;

}(jQuery, this, this.document, ACC));


MF.checkout.init();
