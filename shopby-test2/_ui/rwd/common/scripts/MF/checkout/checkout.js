/*
 *  requires
 *
 * TODO: Mediator initialisation should be moved to MF.js once js and jsRWD issue usage issue are resolved
 */

;(function($) {
    'use strict';

    var MF = window.MF || {};

    MF.checkout = (function() {

        var mediator = new Mediator();

        return {
            mediator: mediator
        };

    })();

    window.MF = MF;

}(jQuery));
