/*
 *  requires
 */

;(function($, window, validator) {
    "use strict";

    var MF = window.MF || {};

    MF.passwordFormValidator = (function() {

        var validationRules = {
            currentPassword: {
                required: true
            },
            newPassword: {
                pattern: '^(?=.{6,255}$)(?=.*?[A-Z])(?=.*?\\d).*',
                required: true
            },
            checkNewPassword: {
                required: true,
                equalTo: "[name='newPassword']"
            },
            passwordHint: {
                required: true
            }
        };

        var errorPlacement = function(error, element) {
            error.insertBefore(element);
        };

        var validatePasswordForm = function(passwordForm) {
            return validator.validate(passwordForm, {
                onsubmit: true,
                rules: validationRules,
                errorPlacement: errorPlacement
            });
        };

        return {
            validate: validatePasswordForm
        }
    }());

}(jQuery, this, MF.validator));