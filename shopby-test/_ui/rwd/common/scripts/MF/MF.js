
window.MF = window.MF || {};

$(document).ready(function () {
    // IE9 Placeholders
    if (!Modernizr.input.placeholder) {
        //$('input, textarea').placeholder({customClass: 'ie9-placeholder'});
        $('input, textarea').placeholder();
    }
});

/*
* Avoid `console` errors in browsers that lack a console.
* https://github.com/h5bp/html5-boilerplate/blob/master/src/js/plugins.js
*
*/
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Prevent some buttons to trigger errors in case they are clicked before the page load
// These buttons are disabled by default and will be enabled by this code
(function(){
    $(document).ready(function(){
        $('[data-enable-on-load]').removeAttr('disabled');
    });
})();
