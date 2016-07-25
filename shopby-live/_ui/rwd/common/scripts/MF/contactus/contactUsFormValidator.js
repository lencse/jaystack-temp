/*
 *  requires
 */

;(function($, window, validator) {
    "use strict";

    var MF = window.MF || {};

    MF.contactUsFormValidator = (function() {
        var enquirySelectId = $("#typeOfEnquiry").find('select').attr("id");

        var countrySelectId = $("div#countrySelect select").attr("id");
        var sizeSelectId = $("div#sizeSelect select").attr("id");

        var validationRules = {
            name: {
                required: true
            },
            "last-name": {
                required: true
            },
            email: {
                required: true,
                pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
            },
            phone: {
                required: {
                depends: function(element) {
                      // if user selects phone then phone is required
                      var selectorsVal = $("#contactByPhone, #contactByPhone_sg").is(":checked");
                      if (selectorsVal){ $('#phone').attr('placeholder','Phone*');}else{$('#phone').attr('placeholder','Phone')}
                      return selectorsVal
                    }
                 }
            },
            typeOf: {
                required: true // Type of enquiry
            },
            subject: {
                required: true // Type of enquiry
            },
            description : {
              required: true
            }
        };

        validationRules[countrySelectId] = {
            required: true // Country field is required
        };

        validationRules[enquirySelectId] = {
            required: true // Type of enquiry field is required
        };

        validationRules[sizeSelectId] = {
            required: true // Size is required
        };

        var errorPlacement = function(error, element) {
            error.insertBefore(element);
        };

        var validateContactUsForm = function(contactUsForm) {
            return validator.validate(contactUsForm, {
                onsubmit: true,
                rules: validationRules,
                errorPlacement: errorPlacement
            });
        };

        return {
            validate: validateContactUsForm
        }
    }());

}(jQuery, this, MF.validator));
