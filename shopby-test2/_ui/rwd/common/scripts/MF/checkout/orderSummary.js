/*
 *  requires
 */

;(function($, window, mediator, breakpoint) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            getOrderSummaryData: "/ajax/checkout/orderSummary/data",
            setIovationData: "/ajax/checkout/orderSummary/iovation"
        },
        data: {
            root: "data",
            orderSummary: "orderSummary"
        },
        inEvents: {
            checkoutInit: "checkout:init",
            deliveryMethodChanged: "checkout:delivery:method:changed",
            voucherRedeemed: "checkout:voucher:redeemed"
        }
    };

    MF.orderSummary = (function() {

        var options;

        var orderSummaryData;

        var orderEntryHeader, orderEntryRow, tabletorderEntryRow, mobileorderEntryRow, orderTotals,
            orderEntryHeaderTemplate, orderEntryRowTemplate, orderTotalsTemplate,
            tabletorderEntryRowTemplate, mobileorderEntryRowTemplate;

        var onCheckoutInit = function(data) {
            updateOrderSummary(data);
            setIovationData();
        };

        var setIovationData = function() {
            $.post(options.url.setIovationData, {"iovationResponse" : iovationResponse});
        };

        var updateOrderSummary = function(checkoutData) {
            initOrderSummaryData(checkoutData);
            renderTemplates();
        };

        var initOrderSummaryData = function(data) {
            orderSummaryData = data[options.data.root][options.data.orderSummary];
            orderSummaryData.computedColumns = getComputedColumns(orderSummaryData);
        };

        var boolToNumber = function(booleanValue) {
            // Returns 1 for 'true' and 0 for 'false'
            return Number(booleanValue);
        };

        var getComputedColumns = function(orderSummary) {
            return !!(orderSummary.discount) + boolToNumber(orderSummary.showDuty) +
                boolToNumber(orderSummary.showLst);
        };

        var renderTemplates = function(breakpointName) {
            orderTotals.html(orderTotalsTemplate(orderSummaryData));

            switch(breakpointName || breakpoint.getActive()) {
                case breakpoint.DESKTOP_LARGE:
                case breakpoint.DESKTOP:
                    orderEntryHeader.html(orderEntryHeaderTemplate(orderSummaryData));
                    orderEntryRow.html(orderEntryRowTemplate(orderSummaryData));
                    break;
                case breakpoint.TABLET:
                    tabletorderEntryRow.html(tabletorderEntryRowTemplate(orderSummaryData));
                    break;
                case breakpoint.MOBILE:
                    mobileorderEntryRow.html(mobileorderEntryRowTemplate(orderSummaryData));
            }
        };

        var fetchOrderSummaryData = function() {
            return $.getJSON(options.url.getOrderSummaryData)
                .then(updateOrderSummary)
                .fail(function() {
                    console.error("Can not load order summary data");
                });
        };

        var initOrderSummaryObjects = function() {
            orderEntryHeader = $("#orderEntryHeader");
            orderEntryRow = $("#orderEntryRow");
            orderTotals = $("#orderTotals");
            tabletorderEntryRow = $("#tabletorderEntryRow");
            mobileorderEntryRow = $("#mobileorderEntryRow");

            orderTotalsTemplate = Handlebars.compile($("#orderTotalsTemplate").html());
            orderEntryHeaderTemplate = Handlebars.compile($("#orderEntryHeaderTemplate").html());
            orderEntryRowTemplate = Handlebars.compile($("#orderEntryRowTemplate").html());
            tabletorderEntryRowTemplate = Handlebars.compile($("#tabletorderEntryRowTemplate").html());
            mobileorderEntryRowTemplate = Handlebars.compile($("#mobileorderEntryRowTemplate").html());
        };

        /*
            When breakpoint changes we dsiplay breakpoint specific layout - we consider only particular templates to render.
            That is for optimization reasons - manipulations with DOM are heavy operations (repaint&reflow)
         */
        var bindListeners = function() {
            breakpoint.callbacks.onChange.add(renderTemplates);
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            initOrderSummaryObjects();

            bindListeners();

            $(function() {
                mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(options.inEvents.deliveryMethodChanged, fetchOrderSummaryData);
                mediator.subscribe(options.inEvents.voucherRedeemed, fetchOrderSummaryData);
            });
        };

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.breakpoint));

if ($("#checkoutReviewAndPay").exists()) {
    MF.orderSummary.init();
}
