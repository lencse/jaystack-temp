/*
 *  requires
 *
 *  MF.newAddress
 */

;(function($, window, newAddress, mediator) {
    "use strict";

    var MF = window.MF || {};

    var ADDRESS_TYPE = "delivery";

    var defaultOptions = {
        outEvents: {
            deliveryAddressChanged: "checkout:delivery:address:changed"
        }
    };

    MF.shippingAddressForm = (function() {

        var options = {};

        var deliveryAddressForm = newAddress();

        var initAddressForm = function() {
            deliveryAddressForm.init(ADDRESS_TYPE, {
                url: {
                    addAddress: "/ajax/checkout/deliveryAddress/add"
                },
                outEvents: {
                    addressAdded: "checkout:delivery:address:added"
                }
            });
        };

        var onAddressSaved = function() {
            mediator.publish(options.outEvents.deliveryAddressChanged);
        };

        var bindEvents = function() {
            deliveryAddressForm.callbacks.onAddressSaved.add(onAddressSaved);
        };

        var showForm = function() {
            deliveryAddressForm.show();
        };

        var init = function(ctx, opts) {
            options = $.extend({}, defaultOptions, opts);

            if ($("#checkoutShipping #delivery_newAddress").exists()) {
                initAddressForm();

                bindEvents();
            }
        };

        return {
            init: init,
            show: showForm
        };

    }());

    window.MF = MF;

}(jQuery, this, MF.newAddress, MF.checkout.mediator));

MF.shippingAddressForm.init();
