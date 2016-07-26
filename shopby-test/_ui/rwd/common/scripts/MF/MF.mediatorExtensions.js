/*
 *  require
 *
 */

;(function ($, Mediator){
    'use strict';

    var ChannelPrototype = Mediator.Channel.prototype;

    var addSubscriberBase = ChannelPrototype.addSubscriber;
    var publishBase = Mediator.prototype.publish;

    var convertToArray = function(arrayLikeObj) {
        return Array.prototype.slice.call(arrayLikeObj, 0);
    };

    var isPromise = function(obj) {
        return obj && typeof obj.then === "function";
    };

    var resultCollector = [];

    var storeSubscribersResult = function(result) {
        resultCollector.push(result);
    };

    var resetResultCollector = function() {
        resultCollector = [];
    };

    var getSubscribersCallResults = function() {
        return resultCollector.slice();
    };

    /*
        Wrapping the original callback function. Storing the result of the function call.
        If result is a deferrable object (e.g. result of an AJAX call) then we return it.
        If the result is not deferrable then we consider it as deferrable which is immediately resolved
     */
    var wrapFunctionCall = function(fn) {
        return function() {
            var args = convertToArray(arguments);

            var result = fn.apply(this, args);
            var deferredResult = isPromise(result) ? result : $.Deferred().resolve(result).promise();

            storeSubscribersResult(deferredResult);
        };
    };

    /*
     Calling base implementation of the "addSubscriber" method and wrapping 'fn' callback before that
     */
    ChannelPrototype.addSubscriber = function(fn, options, context) {
        addSubscriberBase.call(this, wrapFunctionCall(fn), options, context);
    };

    Mediator.prototype.publishAsync = function() {
        resetResultCollector();

        publishBase.apply(this, convertToArray(arguments));

        var results = getSubscribersCallResults();

        /*
            Returning a jQuery Deferred (Promise) object which can be utilized
            to wait until all subscriber results are available
         */
        return $.when.apply(null, results);
    };

}(jQuery, Mediator));


