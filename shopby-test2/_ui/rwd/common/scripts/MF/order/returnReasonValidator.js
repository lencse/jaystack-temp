/*
 *  requires
 */

;(function($, window, validator) {
    "use strict";

    var MF = window.MF || {};

    MF.returnReasonValidator = (function() {

        var defaults = $.validator.defaults;

        var validate = function(form) {

            return validator.validate(form, {
                onfocusout: function(element) {
                    return $(element).valid();
                },
                rules: {
                    returnReason: {
                        required: true
                    }
                },
                errorPlacement: function(error, element) {
                    var errorContainer = $("#" + element.data("error-container"));

                    if (errorContainer.exists()) {
                        errorContainer.html(error);
                    } else {
                        error.insertBefore(element); // Default error placement
                    }
                }
            });

        };

        return {
            validate: validate
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.validator));
