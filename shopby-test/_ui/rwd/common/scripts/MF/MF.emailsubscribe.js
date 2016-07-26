;(function ($, window, document, requestResult, overlay)
{
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {};

    MF.subscribeEmail = (function ()
    {


        var $subscribeForm, $subscribeWishlistBtn;

        var options;

        var validateSubscribeForm = function ()
        {
            var validator = $subscribeForm.validate({
                onfocusout: function (element)
                {
                    $(element).valid();
                },
                rules: {
                    email: {
                        required: true,
                        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
                    }
                },
                errorPlacement: function (error, element)
                {
                    error.insertBefore(element.parents(".ft__subscribe__input"));
                }
            });
            return validator.form();
        };

        var clearErrorMessages = function ()
        {
            $("#emailPreferencesJoinForm.email").removeClass("error");
        };

        var submitSubScribeForm = function ()
        {
            clearErrorMessages();
            validateSubscribeForm();
            $subscribeForm.submit();
        }

        var initObjects = function ()
        {
            $subscribeForm = $("#emailPreferencesJoinForm");
            $subscribeWishlistBtn = $(".subscribeEmail");
        };

        var bindEvents = function ()
        {
            $subscribeWishlistBtn.on("click", submitSubScribeForm);
        };

        var init = function (opts)
        {
            options = $.extend({}, defaultOptions, opts);

            initObjects();

            bindEvents();
        };

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.requestResult, MF.overlay));

MF.subscribeEmail.init();
