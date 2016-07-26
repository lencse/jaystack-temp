/*
 *  requires
 *  MF.checkout.mediator
 *  MF.formMode
 */

;(function($, window, mediator, formMode) {
    "use strict";

    var MF = window.MF || {};

    var NO_VALUE = null;

    var defaultOptions = {
        addressForm: {
            mode: "manual"
        },
        inEvents: {
            addressSet: NO_VALUE
        }
    };

    MF.addressInfo = function(editAddressForm) {

        var options, context;

        var addressInfo, addressData, addressSelector, addressDetails, addressInfoTemplate, editAddressLink;

        var onAddressSelectedEvent = function(address) {
            addressData = address;
            populateAddressInfo();
        };

        var onEditAddressLinkClick = function(e) {
            e.preventDefault();
            populateEditAddressForm();
        };

        var populateAddressInfo = function() {
            mediator.publish('addressInfo:edit:enterViewMode');
            formMode.switchMode(addressInfo, "view");
            addressDetails.html(addressInfoTemplate(addressData));
        };

        var populateEditAddressForm = function() {
            mediator.publish('addressInfo:edit:enterEditMode');
            formMode.switchMode(addressInfo, "edit");

            editAddressForm.clear();
            editAddressForm.populate(addressData);
            editAddressForm.show(options.addressForm.mode);
            addressInfo.addClass("reviewEditMode");
            addressInfo.parents(".saved-address").addClass("savedAddressEditMode");
            addressInfo.find(".post-code--input").addClass("fullWidthPostCode");
        };

        var initObjects = function(address) {
            addressSelector = $("#" + context + "_addressSelector");

            addressInfo = addressSelector.find(".address-info");

            addressDetails = addressSelector.find(".addressDetails");
            addressInfoTemplate = Handlebars.compile(addressSelector.find('.addressInfoTemplate').html());
        };

        var bindButtons = function() {
            addressSelector.on("click", ".editAddressLink", onEditAddressLinkClick);
        };

        var subscribeToInputEvents = function() {
            mediator.subscribe(options.inEvents.addressSelected, onAddressSelectedEvent);
        };

        var init = function(ctx, opts) {
            options = $.extend({}, defaultOptions, opts);
            context = ctx;

            initObjects();

            $(function() {
                bindButtons();
                subscribeToInputEvents();
            });
        };

        return {
            init: init
        };

    };

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.formMode));
