;(function($){
    "use strict";
    var MF = window.MF = window.MF || {};
    var $spinner, preloader;
    // preload the spinner but delay it late after document ready
    $(function() {
        setTimeout(function(){
            preloader = $('<img class="spinner" src="' + ACC.config.commonResourcePath + '/images/svg/preloader.gif" />');
        }, 300);
    })
    MF.spinnerHandler = (function(){
        function showSpinner(button, css) {
            // show spinner
            // also disable the button
            css = css || {};
            $spinner = $spinner
                || $('<img class="spinner" src="' + ACC.config.commonResourcePath + '/images/svg/preloader.gif" />')
                        .css({
                            width: '18px',
                            height: '18px',
                            'vertical-align': 'middle',
                            'margin-right': '6px',
                            'opacity': '0.9',
                            'margin-left': '-28px'
                        }).css( css );
            $(button).prepend($spinner);
            // disable button to prevent multiple click on it
            // delay the disabling not to affect the submission of the form
            setTimeout(function(){
                $(button).prop('disabled', true);
            }, 1);
            return true; //do not interfere with the validation result
        }
        function hideSpinner(button) {
            // hide spinner
            // also enable the button
            $(button).find('.spinner').remove();
            setTimeout(function(){
                $(button).prop('disabled', false)
            }, 1)
        }
        return {
            showSpinner: showSpinner,
            hideSpinner: hideSpinner
        }
    })()
})(jQuery);
