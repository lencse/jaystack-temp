;(function($){
    "use strict";
    var MF = window.MF = window.MF || {};
    var $spinner, $background;

    MF.busyOverlay = (function(){
        function enable() {
            $background = $('<div class="busy-overlay__background"></div>');
            $spinner = $('<img class="busy-overlay__icon" src="' + ACC.config.commonResourcePath + '/images/svg/preloader.gif" />');
            $('body').prepend($background);
            $('body').prepend($spinner);
            return true;
        }
        function disable() {
            $spinner = $('.busy-overlay__icon');
            $background = $('.busy-overlay__background');
            $spinner.remove();
            $background.remove();
        }
        return {
            enable: enable,
            disable: disable
        }
    })()
})(jQuery);

