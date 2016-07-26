/*
 *  requires
 */

;(function($, window) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        contentClass: ".modal-content",
        confirmationContentClass: ".modal-confirmation-content",
        confirmationCloseClass: ".modal-confirmation-close"
    };

    MF.modal = (function() {

        var options;

        function showConfirmation(modal, confirmCallback) {
            $(modal).find(options.contentClass).hide();
            $(modal).find(options.confirmationContentClass).show();

            $(modal).on("reveal:close", function() {
                if (confirmCallback) {
                    confirmCallback();
                }
            });

            $(modal).find(options.confirmationCloseClass).on("click", function() {
                $(this).trigger("reveal:close");
            });
        }

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);
        }

        return {
            init: init,
            showConfirmation: showConfirmation
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.modal.init();
