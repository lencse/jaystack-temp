/*
 *  requires
 */

;(function($, window) {
    "use strict";

    var MF = window.MF || {};

    var jqueryDefaults = $.validator.defaults;

    var isMfSelect = function(el) {
        return el.tagName === "SELECT" && $(el).data("mf-select") !== undefined;
    };

    var clearServerSideError = function(element) {
        var $elementContainer = $(element).closest(".control-group.error");

        $elementContainer.removeClass("error");
        $(".error-message", $elementContainer).remove();
    };

    var defaultSettings = {
        onfocusout: function(element) {
            if(isMfSelect(element)) {
                $(element).valid();
            }
        },
        highlight: function (element, errorClass, validClass) {

            clearServerSideError(element);

            if (isMfSelect(element)) {
                $(element).next(".cs__selected")
                    .addClass(errorClass)
                    .removeClass(validClass);
            } else {
                jqueryDefaults.highlight.call(this, element, errorClass, validClass);
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            if (isMfSelect(element)) {
                $(element).next(".cs__selected")
                    .removeClass(errorClass)
                    .addClass(validClass);
            } else {
                jqueryDefaults.unhighlight.call(this, element, errorClass, validClass);
            }
        }
    };

    var extensions = {
        validateFields: function(/* elements */) {
            var validator = this;
            var $form = $(validator.currentForm);
            var elements = Array.prototype.slice.call(arguments, 0);

            return _.all(elements, function(element) {
                return validator.element($form.find(element));
            });
        },
        formWithContext: function(context) {
            var validator = this;

            validator.context = context;
            var result = validator.form();
            validator.context = {};

            return result;
        }
    };

    MF.validator = (function() {

        var validate = function(form, opts) {
            var $form = $(form);

            var settings = $.extend({}, defaultSettings, opts);
            var validator = $form.validate(settings);

            $.extend(validator, extensions);

            return validator;
        };

        return {
            validate: validate
        };
    }());

    window.MF = MF;

}(jQuery, this));
