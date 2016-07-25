/*
 *  requires
 *
 *  MF.addressSelector
 *  MF.newAddress
 */

;(function($, window, mediator, addressSelector, newAddress, addressDropDown, addressInfo) {
    "use strict";

    var MF = window.MF || {};

    var ADDRESS_TYPE = "billing";
    var EDIT_ADDRESS_TYPE = "billingEdit";

    var defaultOptions = {};

    MF.billingAddress = (function() {

        var options = {};

        var billingAddressForm = newAddress();
        var billingEditAddressForm = newAddress();
        var billingAddressDropDown = addressDropDown();
        var billingAddressInfo = addressInfo(billingEditAddressForm);
        var billingAddressSelector = addressSelector(billingAddressForm, billingEditAddressForm, billingAddressDropDown);

        var shouldPostAddressChange = function(addressData) {
            return addressData.shippingAddress === false;
        };

        var initAddressForm = function() {
            billingAddressForm.init(ADDRESS_TYPE, {
                url: {
                    addAddress: "/ajax/checkout/billingAddress/add"
                },
                outEvents: {
                    addressAdded: "checkout:billing:address:added"
                },
                switchCountry: false
            });
        };

        var initEditAddressForm = function() {
            billingEditAddressForm.init(EDIT_ADDRESS_TYPE, {
                url: {
                    addAddress: "/ajax/checkout/billingAddress/add"
                },
                outEvents: {
                    addressAdded: "checkout:billing:address:added"
                }
            });
        };

        var initAddressInfo = function() {
            billingAddressInfo.init(ADDRESS_TYPE, {
                inEvents: {
                    addressSelected: "checkout:billing:address:selected"
                }
            });
        };

        var initAddressDropDown = function() {
            billingAddressDropDown.init(ADDRESS_TYPE, {
                url: {
                    setAddress: "/ajax/checkout/billingAddress/set"
                },
                outEvents: {
                    addressSelected: "checkout:billing:address:selected",
                    addressSet: "checkout:billing:address:set"
                },
                switchCountry: false,
                shouldPostAddressChange: shouldPostAddressChange
            });
        };

        var initAddressSelector = function() {
            billingAddressSelector.init(ADDRESS_TYPE, {
                url: {
                    getAddressData: "/ajax/checkout/billingAddress/data"
                },
                data: {
                    root: "data",
                    address: "billingAddress"
                },
                inEvents: {
                    checkoutInit: "checkout:init",
                    addressShow: "checkout:billing:address:show",
                    addressHide: "checkout:billing:address:hide",
                    deliveryAddressAdded: "checkout:delivery:address:added"
                }
            });
        };

        var init = function(ctx, opts) {
            options = $.extend({}, defaultOptions, opts);

            if ($("#checkoutReviewAndPay #billing_addressSelector").exists()) {
                initAddressForm();
                initEditAddressForm();
                initAddressDropDown();
                initAddressInfo();
                initAddressSelector();
            }
        };

        return {
            init: init,
            save: billingAddressSelector.saveAddress
        };

    }());

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.addressSelector, MF.newAddress, MF.addressDropDown, MF.addressInfo));

MF.billingAddress.init();
