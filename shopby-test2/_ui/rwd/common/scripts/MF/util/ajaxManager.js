/*
 *  requires jQuery
 */

;(function($, window) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {};

    MF.ajaxManager = (function() {
        var options;

        var xhrPool = [], ajaxGroups = {};

        var buildRegexMatcher = function(criteria) {
            var urlPattern = new RegExp(criteria.url);

            return function(jqXHR) {
                return urlPattern.test(jqXHR.url);
            };
        };

        function AjaxGroup(matcher) {
            this.matcher = matcher;

            this.activeRequests = 0;

            this.ajaxStart = $.Callbacks("unique stopOnFalse");
            this.ajaxStop = $.Callbacks("unique stopOnFalse");
        }

        AjaxGroup.prototype.notify = function() {
            var prevActiveRequests = this.activeRequests;

            this.activeRequests = _.filter(xhrPool, this.matcher).length;

            // The first time the matched ajax request starts we fire "ajaxStart" callbacks
            if (prevActiveRequests === 0 && this.activeRequests >= 1) {
                this.ajaxStart.fire();
            }

            // When there no more matched ajax requests anymore we fire "ajaxStop" callbacks
            if (prevActiveRequests > 0 && this.activeRequests === 0) {
                this.ajaxStop.fire();
            }
        };

        var createAjaxGroup = function(name, options) {
            var matcher = options.matcher || buildRegexMatcher(options.criteria);

            var ajaxGroup = new AjaxGroup(matcher);

            if (_.isFunction(options.ajaxStart)) {
                ajaxGroup.ajaxStart.add(options.ajaxStart);
            }

            if (_.isFunction(options.ajaxStop)) {
                ajaxGroup.ajaxStop.add(options.ajaxStop);
            }

            ajaxGroups[name] = ajaxGroup;

            return ajaxGroup;
        };

        var getAjaxGroup = function(name) {
            return ajaxGroups[name];
        };

        var removeAjaxGroup = function(name) {
            ajaxGroups[name] = null;
        };

        var notifyHandlers = function() {
            _.invoke(ajaxGroups, "notify");
        };

        var setRequestHeaders = function(jqXHR) {
            // force no-cache an all ajax calls
            jqXHR.setRequestHeader("Cache-Control", "no-store");
        };

        var onAjaxBeforeSend = function(jqXHR, settings) {
            jqXHR.url = settings.url;

            setRequestHeaders(jqXHR);

            xhrPool.push(jqXHR);

            notifyHandlers();
        };

        var onAjaxComplete = function(jqXHR) {
            var index = xhrPool.indexOf(jqXHR);
            if (index > -1) {
                xhrPool.splice(index, 1);
                notifyHandlers();
            }
        };

        var abortAll = function() {
            _.invoke(xhrPool, "abort");
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            $.ajaxSetup({
                beforeSend: onAjaxBeforeSend,
                complete: onAjaxComplete,
                cache: false
            });
        };

        return {
            init: init,
            abortAll: abortAll,
            createAjaxGroup: createAjaxGroup,
            getAjaxGroup: getAjaxGroup,
            removeAjaxGroup: removeAjaxGroup
        };

    })();

    window.MF = MF;

}(jQuery, this));

MF.ajaxManager.init();
