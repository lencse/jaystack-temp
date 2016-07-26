/*
 *  requires
 *
 *  MF.addressValidator
 *  MF.addressSearch
 *  MF.formMode
 *  MF.shippingCountrySwitch
 */

;(function($, window, mediator, handlebars, addressValidator, addressSearch, formMode, shippingCountrySwitch, select) {
    "use strict";

    var MF = window.MF || {};

    var NO_VALUE = null;

    var defaultOptions = {
        url: {
            addAddress: NO_VALUE
        },
        data: {
            root: "data",
            address: NO_VALUE
        },
        outEvents: {
            addressAdded: NO_VALUE
        },
        addressLookup: {
            countries: ["GBR", "USA"]
        },
        switchCountry: true,
        previousCountryCode: null
    };

    var modes = {
        manualOnly: "manual_only",
        manual: "manual",
        lookup: "lookup"
    };

    MF.newAddress = function() {

        var context, options;

        var addressSelectorId, newAddress, addressForm, addressFormValidator, lookupMessageTemplate,
            cancelAddressBtn, saveAddressBtn, lookupAddressesTemplate, lookupAddressBtn, lookupAddressesSelect,
            lookupMessage, lookupAddresses, useManualLink, useLookupLink, countrySelect,
            addressLookupHouse, addressPostcode, postCodeInput, addressIdHiddenInput;

        var callbacks = {
            onAddressSaved: $.Callbacks("unique stopOnFalse"),
            onAddressCancelled: $.Callbacks("unique stopOnFalse")
        };

        var addressSaved = false;
        var propertyChangeUnbound = false;

        var initDropdownSelector = function(contextID, callbackFn) {
            select.init({
                contextId: contextID,
                callback: callbackFn || $.noop
            });
        };

        var showAddressForm = function(mode) {
            changeAddressFormModeBasedOnCountry(mode);
            savePreviousCountryCode();
            newAddress.show();
        };
        
        var savePreviousCountryCode = function() {
        	options.previousCountryCode = countrySelect.val();
        };

        var hideAddressForm = function() {
            newAddress.hide();
        };

        var clearAddressForm = function() {
            addressForm[0].reset();
            addressForm.find("[name=id]").val("");

            select.refresh("#" + context + "TitleSelector");
            select.refresh("#" + context + "CountrySelector");
            select.refresh(addressSelectorId);

            addressFormValidator.resetForm();
        };

        var ensureSelectedTitleIsPresentInTheList = function(address) {
            var $titleSelect = addressForm.find("[name=titleCode]");
            var optionNotExists = $titleSelect.find("option[value='" + address.titleCode + "']").length === 0;

            if(optionNotExists) {
                var $newTitleOption = $("<option></option>")
                    .val(address.titleCode)
                    .text(address.title)
                    .attr("label", address.title);

                $titleSelect.append($newTitleOption);

                MF.select.refresh("#" + context + "TitleSelector");
            }
        };

        var populateAddressForm = function(address) {

            ensureSelectedTitleIsPresentInTheList(address);

            addressForm.find("[name=id]").val(address.id);
            addressForm.find("[name=titleCode]").val(address.titleCode).change();
            addressForm.find("[name=firstName]").val(address.firstName);
            addressForm.find("[name=lastName]").val(address.lastName);
            addressForm.find("[name=countryIso]").val(address.country.isocode).change();
            addressForm.find("[name=line1]").val(address.line1);
            addressForm.find("[name=line2]").val(address.line2);
            addressForm.find("[name=line3]").val(address.line3);
            addressForm.find("[name=town]").val(address.town);
            addressForm.find("[name=countyState]").val(address.countyState);
            addressForm.find("[name=postalCode]").val(address.postalCode);
            addressForm.find("[name=phone]").val(address.phone);
            addressForm.find("[name=phone2]").val(address.phone2);
        };

        var publishAddressAddedEvent = function(response, addressId) {
            mediator.publish(options.outEvents.addressAdded);
            callbacks.onAddressSaved.fire(response, addressId);
        };

        var onAddressFormSave = function() {
            onSwitchAddressFormSave();
            if (validateForm()) {

                return options.switchCountry ? switchCountry(options.previousCountryCode) : saveAddressForm();
            }
        };

        var onAddressFormCancel = function() {
            hideAddressForm();
            callbacks.onAddressCancelled.fire();
        };

        var validateForm = function() {
            return addressFormValidator.form();
        };

        var isInLookupMode = function() {
            return formMode.checkMode(addressForm, "lookup");
        };

        var switchMode = function(mode) {
            formMode.switchMode(addressForm, mode);
        };

        var switchCountry = function(previousCountryCode) {
            return shippingCountrySwitch.switchCountry({
                "countryCode": countrySelect.val(),
                "previousCountryCode" : previousCountryCode,
                "handlers": {
                    "onContinue": saveAddressForm,
                    "onCountryWithinCurrentSite": saveAddressForm
                }
            });
        };

        var showAddressSavedMessage = function() {
            // change button text, disable?
            addressForm.find(".save__address").hide();
            addressForm.find(".address__saved").show()
            if ( $(".address__saved:visible") ) addressForm.find('.saveAddressBtn').attr('disabled','disabled');
            addressSaved = true;
            switchSavedButton();
        };

        var switchSavedButton = function () {
            addressForm.on("input", function() {
                if (!propertyChangeUnbound) {
                    addressForm.unbind("propertychange");
                    propertyChangeUnbound = true;
                }
                addressForm.find(".save__address").show();
                addressForm.find('.saveAddressBtn').removeAttr('disabled');
                addressForm.find(".address__saved").hide();

                $("#deliveryMethodTable").empty();
                $("#shippingMethodSection").find(".para-info:first").show();
            });
        };

        var onAddressAdded = function(response) {
            if (response.status === "SUCCESS") {
                showAddressSavedMessage();
                setAddressId(response.data.id);
                publishAddressAddedEvent(response, response.data.id);

            } else {

                handleErrors(response);
                console.error("address is not valid");

            }
        };

        var handleErrors = function(response){

            if(response.message == "text.account.address.alreadyExist"){
                $("#addressAlreadyExists").show();
            }else{
                $("#addressAlreadyExists").hide();
            }

            if(response.message == "text.address.postcode.restricted.kor"){
                $("#addressKorPostcodeRestricted").show();
            }else{
                $("#addressKorPostcodeRestricted").hide();
            }
        }

        var setAddressId = function(addressId) {
            addressIdHiddenInput.val(addressId);
        };

        var saveAddressForm = function() {
            return $.post(options.url.addAddress, addressForm.serialize())
                .then(function(response) {
                    onAddressAdded(response);
                    return response;
                })
                .fail(function() {
                    console.error("cannot save address");
                });
        };

        var showLookupMessage = function() {
            MF.spinnerHandler.hideSpinner(lookupAddressBtn);
            lookupMessage.html(lookupMessageTemplate());
            $(".chk__mode__feedback").removeClass("hidden");

        };

        var validateLookupModeFields = function() {
            return addressFormValidator.formWithContext({
                reason: "lookupAddressBtn"
            });
        };

        var onAddressLookup = function() {
            if (validateLookupModeFields()) {
                var postcode = addressPostcode.val();
                var building = addressLookupHouse.val();
                var country = countrySelect.val();

                lookupAddressesSelect.empty();
                lookupMessage.empty();
                $(".chk__mode__feedback").addClass("hidden");

                MF.spinnerHandler.showSpinner(lookupAddressBtn);
                addressSearch.lookup(postcode, building, country)
                    .then(populateLookupAddressesDropDown)
                    .fail(showLookupMessage);
            }
        };

        var renderLookupAddresses = function(addresses) {
            lookupAddressesSelect.append(lookupAddressesTemplate({
                addresses: lookupAddresses,
                multipleResults: addresses.length > 1
            }));

            select.refresh(addressSelectorId);
        };

        var populateLookupAddressesDropDown = function(addresses) {
            lookupAddresses = addresses;

            if (lookupAddresses.length > 0) {
                MF.spinnerHandler.hideSpinner(lookupAddressBtn);
                renderLookupAddresses(lookupAddresses);

                if(lookupAddresses.length === 1) {
                    handleLookupAddressSelection(lookupAddresses[0]);
                }
            } else {
                showLookupMessage();
            }

            toggleAddressSelector(lookupAddresses.length);

            select.refresh(addressSelectorId);
        };

        var toggleAddressSelector = function(numberOfAddresses) {
            if(lookupAddresses.length > 1) {
                $(addressSelectorId).show();
            } else {
                $(addressSelectorId).hide();
            }
        };

        var onLookupAddressChange = function(value) {
            var selectedLookupAddress = lookupAddresses[value];

            if (selectedLookupAddress) {
                handleLookupAddressSelection(selectedLookupAddress);
            }
        };

        var handleLookupAddressSelection = function(lookupAddress) {
            switchMode(modes.manual);
            populateAddressFormWithLookupData(lookupAddress);
            postCodeInput.addClass("fullWidthPostCode");
        };

        var populateAddressFormWithLookupData = function(address) {
            addressForm.find("[name=line1]").val(address.address1);
            addressForm.find("[name=line2]").val(address.address2);
            addressForm.find("[name=postalCode]").val(address.postcode);
            addressForm.find("[name=town]").val(address.town);
            addressForm.find("[name=countyState]").val(address.region);
        };

        var onCountryChange = function() {
            changePostalCodeOption();
            changeAddressFormModeBasedOnCountry();
        };

        var changePostalCodeOption = function() {
            var pco = countrySelect.find(':selected').data("postalcodeoption");

            if (pco == "HIDE") {
                addressForm.find("[name=postalCode]").val("");
                postCodeInput.hide();
            } else {
                postCodeInput.show();
            }
        };

        var changeAddressFormModeBasedOnCountry = function(preferredMode) {
            var country = countrySelect.val();

            if(country === options.addressLookup.countries[0]){
                updatePlaceholderText("remove");
            } else if(country === options.addressLookup.countries[1]){
                updatePlaceholderText("add");
            } else {
                addressForm.find(".post-code--input").addClass("fullWidthPostCode");
            }

            if ($.inArray(country, options.addressLookup.countries) === -1) {
                switchMode(modes.manualOnly);
            } else if (preferredMode) {
                switchMode(preferredMode);
            } else if (formMode.checkMode(addressForm, modes.manualOnly)) {
                switchMode(modes.manual);
            } else {
                $('.useLookupLink:visible').click();
            }
        };

        var updatePlaceholderText = function(required){
            var houseNum = addressForm.find("[name='lookupHouse']");
            var houseNumPlaceholder = houseNum.attr("placeholder");
             if(required === "add"){
                 if( houseNumPlaceholder.slice(-1) !== "*" ){
                     houseNum.attr("placeholder", houseNumPlaceholder + "*");
                 }
             } else {
                 if( houseNumPlaceholder.slice(-1) === "*" ){
                     houseNum.attr("placeholder", houseNumPlaceholder.replace(/\*$/, ''));
                 }
             }
        };

        var updateCountyPlaceholder = function(){
            var countyState = addressForm.find("[name='countyState']");
            var countyStatePlaceholder = countyState.attr("placeholder");
            if(countrySelect.val() === 'USA'){
                if( countyStatePlaceholder.slice(-1) !== "*" ){
                    countyState.attr("placeholder", countyStatePlaceholder + "*");
                }
            }
        };

        var onSwitchAddressFormToManualMode = function(event) {
            event.preventDefault();
            postCodeInput.addClass("fullWidthPostCode");
            switchMode(modes.manual);
        };

        var onSwitchAddressFormSave = function(event) {
            postCodeInput.addClass("fullWidthPostCode");
            changeAddressFormModeBasedOnCountry(modes.manual);
        };

        var onSwitchAddressFormToLookupMode = function(event) {
            event.preventDefault();
            postCodeInput.removeClass("fullWidthPostCode");
            switchMode(modes.lookup);
        };

        var compileTemplate = function(template) {
            return template ? handlebars.compile(template) : null;
        };

        var initAddressObjects = function() {
            addressSelectorId = "#" + context + "AddressSelector";

            newAddress = $("#" + context + "_newAddress");
            addressForm = newAddress.find(".addressForm");
            postCodeInput = newAddress.find(".post-code--input");

            useManualLink = addressForm.find(".useManualLink");
            useLookupLink = addressForm.find(".useLookupLink");

            countrySelect = addressForm.find("[name=countryIso]");
            addressLookupHouse = addressForm.find("[name=lookupHouse]");
            addressPostcode = addressForm.find("[name=postalCode]");

            lookupMessage = addressForm.find(".lookupMessage");
            lookupAddressesSelect = addressForm.find("[name=lookupAddressesSelect]");
            lookupAddressBtn = addressForm.find(".lookupAddressBtn");
            saveAddressBtn = addressForm.find(".saveAddressBtn");
            cancelAddressBtn = addressForm.find(".cancelAddressBtn");

            lookupMessageTemplate = compileTemplate(newAddress.find(".lookupMessageTemplate").html());
            lookupAddressesTemplate = compileTemplate(newAddress.find(".lookupAddressesTemplate").html());

            addressIdHiddenInput = addressForm.find("[name=id]");
        };

        var initAddressFormValidator = function(addressForm) {
            addressFormValidator = addressValidator.validate(context, addressForm);
        };

        function init(ctx, opts) {
            context = ctx;
            options = $.extend({}, defaultOptions, opts);

            initAddressObjects();
            initAddressFormValidator(addressForm);
            updateCountyPlaceholder();

            initDropdownSelector("#" + context + "TitleSelector");
            initDropdownSelector("#" + context + "CountrySelector", onCountryChange);
            initDropdownSelector(addressSelectorId, onLookupAddressChange);

            $(function() {
                changePostalCodeOption();

                useManualLink.on("click", onSwitchAddressFormToManualMode);
                useLookupLink.on("click", onSwitchAddressFormToLookupMode);

                lookupAddressBtn.on("click", onAddressLookup);
                lookupAddressesSelect.on("change", onLookupAddressChange);

                saveAddressBtn.on("click", onAddressFormSave);
                if (cancelAddressBtn.exists()) {
                    cancelAddressBtn.on("click", onAddressFormCancel);
                }
            });
        }

        return {
            init: init,
            callbacks: callbacks,
            show: showAddressForm,
            hide: hideAddressForm,
            populate: populateAddressForm,
            clear: clearAddressForm,
            validate: validateForm,
            modes: modes,
            switchMode: switchMode,
            isInLookupMode: isInLookupMode,
            save: saveAddressForm
        };
    };

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, Handlebars, MF.addressValidator, MF.addressSearch, MF.formMode, MF.shippingCountrySwitch, MF.select));
