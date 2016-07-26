/*
 *  requires
 */

;(function($, window) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            lookupAddress: "/ajax/addresslookup?postcode={POSTCODE}&building={BUILDING}&country={COUNTRY}"
        }
    };

    MF.addressSearch = (function() {

        var options;

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);
        }

        function lookup(postcode, building, country) {
            var lookupUrl = options.url.lookupAddress
                .replace("{POSTCODE}", postcode)
                .replace("{COUNTRY}", country)
                .replace("{BUILDING}", building);

            return $.getJSON(lookupUrl)
                .fail(function() {
                    console.error("cannot lookup address data");
                });
        }

        return {
            init: init,
            lookup: lookup
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.addressSearch.init();
