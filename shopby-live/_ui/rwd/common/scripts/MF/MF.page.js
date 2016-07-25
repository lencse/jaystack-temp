/*
 *  requires
 */

;(function($, window, formMode) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        data: {
            pageUrl: "page-url",
            newPageUrl: "new-page-url"
        }
    };

    MF.page = (function() {

        var options;

        var getPageByDataUrl = function() {
            var url = $(this).data(options.data.pageUrl);
            window.location = url;
        };

        var getNewPageByDataUrl = function() {
            var url = $(this).data(options.data.newPageUrl);
            window.open(url);
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            $(function() {
                $("[data-" + options.data.pageUrl + "]").on("click", getPageByDataUrl);
                $("[data-" + options.data.newPageUrl + "]").on("click", getNewPageByDataUrl);
            });

            //this forces firefox to refresh the page (and trigger document.ready and window.onload events) when user uses the history buttons
            $(window).on('unload beforeunload', function(){});
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.formMode));

MF.page.init();
