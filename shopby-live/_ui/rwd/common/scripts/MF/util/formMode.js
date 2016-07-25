/*
 *  requires
 */

;(function($, window) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        modeData: "mode",
        inputMarkerClass: ".form_input",
        modeClass: ".mode-{MODE}",
        modeAttribute: "mode-{MODE}"
    };

    MF.formMode = (function() {

        var options;

        var switchModeAttributes = function(form, mode) {
            var dataAttributeName = options.modeAttribute.replace("{MODE}", mode);

            form.find("[data-" + dataAttributeName + "]").each(function() {
                var element = $(this);
                var modeAttributes = element.data(dataAttributeName);
                var attributesExpressions = modeAttributes.split(";");

                $(attributesExpressions).each(function() {
                    var attributeParams = this.split(":");
                    element.attr(attributeParams[0], attributeParams[1]);
                });
            });
        };

        function switchMode (form, mode) {
            form.data(options.modeData, mode);

            var modeClass = options.modeClass.replace("{MODE}", mode);
            form.find(options.inputMarkerClass + ":not(" + modeClass + ")").hide();
            form.find(options.inputMarkerClass + modeClass).show();

            switchModeAttributes(form, mode);
        }

        function checkMode (form, mode) {
            var currentMode = form.data(options.modeData);
            return mode === currentMode;
        }

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);
        }

        return {
            init: init,
            switchMode: switchMode,
            checkMode: checkMode
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.formMode.init();
