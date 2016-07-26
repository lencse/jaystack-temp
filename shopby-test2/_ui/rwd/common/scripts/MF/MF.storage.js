;
(function ($, window, storage) {
    'use strict';

    var MF = window.MF || {};

    MF.storage = (function () {

        function setString(key, value) {
            if (value) {
                storage.setItem(key, value);
            }
        }

        function getString(key) {
            return storage.getItem(key);
        }

        function setJSON(key, value) {
            setString(key, JSON.stringify(value));
        }

        function getJSON(key) {
            return JSON.parse(storage.getItem(key));
        }

        function init() {
            $(function() {
                if (typeof products != 'undefined')
                {
                    setJSON("products", products);
                }
            });
        }

        return {
            init: init,
            getString: getString,
            getJSON: getJSON
        };

    })();

    window.MF = MF;

}(jQuery, this, this.sessionStorage));

MF.storage.init();
