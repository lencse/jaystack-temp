;(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.cookiebar = (function () {

        function init() {
            $.ajax({
                cache: true,
                url: '/component/json/cookiePolicyBannerEU',
            })
            .done(function(data) {
                if ( data.data !== ''){
                    $.cookieBar({
                        message: data.data.content,
                        fixed: true,
                        acceptButton: true,
                        acceptText: '',
                        forceShow: false,
                        autoEnable: true,
                        policyButton: false,
                        acceptOnContinue: true,
                        acceptAnyClick: false,
                        renewOnVisit: true,
                        effect: 'slide',
                        bottom: true,
                        expireDays: 365,
                        zindex: '10000'
                    });
                    if ( $('#cookie-bar').length ){
                        $('#cookie-bar .cb-enable').addClass('mfp-close');
                    }
                }
            })
            .fail(function() {
            })
            .always(function() {
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

$(document).ready(function() {
    MF.cookiebar.init();
});
