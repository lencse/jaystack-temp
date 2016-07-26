(function ($, window) {
    'use strict';

    var MF = window.MF = window.MF || {};

    MF.footerPage = (function () {
        function initDeliveryPage() {
            MF.select.init({
                contextId: '.ft-page[data-mobile-menu="delivery"] #deliveryModeCountryDropdown'
            })
        }

        function initReturnsPage() {
            MF.select.init({
                contextId: '.ft-page[data-mobile-menu="returns"] #countryIso'
            })
        }

        function initMobileTopNav() {
            populateMobileDropdown();
            if ( $('.footer-page-popup').length == 0 ) {
                // On footer pages the mobile dropdown will behave as links
                MF.select.init({contextId: '.mobile-nav__dropped-menu', links: true});
            } else {
                // On checkout overlay the behaviour will be managed by footerpagesoverlays
                MF.select.init({contextId: '.mobile-nav__dropped-menu'});
            }
        }

        function populateMobileDropdown() {
            var menuItemId = $('.fp-page, .ft-page').data('mobile-menu');
            var link = $('.ft-page__left-nav a[href$="' + menuItemId + '"]');
            var linkGroup = link.closest('li').parent();
            var links = linkGroup.find('a');
            var groupIndex = linkGroup.closest('li').index();
            var dropDown = $('.mobile-nav__dropped-menu select');

            // Populate the title in front of the dropbox depending on the current group of links
            // Do not show matchesfashion.com in front of the dropbox
            if (groupIndex === 0) {
                $('.mobile-nav__title-wrapp, .mobile-nav__dropped-menu').addClass('no-title');
            } else {
                $('.mobile-nav__title-wrapp').find('h2').text(
                    linkGroup.find('li.heading').text()
                );
            }

            links.each(function(){
                var $this = $(this);
                var option = $('<option></option>');
                option.text( $this.text() );
                var value = $this.attr('href');
                option.attr('value', value );
                if( link.attr('href') == value ) {
                    option.prop('selected', true);
                }
                dropDown.append(option)
            })
        }

        function initFaqsPage() {
            $('.faq__questions').find('a').click(function(event){
                var top = $($(this).attr('href')).offset().top
                  , offsetMap = {
                    'mobile': 0,
                    'tablet': 0,
                    'desktop': 110,
                    'desktop-large': 140
                }
                  , container
                  , topOffset
                  , popup = $(this).closest('.mfp-wrap');

                if ( popup.exists() ) { // if the links is within a popup then scroll the popup
                    topOffset = 0;
                    container = popup;
                } else {
                    topOffset = offsetMap[MF.breakpoint.getActive()];
                    container = $('body,html');
                };
                container.animate({
                    scrollTop: top - topOffset
                }, 400);
                event.preventDefault();
            })
        }

    	function init() {
            if( $('.ft-page__left-nav').length > 0 && $('.ft-page__left-nav').closest('.footer-page-popup').length == 0 && $('.ft-page__left-nav').closest('.returns-page-popup').length !== 1 ) {
                MF.stickit.init({
                    targetElement: '.ft-page__left-nav',
                    topElement: '.header-wrapper',
                    bottomElement: '.mf-footer'
                });
            }
            initMobileTopNav();
            initDeliveryPage();
            initReturnsPage();
            initFaqsPage();
    	}
    	return {
    		init: init
    	}
    })();
})(jQuery, window);

MF.footerPage.init();