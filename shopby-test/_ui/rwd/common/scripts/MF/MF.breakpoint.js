/*
 *  This script links CSS media query breakpoints and JS
 */

;(function($, window) {
    "use strict";

    var MF = window.MF || (window.MF = {});
    var Breakpoints = window.Breakpoints;

    var DESKTOP = "desktop";
    var DESKTOP_LARGE = "desktop-large";
    var MOBILE = "mobile";
    var TABLET = "tablet";

    var defaultOptions = {
        names: [ MOBILE, TABLET, DESKTOP, DESKTOP_LARGE ],
        headerName: "x-media-query-breakpoint"
    };

    MF.breakpoint = (function() {

        var options;
        var activeBreakpoint;

        var callbacks = {
            onChange: $.Callbacks("unique stopOnFalse"),
            onExit: $.Callbacks("unique stopOnFalse")
        };

        var changeActiveBreakpoint = function(name) {
            activeBreakpoint = name;
            callbacks.onChange.fire(activeBreakpoint);
        };

        var exitBreakpoint = function(name) {
            callbacks.onExit.fire(name);
        };

        var initBreakpoints = function() {
            _.each(options.names, function(breakpointName) {
                Breakpoints.on({
                    name: breakpointName,
                    matched: _.partial(changeActiveBreakpoint, breakpointName),
                    exit: _.partial(exitBreakpoint, breakpointName)
                });
            });
        };

        var getActiveBreakpoint = function() {
            return activeBreakpoint;
        };

        var isActive = function(breakpointName) {
            return breakpointName === activeBreakpoint;
        };

        var predicates = {
            isMobile: _.partial(isActive, MOBILE),
            isTablet: _.partial(isActive, TABLET),
            isDesktop: _.partial(isActive, DESKTOP),
            isDesktopLarge: _.partial(isActive, DESKTOP_LARGE)
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            initBreakpoints();
        };

        return {
            init: init,
            callbacks: callbacks,
            isActive: isActive,
            getActive: getActiveBreakpoint,
            DESKTOP: DESKTOP,
            DESKTOP_LARGE: DESKTOP_LARGE,
            MOBILE: MOBILE,
            TABLET: TABLET
        };

    })();

}(jQuery, this));

MF.breakpoint.init();
