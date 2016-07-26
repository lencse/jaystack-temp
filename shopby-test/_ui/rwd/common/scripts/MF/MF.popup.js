// Based on meta_prd.js which is hosted on S3

;(function($, window, document) {
    'use strict';

    var MF = window.MF || {};
    // var host = window.location.hostname;
    // var protocol = window.location.protocol;
    // var url = protocol+'//'+host+'/component/json/';
    var url = '/component/json/';
    var number_of_popup_load_events = 0;
    var popup_html

    MF.popup = (function() {

        var defaults = {};

        function init(html) {
            // Bind Init
            popup_html = html;
            bindOverlay();

        }

        function bindOverlay() {
            getOverlayContent();
        }

        function getOverlayContent() {
            popOverlay();
            get_overlay_content_for_updates();
        }

        // // Privacy Popup.
        // will ajax privacy_content_html content slot into overlay.

        function closePopUp() {
            $(".mfp-close").trigger("click");
        }

        function popOverlay() {
            // create overlay
            $('body').append('<div id="genericPopUp" class="generic-popup mf-overlay mfp-hide"><div class="generic-popup__wrapper" id="genericPopUpContent"></div></div>');

            MF.overlay.openWithElement({
                element: $("#genericPopUp")
            });

           // setTimeout(function() { picturefill();}, 1000);
        }

        function popOverlay_for_updates() {
            // create overlay
            $('body').append('<div id="genericPopUp" class="updates-popup generic-popup mf-overlay mfp-hide"><div class="generic-popup__wrapper" id="genericPopUpContent"></div></div>');

            MF.overlay.openWithElement({
                element: $("#genericPopUp")
            });
        }

        function get_overlay_content_for_updates() {
            $('#genericPopUpContent').html(popup_html);
        }

        return {
            init: init,
            closePopUp: closePopUp
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

