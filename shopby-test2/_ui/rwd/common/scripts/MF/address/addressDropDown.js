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
        url: {
            setAddress: NO_VALUE
        },
        switchCountry: true,
        shouldPostAddressChange: function(address) {
            return true;
        }
    };

    MF.addressDropDown = function() {

        var context, options;

        var callbacks = {
            onAddressChange: $.Callbacks("unique stopOnFalse"),
            onShowAddressForm : $.Callbacks("unique stopOnFalse")
        };

        var addressBook, selectedAddress, selectedAddressId;

        var savedAddressContainer, addressSelect, addressDetails,
            addressOptionTemplate, addressInfoTemplate;

        var populate = function(_addressBook, _selectedAddressId) {
            addressBook = _addressBook;

            setSelectedAddress(_selectedAddressId);

            populateAddressSelect();

            populateAddressInfo();

            storeSelectedValue();
        };

        var setSelectedAddress = function(addressId) {
            selectedAddressId = addressId;
            selectedAddress = _.find(addressBook, function(address) { return address.id === addressId; });
        };

        var getSelectedAddress = function() {
            return selectedAddress;
        };

        var populateAddressSelect = function() {
            addressSelect.empty();

            $.each(addressBook, function(count, address) {
                addressSelect.append(addressOptionTemplate({
                    "selected": selectedAddressId === address.id,
                    "address": address
                }));
            });

            MF.select.refresh(savedAddressContainer);
        };

        var populateAddressInfo = function() {
            mediator.publish(options.outEvents.addressSelected, selectedAddress);
        };

        var onAddressSelectChange = function(value) {
            
        	var previousCountryCode = selectedAddress.country.isocode;
        	
        	setSelectedAddress(value);

            populateAddressInfo();

            changeAddress(previousCountryCode);
        };

        var switchCountry = function(previousCountryCode) {
            return shippingCountrySwitch.switchCountry({
                "countryCode": selectedAddress.country.isocode,
                "previousCountryCode" : previousCountryCode,
                "handlers": {
                    "onClose": function() {
                        rollbackSelectedValue();
                        callbacks.onShowAddressForm.fire();
                    },
                    "onCountryWithinCurrentSite": function() {
                        storeSelectedValue();
                        return setAddressAndPublishEvent();
                    },
                    "onContinue" : function() {
                        return setAddressAndPublishEvent();
                    }
                }
            });
        };

        var changeAddress = function(previousCountryCode) {
            return options.switchCountry ? switchCountry(previousCountryCode) : setAddressAndPublishEvent();
        };

        var saveSelectedAddress = function() {
            return $.post(options.url.setAddress, {
                addressId: selectedAddress.id
            });
        };

        var postAddressChange = function() {
            if(options.shouldPostAddressChange(selectedAddress)) {
                return saveSelectedAddress();
            }

            return $.Deferred().resolve();
        };

        var setAddressAndPublishEvent = function() {
           return postAddressChange()
                .then(function() {
                    mediator.publish(options.outEvents.addressSet, selectedAddress.id);
                    callbacks.onAddressChange.fire(selectedAddress.id);
                })
                .fail(function() {
                    console.error("cannot set address: " + selectedAddress.id);
                });
        };

        var rollbackSelectedValue = function() {
            var previousSelectedValue = addressSelect.data("current");

            setSelectedAddress(previousSelectedValue);

            if (previousSelectedValue) {
                addressSelect.val(previousSelectedValue);
                MF.select.refresh(savedAddressContainer);
                populateAddressInfo();
            }
        };

        var storeSelectedValue = function(value) {
            addressSelect.data("current", value || addressSelect.val());
        };

        var initAddressObjects = function() {
            var addressSelectorId = "#" + context + "_addressSelector";
            var addressSelector = $(addressSelectorId);

            savedAddressContainer = addressSelectorId + " .saved-address";

            addressSelect = addressSelector.find("[name=addressSelect]");
            addressDetails = addressSelector.find(".addressDetails");

            addressOptionTemplate = Handlebars.compile(addressSelector.find('.addressOptionTemplate').html());
            addressInfoTemplate = Handlebars.compile(addressSelector.find('.addressInfoTemplate').html());
        };

        function init(ctx, opts) {
            context = ctx;
            options = $.extend({}, defaultOptions, opts);

            initAddressObjects();

            $(function() {
                MF.select.init({
                    contextId: addressSelect,
                    callback: onAddressSelectChange
                });
            });
        }

        return {
            init: init,
            callbacks: callbacks,
            populate: populate,
            getSelectedAddress: getSelectedAddress,
            saveSelectedAddress: saveSelectedAddress,
            setSelectedAddress: setAddressAndPublishEvent
        };

    };

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.shippingCountrySwitch));
