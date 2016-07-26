/*
 *  No dependencies
 *
 */

;
(function($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.password = (function() {

        var $passwSelector = $(":password");

        function bindAll() {
            $passwSelector.bind("paste", function(e) {
                return true;
            }).unbind('paste', function() {
                return false;
            });

            $passwSelector.bind("cut copy", function(e) {
                return false;
            });
        }

        return {
            bindAll: bindAll
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));


MF.password.bindAll();