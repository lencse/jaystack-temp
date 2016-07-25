/*
 * MF.accordion
 *
 * Copyright (c) 2014 Damola
 * Licensed under the MIT license.
 *
 * MF.Accordion.init(); -  Todo: check for FastClick / Hammer
 *
 */
(function($) {
    'use strict';

    var MF = window.MF || {};

    MF.accordion = (function() {

        var defaults = {
            speed: 350,
            activeClass: 'is-active',
            multipleOpen: false,
            isDesktop: true
        };

        function init(options) {
            var dataAttr = $('[data-mf-accordion]');

            $.each(dataAttr, function() {
                var $this = $(this),
                    dataSetting = _getConfig($this),
                    opt = $.extend({}, defaults, dataSetting),
                    initAcc = $this;
                if ($this.data('mf-accordion-initialized')) {
                    return;
                }

                opt.accordionEls = $this.find("li>span");

                if (opt.isDesktop == true) {
                    opt.accordionEls.find("~ ul").add(opt.accordionEls.find("~ [data-mf-accordion-sub]")).css("display", "none");
                } else if (!opt.isDesktop == false && $(window).width() < 690) {
                    // Review
                    opt.accordionEls.find("~ ul").add(opt.accordionEls.find("~ [data-mf-accordion-sub]")).css("display", "none");
                }
                _openFirstContent(opt);
                _bindEvent(opt);

                $this.data('mf-accordion-initialized', true);

            });
        }

        function _getConfig(dataAttr) {
            if (dataAttr.data("mf-accordion")) {
                /* Todo - Use regex to check the format is right, if not use the default */

                var _dataConfig = dataAttr.data("mf-accordion").split(","),
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
        function _openFirstContent(opt) {
            opt.accordionEls.parent("li").each(function(i, el) {
                var $thisEl = $(el);
                if ($thisEl.find(":has(ul)").add($thisEl.find(":has([data-mf-accordion-sub])"))) {
                    if ($thisEl.hasClass(opt.activeClass)) {
                        $thisEl.find("> ul").add($thisEl.find("> [data-mf-accordion-sub]")).css("display", "block");
                        $thisEl.addClass(opt.activeClass);
                    }
                }
            });
        }

        function _bindEvent(opt) {
            opt.accordionEls.each(function(){
                //initialize FastClick
                FastClick.attach( this );
            });
            opt.accordionEls.on("click", opt, (typeof _ !== 'undefined') ? _.debounce(_callback, 200, true) : _callback)
                .on("doubleclick", function() {
                    return false;
                });
        }

        function _callback(e) {

            // header will behave as an accordion trigger only if href attribute is #, otherwise it will behave as a link
            var link = $(e.target).closest('a').andSelf().filter('a');
            if(link.attr('href') != '#') {
                return;
            }


            e.preventDefault();
            var opt = e.data;
            var speed = ~~opt.speed; // make sure it is a number!
            var $eventTarget = $(e.target).parent(), // span
                $eventParentLi = $eventTarget.parent("li"),
                $targetUl = $eventTarget.find("~ ul").add($eventTarget.find("~ [data-mf-accordion-sub]")),
                $targetUlGroup = $eventParentLi.parent().find("> li > ul").add($eventParentLi.parent().find("> li > [data-mf-accordion-sub]"));

            if (opt.multipleOpen === "true") {
                if ($eventParentLi.hasClass(opt.activeClass)) {
                    $targetUl.slideUp(speed);
                    $eventParentLi.removeClass(opt.activeClass);
                } else {
                    $targetUl.slideDown(speed);
                    $eventParentLi.addClass(opt.activeClass);
                }
            } else {
                if ($eventParentLi.hasClass(opt.activeClass)) {
                    $targetUl.slideUp(speed);
                    $eventParentLi.removeClass(opt.activeClass);
                } else {
                    $targetUlGroup.each(function(i, el) {
                        var $thisUl = $(el);
                        $thisUl.slideUp(speed);
                        $thisUl.parent("li").removeClass(opt.activeClass);
                    });
                    $targetUl.slideDown(speed, function() {
                        //MF.scrollBars.init();
                        $(".no-touch .sticky").trigger("sticky_kit:recalc");
                    });
                    $targetUl.parent("li").addClass(opt.activeClass);
                }
            }
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery));