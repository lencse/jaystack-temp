/*
 *  require
 *  MF.track.trackRemoveFromCart
 *  MF.track.trackUpdateCart
 */
;
(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.footer = (function () {

        var defaults = {};

        function init() {

            backToTop();
            socialIcons();
            windowResize();
            updateFooter();
            footer_apps_spacing();
            footer_customer_services();
            korea_adjustment();
        }

        function footer_apps_spacing(){
            if ( $('.ft__our_apps-tablet_mobile-only').length ){
                if ( $('.app_buttons-inner_container > div:nth-child(1)').css('display') == 'none' ){
                    $('.app_buttons-inner_container > div:nth-child(2)').css('margin', '0');
                }
                else if ( $('.app_buttons-inner_container > div:nth-child(2)').css('display') == 'none' ){
                    $('.app_buttons-inner_container > div:nth-child(1)').css('margin', '0');
                }
                else{
                    $('.app_buttons-inner_container > div:nth-child(2)').css('margin-left', '11%');
                }
            }
        }

        // This function removes the t: (for a customer service number in the footer) if there is no number present.
        function footer_customer_services(){
            var span1 = $('#footer .customer_services_info .tel span:nth-child(1)');
            var span2 = $('#footer .customer_services_info .tel span:nth-child(2)');
            if ( span1.html() === "" ){
                span1.remove();
            }
            if ( span2.html() === "" ){
                span2.remove();
            }
        }
        
        // Korea is a special case for the footer due to the phone numbers and text so we need to adjust it so it doesn't break the footer
        function korea_adjustment(){
            if ( $.cookie('country') === 'KOR' ){
                $('.ft__info-links .customer_services_info').addClass('korea');
                $('.ft__info-links .customer_services_info strong').addClass('korea');
                $('.ft__info-links .customer_services_info p.tel').addClass('korea');
                $('.ft__info-links .customer_services_info strong').addClass('korea');
                $(' .ft__info-links p.tel br').addClass('korea');
            }
        }

        function footerCurrency() {
            MF.select.init({
                contextId: '#footerCurrency-form',
                callback: function () {
                    $('#footerCurrency-form').submit();
                }
            });
        }

        function socialIcons() {
            // Footer Social Icons
            $('[data-svg]').hover(function () {
                var bg = $(this).data('svg');

                $(this).css({
                    'background-color': bg
                });
            }, function () {
                $(this).css({
                    'background-color': '#000'
                });
            });
        }

        function backToTop() {
            // Back to Top Menu
            $('#back-top').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        }

        function footerAccordion(breakpoint) {
            if (breakpoint == 'mobile') {
                $.each($('.ft__links > li').find('ul'), function (index, val) {
                    $(this).css({
                        'display': 'none',
                    });

                });
            } else {
                $.each($('.ft__links > li').find('ul'), function (index, val) {
                    $(this).css({
                        'display': 'block',
                    });
                });
                return false;
            }

        }

        function mobileMenu(breakpoint) {
            if (! $('.page-homepage').length) {
                var gender = $.cookie("gender");
                var revGender = $.cookie("gender");
                if(revGender == 'womens') {revGender = ('mens')} else {revGender = ('womens')}
                var bottomPosition = $('#footer');
                var mobileMenu = $('#footerMenu');
                // TODO
                var menuString = '<ul class="mobile-menu" id="footerMenu"><li><a href="/'+gender+'/just-in/just-in-this-month">JUST IN</a></li><li><a href="/'+gender+'/shop">SHOP</a></li><li class=""><a href="/'+gender+'/designers">DESIGNERS</a></li><li><a href="/'+gender+'/the-style-report">THE STYLE REPORT</a></li><li><a href="/'+gender+'/sale">SALE</a></li><li><a class="shop" href="/'+revGender+'">SHOP '+revGender+'</a></li></ul>';

                if (breakpoint == "mobile") {
                    if (!mobileMenu.length) {
                        bottomPosition.prepend(menuString);
                    }

                } else {
                    mobileMenu.remove();
                }
            }
        }

        function setHeaderLinks(breakpoint) {
            var selectorList = $('.ft__links > .ft__links__item-list');
                if(breakpoint == "mobile") {
                       $.each(selectorList, function(index, val) {
                           var topLinks = $(this).find('.tap').first('li').find('a').attr('href');
                           $(this).find('a').first().attr('href', '#');
                        });
                } else {
                   $.each(selectorList, function(index, val) {
                       var topLinks = $(this).find('.tap').first('li').find('a').attr('href');
                       $(this).find('a').first().attr('href', topLinks);
                    });
                }
            }

        function updateFooter() {
            footerCurrency();
            setHeaderLinks(MF.breakpoint.getActive());
            footerAccordion(MF.breakpoint.getActive());
            mobileMenu(MF.breakpoint.getActive());
        }

        function windowResize() {
            $(window).off("resize.MFFooter").on("resize.MFFooter", function () {
                clearTimeout(resizeWin);
                var resizeWin = setTimeout(updateFooter, 100);
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

    if ($('#footer').length) MF.footer.init();
