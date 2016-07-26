

;(function($) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        shareByEmailBtn : "[data-share='shareByEmail']",
        shareByEmailContainer : "#shareByEmailContainer"
    };

    MF.shareByEmail = (function() {
        var options,
            $shareByEmailBtn,
            $shareByEmailContainer;

        var initEvents = function() {

            var shareByEmailModal = $('#shareByEmailContainer');

            $(options.shareByEmailBtn).on("click", function(e){
                e.preventDefault();

                MF.overlay.openWithElement({
                    element: shareByEmailModal,
                    callbacks: {
                        open: function() {}
                    }
                });
            });
        };

        var initGlobals = function(opts) {
            options = $.extend({}, defaults, opts);
        };

        var initUI = function() {
            $shareByEmailBtn = $(options.shareByEmailBtn);
        };

        var init = function(opts) {
            initGlobals(opts);

            $(document).ready(function() {
                initUI();
                initEvents();
            });
        };

        return {
            init: init
        };
    }());

    window.MF = MF;

}(jQuery));

MF.shareByEmail.init();