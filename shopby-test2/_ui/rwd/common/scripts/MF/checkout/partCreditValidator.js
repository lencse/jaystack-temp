;(function($, window) {
    "use strict";

    var MF = window.MF || {};

    MF.partCreditValidator = (function() {

        function validate(partCreditForm, maxCreditAmount) {

            var validator = partCreditForm.validate({
                onfocusout: false,
                rules: {
                    partCreditAmount: {
                        number: true,
                        max: maxCreditAmount,
                        min: 1,
                        required: true
                    }
                },
                errorContainer: ".generic__error__message"
            });

            return validator;
        }

        return {
            validate: validate
        };

    })();

    window.MF = MF;

}(jQuery, this));
