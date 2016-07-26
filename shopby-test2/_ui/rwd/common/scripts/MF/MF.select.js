;(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.select = (function () {

        function init(options) {

            var o = options || {},
                _callback = o.callback || undefined,
                cid = o.contextId || 'body';

            // TODO: possibly description needs to be updated because of MF.$ removal
            // IMPORTANT NOT TO USE $('[data-mf-select]', cid) approach.
            // This is done to allow contextId to be a jQuery object as well, not only a string.
            //
            // Current method returns the select element wrapped around MF.$ which has the seleceter plugin defined.
            // Using $('[data-mf-select]', cid) method returns the select element wrapped around jQuery (when contextId was created using jQuery) which doesnt' have the selecter plugin
            // and an 'undefined is not a function' error will occur.
            return $(cid).find('[data-mf-select]').andSelf().filter('[data-mf-select]').selecter({
                callback: _callback,
                slideDown: o.slideDown,
                links: o.links || false
            });
        }

        function updateSelectedValue(context) {
            var newLabel = $('[data-mf-select]', context).find(":selected").html();
            $(context).find(".cs__selected").html(newLabel);
        }

        function refresh(context) {
            $(context).find('[data-mf-select]').selecter('refresh');
            updateSelectedValue(context);
        }

        function disable(context) {
            $(context).find('[data-mf-select]').andSelf().filter('[data-mf-select]').selecter('disable');
        }

        function enable(context) {
            $(context).find('[data-mf-select]').andSelf().filter('[data-mf-select]').selecter('enable');
        }

        return {
            init: init,
            refresh: refresh,
            disable: disable,
            enable: enable
        };
    })();

    window.MF = MF;

}(jQuery, this, this.document));