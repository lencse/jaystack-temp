/*
 *  requires
 */

;(function($, window, mediator) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            getPackagingData: "/ajax/checkout/packagingType/data",
            setPackagingOption: "/ajax/checkout/packagingType/set"
        },
        data: {
            root: "data",
            packagingType: "packagingType",
            selectedPackage: "selectedPackage"
        },
        inEvents: {
            checkoutInit: "checkout:init"
        },
        outEvents: {}
    };

    MF.packageType = (function() {

    var options;

    var onCheckoutInit = function(data) {
        initPackagingOptions(data);
    };

    var loadPackageTypes = function() {
        return $.getJSON(options.url.getPackagingData)
            .then(initPackagingOptions)
            .fail(function() {
                console.error("Can not get packaging data");
            });
    };

    var initPackagingOptions = function(data) {
        var packagingTypeData = data[options.data.root][options.data.packagingType][options.data.selectedPackage];
        packagingTypeData = packagingTypeData.toLowerCase();
        populatePackagingOptionRadio(packagingTypeData);
    };

    var populatePackagingOptionRadio = function(defaultPackaging){
        $("#packagingMessage input")
            .filter("[value=" + defaultPackaging + "]")
            .attr("checked", "checked");
    };

    var postPackagingOptions = function() {
        var selectedModeCode = $("[name=packagingOption]:checked").val().toUpperCase();

        return $.post(options.url.setPackagingOption, {
            packageCode: selectedModeCode
        }).fail(function() {
            console.error("Can not set packaging option");
        });
    };

    function init(opts) {
        options = $.extend({}, defaultOptions, opts);
        $(function() {
            mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
            $(document).on("change", "[name=packagingOption]", postPackagingOptions);
        });
    }

    return {
        init: init,
        loadPackageTypes: loadPackageTypes
    };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator));

if ($('#checkoutShipping, #checkoutReviewAndPay').length !== 0) {
    MF.packageType.init();
}
