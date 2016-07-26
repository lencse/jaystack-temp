;(function($) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        descriptionContainer: ".pdp__description-wrapper"
    };

    MF.stickyDescription = (function() {

        var options,
            $descriptionContainer;

        var stickDescription = function(opts) {
            options = $.extend({}, defaults, opts);
            $descriptionContainer = $(options.descriptionContainer);

            $descriptionContainer.stick_in_parent();
        };

        var unstuckDescription = function() {
            $descriptionContainer.trigger("sticky_kit:detach");
        };

        return {
            stick:  stickDescription,
            unstick: unstuckDescription
        };
    })();

    window.MF = MF;

}(jQuery));