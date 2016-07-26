/*
 *  requires
 *
 *  MF.deliveryMethod
 */
;(function($, window, document, mediator, formMode) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            getDeliveryMethodData: "/ajax/checkout/deliveryMethod/data",
            setDeliveryMethod: "/ajax/checkout/deliveryMethod/set",
            selectDefaultMethod: "/ajax/checkout/deliveryMethod/selectDefault",
            getCountryDeliveryMethodUrl:"/delivery/ajax/delivery-data",
            clearDeliveryMethod: "/ajax/checkout/deliveryMethod/clear",
            getAdhocDeliveryMessage: "/delivery/ajax/adhoc-delivery-message",
        },
        data: {
            root: "data",
            deliveryMethod: "deliveryMethod"
        },
        inEvents: {
            checkoutInit: "checkout:init",
            deliveryAddressChanged: "checkout:delivery:address:changed",
            countrySwitching : "delivery:country:switching",
            addressEdit: "checkout:address:edit"
        },
        outEvents: {
            deliveryMethodChanged: "checkout:delivery:method:changed"
        }
    };

    var deliveryMethodTable, deliveryMethodTDTemplate, deliveryMethodViewInfoTemplate, deliveryMethods,
        deliveryMethodInfo, deliveryMethodView, deliveryMethod, deliveryContainer,adhocDeliveryMessageDiv,adhocDeliveryMessageTemplate,adhocDeliveryMessage;

    MF.deliveryMethodSelector = (function() {

        var options;

        var onCheckoutInit = function(data) {
            var deliveryMethodData = data[options.data.root][options.data.deliveryMethod];
            populateDeliveryMethod(deliveryMethodData);
        };

        var emptyDeliveryMethod = function() {
            deliveryMethodTable.empty();
        };

        var populateDeliveryMethod = function(deliveryMethodData) {
            deliveryMethods = deliveryMethodData["modes"];
            deliveryMethodTable.empty();
            deliveryContainer.find(".para-info").hide().end().find("#deliveryMethod").show();
            $.each(deliveryMethods, function(count, deliveryMethod) {
                deliveryMethodTable.append(deliveryMethodTDTemplate({
                    "deliveryMethod": deliveryMethod,
                    "selected": deliveryMethodData.selectedDeliveryMethodCode === deliveryMethod.code
                }));

                if (deliveryMethodData.selectedDeliveryMethodCode === deliveryMethod.code) {
                    deliveryMethodView.html(deliveryMethodViewInfoTemplate({
                        "deliveryMethod": deliveryMethod
                    }));
                }
            });
        };
        
        var populateAdhocDeliveryMessage = function(adhocDeliveryMessage) {
        	adhocDeliveryMessageDiv.empty();
        	adhocDeliveryMessageDiv.append(adhocDeliveryMessageTemplate({
                    "adhocDeliveryMessage": adhocDeliveryMessage
                }));
        };

        var updateDeliveryMethod = function() {
            return $.post(options.url.selectDefaultMethod, {})
                .then(getDeliveryMethodData)
                .then(publishDeliveryMethodChangeEvent)
                .fail(function() {
                    console.error("Unable to select default delivery method");
                });
        };

        var getDeliveryMethodData = function() {
            return $.getJSON(options.url.getDeliveryMethodData)
                   .then(function(data) {
                       var deliveryMethodData = data[options.data.root][options.data.deliveryMethod];
                       populateDeliveryMethod(deliveryMethodData);
                   })
                   .fail(function() {
                       console.error("cannot get delivery method data");
                   });
        };

        var publishDeliveryMethodChangeEvent = function() {
            mediator.publish(options.outEvents.deliveryMethodChanged);
        };

        var onEditDeliveryMethodLinkClick = function(e) {
            e.preventDefault();

            formMode.switchMode(deliveryMethodInfo, "edit");
        };

        var initDeliveryMethodObjects = function() {
            deliveryMethod = $("[name=deliveryMethod]");
            deliveryMethodTable = $("#deliveryMethodTable");
            adhocDeliveryMessageDiv = $("#adhocDeliveryMessageDiv");
            deliveryMethodTDTemplate = Handlebars.compile($('#deliveryMethodInfoTemplate').html());
            var adhocDeliveryMessageHandlebar = $('#adhocDeliveryMessageTemplate');
            if (adhocDeliveryMessageHandlebar.length > 0)
            {
                adhocDeliveryMessageTemplate = Handlebars.compile(adhocDeliveryMessageHandlebar.html());
            }

            deliveryMethodInfo = $(".delivery-method-info");
            deliveryMethodView = $(".deliveryMethodView");
            try {
                deliveryMethodViewInfoTemplate = Handlebars.compile($('#deliveryMethodViewInfoTemplate').html());
            } catch(e) {}

            deliveryContainer = $("#shippingMethodSection");
        };

        var checkItIsPostcodeEnabledMethod = function(){
            var countryEnabledList = JSON.parse($("#countriesData").text());
            var selectedOption = $("#deliveryModeCountryDropdown #address\\.country").val();
            if(_.contains(countryEnabledList,selectedOption)){
                $("#deliveryPostcodeInput").val('').show();
                emptyDeliveryMethod();
                callAndUpdateAdhocDeliveryMessage();
            }else{
                $("#deliveryPostcodeInput").val('');
                $('#deliveryPageModeButton').trigger('click');
                $('.delivery-country-submit').hide();
                $("#deliveryPostcodeInput").val('').hide();
            }
            $('.delivery-country-submit').hide();
        };

        var callAndUpdateDeliveryModeMethod = function(){
           var selectedOption = $("#deliveryModeCountryDropdown #address\\.country").val();
           var postcode = $("#deliveryModeCountryDropdown #address\\.postcode").val();
            $.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
                type: "POST",
                url: options.url.getCountryDeliveryMethodUrl,
                data: {countryIso: selectedOption, postcode: postcode},
                cache: false,
                success: function (data) {
                    populateDeliveryMethod(data);
                    $("#deliveryMethod").show();
                    populateAdhocDeliveryMessage(data.adhocDeliveryMessage);
                }
            });
            return false;
        };
        
        var callAndUpdateAdhocDeliveryMessage = function(){
            var selectedOption = $("#deliveryModeCountryDropdown #address\\.country").val();
             $.ajax({
                 beforeSend: function (request)
                 {
                     request.setRequestHeader("Cache-Control", "no-store");
                 },
                 type: "POST",
                 url: options.url.getAdhocDeliveryMessage,
                 data: {countryIso: selectedOption},
                 cache: false,
                 success: function (data) {
                     populateAdhocDeliveryMessage(data);
                 }
             });
             return false;
         };

        var postDeliveryMethodCode = function() {
            var selectedModeCode = $("[name=deliveryMethod]:checked").val();
            var payload = {
                deliveryModeCode: selectedModeCode
            };

            return $.post(options.url.setDeliveryMethod, payload)
                .then(publishDeliveryMethodChangeEvent)
                .fail(function() {
                    console.error("Can not set delivery method");
                });
        };

        var clearDeliveryMethod = function() {
            return $.post(defaultOptions.url.clearDeliveryMethod, {})
                .fail(function() {
                    console.error("Cannot clear delivery method on country switching");
                });
        };

        var changeContainerVisibility = function(edit) {
            if (edit) {
                deliveryContainer.hide();
            } else {
                deliveryContainer.show();
            }
        };

        function init(opts) {

            options = $.extend({}, defaultOptions, opts);

            $('#deliveryModeCountryDropdown').on("change", checkItIsPostcodeEnabledMethod);
            $('#deliveryPageModeButton').on("click", callAndUpdateDeliveryModeMethod);
            $("#deliveryPostcodeInput #address\\.postcode").on('keyup change blur paste cut click', function(){
                if($(this).val()) {
                    $('.delivery-country-submit').show();
                } else {
                    $('.delivery-country-submit').hide();
                }
            });
            initDeliveryMethodObjects();

            $(function() {

                mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(options.inEvents.deliveryAddressChanged, updateDeliveryMethod);
                mediator.subscribe(options.inEvents.countrySwitching, clearDeliveryMethod);
                mediator.subscribe(options.inEvents.addressEdit, changeContainerVisibility);

                $(document).on("change", "[name=deliveryMethod]", postDeliveryMethodCode);
                $('#deliveryModeCountryDropdown').trigger('change');

                deliveryMethodView.on("click", ".editDeliveryMethodLink", onEditDeliveryMethodLinkClick);
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.checkout.mediator, MF.formMode));

if ($('#checkoutShipping, #checkoutReviewAndPay, #deliveryModeCountryDropdown').length !== 0) {
    MF.deliveryMethodSelector.init();
}
