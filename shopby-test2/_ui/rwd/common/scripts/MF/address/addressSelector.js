/*
 *  requires
 *
 *  MF.shippingCountrySwitch
 */

;(function($, window, mediator, shippingCountrySwitch) {
    "use strict";

    var MF = window.MF || {};

    var NO_VALUE = null;

    var defaultOptions = {
        data: {
            root: "data",
            address: NO_VALUE
        },
        inEvents: {
            checkoutInit: NO_VALUE,
            addressShow: NO_VALUE,
            addressHide: NO_VALUE
        },
        outEvents: {
            addressEdit: "checkout:address:edit"
        }
    };

    MF.addressSelector = function(addressForm, editAddressForm, addressDropDown) {

        var context, options;

        var addressData, addressBook, selectedAddressId;

        var addressSelectorId, addressSelector, addressType;

        var initAddressData = function(data) {
            addressData =  data[options.data.root][options.data.address];
            addressBook = addressData["addressBook"];

            if(addressBook.length > 0 && !selectedAddressId) {
                selectedAddressId = addressData["selectedAddressId"] || addressBook[0].id;
            }
            if(addressBook.length == 0) {
            	$('#saved-address').hide();
            	$('#alternate-address-option').hide();
            }
        };

        var onCheckoutInit = function(data) {
            initAddressData(data);

            addressDropDown.populate(addressBook, selectedAddressId);

            populateAddressRadioButton();
        };

        var showAddressSelector = function () {
            addressSelector.show();
        };

        var hideAddressSelector = function () {
            addressSelector.hide();
        };

        var onAddressAdded = function() {
            updateAddressData();
        };

        var onAddressSaved = function(response, addressId) {
            addressForm.clear();

            selectedAddressId = addressId;

            updateAddressData();
        };

        var onAddressUpdated = function() {
            editAddressForm.hide();

            updateAddressData();
        };

        var onAddressDataFetched = function(data) {
            initAddressData(data);

            addressDropDown.populate(addressBook, selectedAddressId);
            addressDropDown.setSelectedAddress();

            populateAddressRadioButton();
        };

        var updateAddressData = function() {
            return $.getJSON(options.url.getAddressData)
                .then(onAddressDataFetched)
                .fail(function() {
                    console.error("cannot get addresses");
                });
        };

        var populateAddressRadioButton = function() {
            var selectedAddressType = addressData["selectedAddressType"];
            switchAddressType(selectedAddressType);
        };

        var switchAddressType = function(addressTypeValue) {
            addressType.filter("[value=" + addressTypeValue + "]").trigger("click");
        };

        var onAddressSelectChange = function(addressId) {
            selectedAddressId = addressId;
        };

        var onShowAddressForm = function() {
            checkNewAddress();
        };

        var switchCountry = function() {
            var selectedAddress = addressDropDown.getSelectedAddress();

            shippingCountrySwitch.switchCountry({
                "countryCode": selectedAddress.country.isocode,
                "handlers": {
                    "onClose": function() {
                        // Going back to the 'new' address type
                        switchAddressType("new");
                    },
                    "onContinue": function() {
                        return saveAddress();
                    }
                }
            });
        };

        var onAddressTypeChange = function() {
            if (isNewAddress()) {
                publishAddressEditMode(true);
                addressForm.show();
                if ( $(this).closest('#delivery_addressSelector').exists() ) {
                    //$('.purchaseNowBtn').prop('disabled', true).css('opacity', 0.3);
                }
            } else if(requiresNewAddress()) {
                publishAddressEditMode(true);
                switchCountry();
            } else {
                publishAddressEditMode(false);
                addressForm.hide();
                if ( $(this).closest('#delivery_addressSelector').exists() ) {
                    $('.purchaseNowBtn').prop('disabled', false).css('opacity', 1);
                }
            }
        };

        /*
            If back-end returns selectedAddressType=new we consider that address drop-down does not contain
            country which is the same as selected (session) country. In this case we expect new address to be created
         */
        var requiresNewAddress = function() {
            return  addressData["selectedAddressType"] === "new";
        };

        var isNewAddress = function() {
        	if(addressType != null) {
            return "new" === addressType.filter(":checked").val();
        	}
        };

        var checkNewAddress = function() {
            addressType.filter("[value='new']").trigger("click");
        };

        var ensureFormIsValid = function() {
           if(addressForm.isInLookupMode()) {
                addressForm.switchMode(addressForm.modes.manual);
           }

            if(!addressForm.validate()) {
                throw new Error("Address Form [" + context + "] is invalid");
            }
        };

        var publishAddressEditMode = function(state) {
            mediator.publish(options.outEvents.addressEdit, state);
        };

        var saveAddress = function() {
            if(isNewAddress()) {
                ensureFormIsValid();

                return addressForm.save();
            }

            return addressDropDown.saveSelectedAddress();
        };

        var initAddressObjects = function() {
            addressSelectorId = "#" + context + "_addressSelector";

            addressSelector = $(addressSelectorId);
            addressType = addressSelector.find("[name=" + context + "_addressType]");
        };

        var init = function(ctx, opts) {
            context = ctx;
            options = $.extend({}, defaultOptions, opts);

            initAddressObjects();

            $(function() {
                mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(options.inEvents.addressShow, showAddressSelector);
                mediator.subscribe(options.inEvents.addressHide, hideAddressSelector);

                if(options.inEvents.deliveryAddressAdded) {
                    mediator.subscribe(options.inEvents.deliveryAddressAdded, onAddressAdded);
                }

                addressForm.callbacks.onAddressSaved.add(onAddressSaved);
                editAddressForm.callbacks.onAddressSaved.add(onAddressUpdated);

                addressDropDown.callbacks.onAddressChange.add(onAddressSelectChange);
                addressDropDown.callbacks.onShowAddressForm.add(onShowAddressForm);

                addressType.on("change", onAddressTypeChange);
            });
        };

        return {
            init: init,
            saveAddress: saveAddress,
            isNewAddress: isNewAddress,
            isFormValid: ensureFormIsValid
        };

    };

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.shippingCountrySwitch));
