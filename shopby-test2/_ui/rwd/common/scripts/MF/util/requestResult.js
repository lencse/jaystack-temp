/*
 *  requires jQuery
 */

;(function($) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {};

    MF.requestResult = (function() {

        var options;

        var status = {
            SUCCESS: "SUCCESS",
            FAIL: "FAIL",
            ERROR: "ERROR"
        };

        var withStatus = function(expectedStatus, result) {
            return result && result.status === expectedStatus;
        };

        var withReason = function(reasonCode, result) {
            return result && result.data.reason === reasonCode;
        };

        var defineFilter = function(handler, filterFunc) {
            return function(filterValue) {
                handler.filters.push(_.partial(filterFunc, filterValue));
                return handler;
            };
        };

        var injectFilters = function(handler) {
            handler.filters = [];
            handler.withStatus = defineFilter(handler, withStatus);
            handler.withReason = defineFilter(handler, withReason);
        };

        var handleResponse = function(callback) {
            var responseHandler = function handler(result) {
                var canExecuteCallback = _.all(handler.filters, function(filter) {
                    return filter(result);
                });

                if(canExecuteCallback) {
                    return callback(result);
                }

                return result;
            };

            injectFilters(responseHandler);

            return responseHandler;
        };

        var onSuccess = function(callback) {
            return handleResponse(callback).withStatus(status.SUCCESS);
        };

        var onError = function(callback) {
            return handleResponse(callback).withStatus(status.ERROR);
        };

        var onFail = function(callback) {
            return handleResponse(callback).withStatus(status.FAIL);
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);
        };

        return {
            init: init,
            status: status,
            handle: handleResponse,
            onSuccess: onSuccess,
            onError: onError,
            onFail: onFail
        };

    })();

    window.MF = MF;

}(jQuery));

MF.requestResult.init();
