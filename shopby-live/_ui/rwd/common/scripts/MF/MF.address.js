/*
 *  require
 *
 *  MF.overlay
 *  MF.newAddress
 */

;(function ($, window, document, overlay, newAddress) {
  'use strict';

  var MF = window.MF || {};

    var ADDRESS_TYPE = "addressBook";

    var defaultOptions = {
        url: {
            getAddressData: "/ajax/account/address/data",
            removeAddress: "/ajax/account/address/remove/"
        },
        addressForm: {
            mode: {
                add: "lookup",
                edit: "manual"
            }
        }
    };

    MF.address = (function () {

        var options;

        var addressForm = newAddress();

        var addresses, addressesSection, addressesMessageSection, addressContainer, addressMessageTemplate,
            addressViewTemplate, addressDeletePopup, addressDeleteTemplate, cancelAddressButton, addAddressButton;

        var loadAddresses = function() {
            return $.getJSON(options.url.getAddressData)
                .fail(function() {
                    console.error("cannot get account addresses");
                });
        };

        var getAddress = function(addressId) {
            var address = $.grep(addresses, function(address) {
                return address.id === addressId;
            });

            return address.length > 0 ? address[0] : null;
        };

        var removeAddress = function(addressId) {
            return $.post(options.url.removeAddress + addressId)
                .fail(function() {
                    console.error("cannot remove account address");
                });
        };

        var showNewAddressForm = function(quick) {
            addressForm.clear();
            addressForm.show(options.addressForm.mode.add);
            $('.address__saved').hide();
            $('.save__address').show();
            $('#addressBookAddressSelector').hide();
            var elementToScrollTo = $('.addressBk-container:visible');
            if (! elementToScrollTo.exists() ) {
                elementToScrollTo = $('.account-addresses');
            }

            // quick to be used on page load where scroll and animation is not desired.
            if(quick) {
                addressContainer.show();
            } else {
                $.scrollTo(
                    $(elementToScrollTo),
                    {
                        duration:500,
                        offset: {
                            top: - $('.header-wrapper').height()
                        },
                        onAfter: function() {
                            addressContainer.slideDown(500);
                        }
                    }
                );
            }
        };

        var showEditAddressForm = function(address) {
            $('.address-item-details').css('opacity', 0.5);
            $('.edit-btn[data-address-id="' + address.id + '"]').closest('.address-item-details').css('opacity', 1);
            addressForm.clear();
            addressForm.populate(address);
            addressForm.show(options.addressForm.mode.edit);
            $('#addressBookAddressSelector').hide();
            var elementToScrollTo = $('.addressBk-container:visible');
            if (! elementToScrollTo.exists() ) {
                elementToScrollTo = $('.account-addresses');
            }
            $.scrollTo(
                $(elementToScrollTo),
                {
                    duration:500,
                    offset: {
                        top: - $('.header-wrapper').height()
                    },
                    onAfter: function() {
                        addressContainer.slideDown(500);
                    }
                }
            );
            cancelAddressButton.show();
        };

        var showEmptyAddressBook = function(quick) {
            addressesMessageSection.html($.tmpl(addressMessageTemplate, {
                key: "empty"
            }));
            showNewAddressForm(quick);
            cancelAddressButton.hide();
            addressesSection.hide();
        };

        var showAddressBook = function() {
            $.each(addresses, function(count, address) {
                addressesSection.append($.tmpl(addressViewTemplate, {
                    address: address
                }));
            });
            addressesSection.show();
            addAddressButton.show();
        };

        var clearAddressBook = function() {
            addressesSection.empty();
            addressesMessageSection.empty();
            addAddressButton.hide();
        };

        var populateAddressData = function() {
            loadAddresses().then(function(addressesData) {
                addresses = addressesData;

                clearAddressBook();

                if (addresses.length > 0) {
                    showAddressBook();
                } else {
                    showEmptyAddressBook(true);
                }
            });
        };

        var bindToColorboxClose = function() {
            $(document).on("click", ".closeColorBox", function () {
                overlay.close();
            })
        }

        var onRemoveAddressButtonClick = function() {
            var addressId = $(this).data("address-id");
            removeAddress(addressId).then(function() {
                overlay.close();
                populateAddressData();
            });
        }

        var bindEditAddress = function() {
             $('.account-addresses').on("click", ".edit-btn", function () {
                var addressId = $(this).data("address-id").toString();

                addressesMessageSection.html($.tmpl(addressMessageTemplate, {
                    key: "edit"
                }));

                var address = getAddress(addressId);
                showEditAddressForm(address);
             });
        };

        var bindAddAddress = function() {
            addAddressButton.on("click", function() {
                addressesMessageSection.html($.tmpl(addressMessageTemplate, {
                    key: "new"
                }));

                showNewAddressForm();
            });
        };

        var bindRemoveAddressConfirmation = function() {
            $('.account-addresses').on("click", ".delete-btn", function () {
                var addressId = $(this).data("address-id").toString();

                addressDeletePopup.find(".address-modal-content").html($.tmpl(addressDeleteTemplate, {
                    address: getAddress(addressId)
                }));

                overlay.openWithElement({
                    element: addressDeletePopup
                });

                addressDeletePopup.find(".continue-delete-btn").on("click", onRemoveAddressButtonClick);
            });
        }

        var initAddressForm = function() {
            addressForm.init(ADDRESS_TYPE, {
                url: {
                    addAddress: "/ajax/account/address/save"
                },
                outEvents: {
                    addressAdded: "account:address:added"
                },
                switchCountry: false
            });
        };

        var onAddressSaved = function() {
            addressForm.hide();
            addressContainer.hide();
            populateAddressData();
            $('.address-item-details').css('opacity', 1);
        };

        var onAddressCancelled = function() {
            addressContainer.hide();
            $('.address-item-details').css('opacity', 1);
        };

        var initAddressObjects = function() {
            addressesSection = $(".account-addresses");
            addressesMessageSection = $(".account-addresses-message");

            addressContainer = $(".addressBk-container");

            addressMessageTemplate = $(".addressMessageTemplate");
            addressViewTemplate = $(".addressViewTemplate");

            cancelAddressButton = $(".cancelAddressBtn");
            addAddressButton = $(".add-address-btn");

            addressDeletePopup = $("#popup_confirm_address_removal");
            addressDeleteTemplate = $(".addressDeleteTemplate");
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initAddressObjects();
            initAddressForm();

            $(function() {
                populateAddressData();

                bindToColorboxClose();

                bindEditAddress();
                bindAddAddress();
                bindRemoveAddressConfirmation();

                addressForm.callbacks.onAddressSaved.add(onAddressSaved);
                addressForm.callbacks.onAddressCancelled.add(onAddressCancelled);
            });
        }

        return {
            init: init
        };

  })();

  window.MF = MF;

}(jQuery, this, this.document, MF.overlay, MF.newAddress));

if ($(".page-addressbook").exists()) {
    MF.address.init();
}
