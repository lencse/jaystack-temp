;(function ($, window, document) {
    'use strict';
    var MF = window.MF = window.MF || {};
    MF.fullHeight = (function () {
        var currentHeight, initialHeight, $window, $body, $targetElement, initialized = false;
            var jq_mf_footer = $('.mf-footer');

        function init() {
            if (initialized) {
                return;
            }
            initialized = true;
            $body = $('body');
            $window = $(window);
            $targetElement = $('.checkout__payment-footer');
            if ($targetElement.length == 0) {
                $targetElement = $('.ft__back-top');
            }
            initialHeight = parseInt($targetElement.css('margin-top'));
            currentHeight = parseInt($targetElement.css('margin-top'));
            registerEvents();

        }

        function adjustHeight() {
            //Because at least the PPC page - the height adjustment keeps being called so we need to adjust the code so the calculation is done properly
            if ($('body').hasClass('page-ppcDesignerPagex')) {
                //JQuery height() doesn't work properly for some reason
                var docHeight = window.innerHeight;
                var footerHeight = jq_mf_footer.height();
                var footerTop = jq_mf_footer.position().top + footerHeight;
                if (footerTop < docHeight) {
                    jq_mf_footer.css('margin-top', 10+ (docHeight - footerTop) + 'px');
                }
                //$( window ).resize(function() {
                //    adjustHeight();
                //});
                setTimeout(adjustHeight, 300);
            }
            else{
                //TODO: we need to refactor this code so it basically works like my code above as its more efficient :)
                currentHeight = $window.height() - $body.height() + currentHeight;
                currentHeight = Math.max(currentHeight, initialHeight);
                $targetElement.css('margin-top', currentHeight + 'px');
                if ($body.height() - $window.height() < 0) {
                    setTimeout(adjustHeight, 300);
                }
            }
        }

        function registerEvents() {
            $(window).on('resize load', adjustHeight);
        }

        return {
            init: init
        }
    }

        )()
})(jQuery, this, this.document);

MF.fullHeight.init();
