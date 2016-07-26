/*
 *  requires
 *
 *  MF.addressSelector
 *  MF.addressDropDown
 *  MF.newAddress
 */

;(function($, window, mediator, addressSelector, newAddress, addressDropDown, addressInfo) {
    "use strict";

    var MF = window.MF || {};

    var ADDRESS_TYPE = "delivery";
    var EDIT_ADDRESS_TYPE = "deliveryEdit";

    var defaultOptions = {};

    MF.deliveryAddress = (function() {

        var options = {};

        var deliveryAddressForm = newAddress();
        var deliveryEditAddressForm = newAddress();
        var deliveryAddressDropDown = addressDropDown();
        var deliveryAddressInfo = addressInfo(deliveryEditAddressForm);
        var deliveryAddressSelector = addressSelector(deliveryAddressForm, deliveryEditAddressForm, deliveryAddressDropDown);

        var publishDeliveryAddressChangedEvent = function() {
            mediator.publish("checkout:delivery:address:changed");
        };

        var initAddressDropDown = function() {
            deliveryAddressDropDown.init(ADDRESS_TYPE, {
                url: {
                    setAddress: "/ajax/checkout/deliveryAddress/set"
                },
                outEvents: {
                    addressSelected: "checkout:delivery:address:selected",
                    addressSet: "checkout:delivery:address:set"
                }
            });

            deliveryAddressDropDown.callbacks.onAddressChange.add(publishDeliveryAddressChangedEvent);
        };

        var initAddressInfo = function() {
            deliveryAddressInfo.init(ADDRESS_TYPE, {
                inEvents: {
                    addressSelected: "checkout:delivery:address:selected"
                }
            });
        };

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

        var initEditAddressForm = function() {
            deliveryEditAddressForm.init(EDIT_ADDRESS_TYPE, {
                url: {
                    addAddress: "/ajax/checkout/deliveryAddress/add"
                },
                outEvents: {
                    addressAdded: "checkout:delivery:address:added"
                }
            });
        };

        var initAddressSelector = function() {
            deliveryAddressSelector.init(ADDRESS_TYPE, {
                url: {
                    getAddressData: "/ajax/checkout/deliveryAddress/data"
                },
                data: {
                    root: "data",
                    address: "deliveryAddress"
                },
                inEvents: {
                    checkoutInit: "checkout:init",
                    addressShow: "checkout:delivery:address:show",
                    addressHide: "checkout:delivery:address:hide"
                }
            });
        };

        var init = function(ctx, opts) {
            options = $.extend({}, defaultOptions, opts);

            if ($("#checkoutReviewAndPay #delivery_addressSelector").exists()) {
                initAddressForm();
                initEditAddressForm();
                initAddressDropDown();
                initAddressInfo();
                initAddressSelector();
            }
        };


        return {
            init: init,
            deliveryAddressSelector: deliveryAddressSelector
        };

    }());

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.addressSelector, MF.newAddress, MF.addressDropDown, MF.addressInfo));

MF.deliveryAddress.init();
