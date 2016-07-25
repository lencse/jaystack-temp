/*
 * MF.accordion
 *
 * Copyright (c) 2014 Damola
 * Licensed under the MIT license.
 *
 * MF.expand.init(); -  Todo: check for FastClick / Hammer
 *
 */
(function($, mediator) {
    'use strict';

    var MF = window.MF || {};

    MF.expand = (function() {

        var defaults = {
            speed: 350,
            activeClass: 'open',
            debouceLimit: 150,
            target: null,
            toggle: null,
            close: null,
            animationType: 'slideDown',
            easing: 'swing',
            closeOthers: 'close'
        };

        function init(options) {

            var dataAttr = $('[data-mf-expand]');

            $.each(dataAttr, function() {

                var $this = $(this),
                    dataSetting = _getConfig($this),
                    opt = $.extend({}, defaults, dataSetting);

                /* A list of error checks before proceeding 
                 * Target must be defined, and also exsits within the DOM
                 * Todo - what if there are multiple targets defined?
                 */
                // Target Element
                if (!opt.target || !$("[data-mf-extarget=" + opt.target + "]").length) {
                    return;
                }
                // Close Button Element
                opt.animationType = (opt.close && $("[data-mf-close=" + opt.close + "]").length) ? "slideDown" : "slideToggle";

                opt.targetEls = $this;

                if ($("[data-mf-close=" + opt.close + "]").length) {
                    _closeContent(opt);
                }
                _hideTargetContent(opt);
                _bindEvent(opt);

            });
        }

        // this can be converted into resuable _core and use javascript instead of jQuery
        function _getConfig(dataAttr) {
            if (dataAttr.data("mf-expand")) {
                /* Todo - Use regex to check the format is right, if not use the default */

                var _dataConfig = dataAttr.data("mf-expand").split(","),
                    i = 0,
                    length = _dataConfig.length,
                    _dataSetting = {};

                for (; i < length; i++) {
                    _dataSetting[_dataConfig[i].split(":")[0]] = _dataConfig[i].split(":")[1];
                }
                return _dataSetting;
            }
        }

        // Check if any item needs to be opened at first load
        function _hideTargetContent(opt) {
            $("[data-mf-target=" + opt.target + "]").css("display", "none");
        }

        function _bindEvent(opt) {
            opt.targetEls.on("click", opt, (typeof _ !== 'undefined') ? _.debounce(_revealContent, opt.debouceLimit, true) : _revealContent);
        }
        // Remove from reusable
        function _focusInput(){
                    var $input = $('#search');
                    $input.val('');
                    $input.focus();
                }

        function _revealContent(e) {
            e.preventDefault();

            var opt = e.data, // retrieve data options
                $targetEl = $("[data-mf-extarget=" + opt.target + "]");

            if (opt.closeOthers === "close") {
                _closeOthers(opt.target);
            }

            if (opt.animationType === "slideDown") {
                if (MF.breakpoint.getActive() == 'mobile') {
                    $('.header-search__label').css({'display':'none','z-index':'-1'});
                    var timer;
                    clearTimeout(timer);
                    timer = setTimeout(function() {

                            $('.header-search__label').fadeIn(100).css({'z-index':'1'});

                    }, 250);

                    
                } else {
                    $('.header-search__label').css({'display':'block','z-index':'1'})
                }

                $targetEl.slideDown({
                    duration: opt.speed,
                    easing: opt.easing,
                    complete: _focusInput,
                    step: function(time, tween) { if (tween.prop == 'height') { mediator.publish('mf-expand:animation-ended') } }
                 });
            } else {

                $targetEl.slideToggle({
                    duration: opt.speed,
                    easing: opt.easing,
                    complete: _focusInput,
                    step: function(time, tween) { if (tween.prop == 'height') { mediator.publish('mf-expand:animation-ended') } }
                 });
            }

        }

        function _closeContent(opt) {
            $("[data-mf-close=" + opt.close + "]").on("click", function(e) {
                e.preventDefault();
                // Use Mediator instead TODO
                var loginForm = $("#headerLoginForm");
                if(loginForm.length) loginForm.validate().resetForm();

                var $input = $('#search');
                    $input.val('');

                if ($(window).width() < 641) {
                    $('.header-search__label').css({'z-index':'-1','display':'none'});
                }

                $(this).fadeOut(200);

                $("[data-mf-extarget=" + opt.target + "]").slideUp({
                    duration: opt.speed,
                    easing: opt.easing,
                    step: function(time, tween) { if (tween.prop == 'height') { mediator.publish('mf-expand:animation-ended') } },
                    complete: function() { $("[data-mf-close=" + opt.close + "]").show(); }
                });
            });

             _focusInput();
        }

        function _closeOthers(target){     
            $("[data-mf-extarget][data-mf-extarget!=" + target + "]").slideUp({
                    duration: defaults.speed,
                    easing: defaults.easing,
                    step: function(time, tween) { if (tween.prop == 'height') { mediator.publish('mf-expand:animation-ended') } }
                });
        }

        function close(target){
            $("[data-mf-extarget][data-mf-extarget=" + target + "]").slideUp({
                    duration:10,
                    easing: defaults.easing,
                    step: function(time, tween) { if (tween.prop == 'height') { mediator.publish('mf-expand:animation-ended') } }
                });
        }

        return {
            init: init,
            close: close
        };

    })();

    window.MF = MF;

}(jQuery, MF.checkout.mediator));

MF.expand.init();
