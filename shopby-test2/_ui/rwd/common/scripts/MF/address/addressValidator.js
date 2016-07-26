/*
 *  requires
 */

;(function($, window, formMode, validator) {
    "use strict";

    var MF = window.MF || {};

    var forceHouseNumberLookup = {
        countries: ["USA"]
    };

    var modes = {
        manualOnly: "manual_only",
        manual: "manual",
        lookup: "lookup"
    };

    MF.addressValidator = (function() {

        var requireInManualMode = function(element) {
            var $addressForm = $(element.form);
            return formMode.checkMode($addressForm, modes.manual) || formMode.checkMode($addressForm, modes.manualOnly);
        };

        var requireInLookupMode = function(element) {
            var $addressForm = $(element.form);
            return formMode.checkMode($addressForm, modes.lookup);
        };

        var requireLookupAddressSelect = function(element) {
            var $addressForm = $(element.form);
            var context = $addressForm.validate().context;

            return requireInLookupMode(element) && context && context.reason !== "lookupAddressBtn";
        };

        var requireForCountry = function(element) {
            var $addressForm = $(element.form);

            var currentCountry = $addressForm.find("[name=countryIso]").val();
            return $.inArray(currentCountry, forceHouseNumberLookup.countries) !== -1;
        };

        var requiredCountyForCountry = function(element) {
            var $addressForm = $(element.form);

            var currentCountry = $addressForm.find("[name=countryIso]").val();
            return $.inArray(currentCountry, ["USA", "CAN"]) !== -1;
        };

        var requiredPostalCodeForCountry = function(element) {
            var $addressForm = $(element.form);
            var currentCountry = $addressForm.find("[name=countryIso]").find(":selected");

            return currentCountry.data("postalcodeoption") === "MANDATORY";
        };

        var countryMaxLengthPostcodeValidation = function(element)
        {
            var $addressForm = $(element.form);
            var currentCountry = $addressForm.find("[name=countryIso]").find(":selected").val();

            if('KOR'=== currentCountry)
            {
                return 5;
            }else
            {
                return 10;
            }
        }


        var validationRules = {
            titleCode: {
                maxlength: 255,
                required: requireInManualMode
            },
            firstName: {
                maxlength: 255,
                required: requireInManualMode
            },
            lastName: {
                maxlength: 255,
                required: requireInManualMode
            },
            countryIso: {
                maxlength: 255,
                required: true
            },
            lookupHouse: {
                required: requireForCountry
            },
            lookupAddressesSelect: {
                required: requireLookupAddressSelect
            },
            postalCode: {
                maxlength: countryMaxLengthPostcodeValidation,
                required: requiredPostalCodeForCountry
            },
            line1: {
                maxlength: 255,
                required: requireInManualMode
            },
            town: {
                maxlength: 30,
                required: requireInManualMode
            },
            countyState: {
                maxlength: 30,
                required: requiredCountyForCountry
            },
            phone: {
                required: requireInManualMode,
                pattern: {
					param: "(?=[\\d \\(\\)\\+\\-]+$)\\D*(\\d\\D*){9,}.*",
					depends: requireInManualMode
				}
            },
            phone2: {
                required: false,
                pattern: "(?=[\\d \\(\\)\\+\\-]+$)\\D*(\\d\\D*){9,}.*"
            }
        };

        var errorPlacement = function(error, element) {
            if (element[0].tagName === "SELECT" ) {
                error.insertBefore( element.parents(".control-label") );
            } else if (element[0].id === "address.postcode"){
                error.insertBefore( element.parents(".post-code--input") );
            } else {
                error.insertBefore(element);
            }
        };

        var validate = function(context, addressForm) {
            return validator.validate(addressForm, {
                rules: validationRules,
                errorPlacement: errorPlacement,
                errorContainer: ".generic__error__message"
            });
        };

        return {
            validate: validate
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.formMode, MF.validator));
