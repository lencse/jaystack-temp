/*

HomePage
 *
 */
;(function($, window, document) {
    'use strict';

    var MF = window.MF = window.MF || {};
    var config;
    var defaultConfig = {};

    MF.sidebar = (function() {

            function init(options) {
                config = $.extend({}, defaultConfig, options);

                _bindEvents(config);

                console.log('init'+ config.sidebarSelector);
            }
     
           function _fixSidebr(options) {
           
            var breakingPoint2;
            var sidebarSelector = $(config.sidebarSelector);
           
            var viewportHeight = $(window).height();
            var viewportWidth = $(window).width();
            var documentHeight = $(document).height();

            var headerHeight = $(config.headerSelector).height();
            var navHeight = $(config.navSelector).height();
            var sidebarHeight = sidebarSelector.height();
            var contentHeight = $(config.contentSelector).height();
            var footerElement = $(config.footerElement).exists();
            var footerElementHeight = $(config.footerElement).height();
            var footerHeight = $(config.footerSelector).height();
            var scroll_top = $(window).scrollTop();
            var fixPosition = contentHeight - sidebarHeight;

            var breakingPoint1 = headerHeight + navHeight;

            if( MF.breakpoint.getActive() != 'desktop-large' ) {
                 breakingPoint2 = (documentHeight - config.sidebarTopMargin) - (sidebarHeight + footerHeight + (footerElement ? footerElementHeight : 0) );
             } else {
                 breakingPoint2 = (documentHeight - config.sidebarTopMargin) - (sidebarHeight + footerHeight);
            }
            
            if ($(window).width() > 980 && navigator.userAgent.match(/iPad/i) == null) {
                
                if ((documentHeight > sidebarHeight) && (viewportHeight > sidebarHeight)) {

                    if (scroll_top < breakingPoint1) {

                        sidebarSelector.removeClass('is-sticky');

                    } else if ((scroll_top >= breakingPoint1) && (scroll_top < breakingPoint2)) {

                        sidebarSelector.addClass('is-sticky').css({'top':config.sidebarTopMargin});

                    } else {
                        var negative = breakingPoint2 - (scroll_top + config.sidebarTopMargin-config.sidebarTopMargin/4);
                       
                        $('.is-sticky').show();
                        sidebarSelector.addClass('is-sticky').css({'top':negative});
                    }

                }
            }
        }

        function _bindEvents(config) {
            return $(config.sidebarSelector).each(function () {
                    
                    $(window).off('resize.sidebar').on('resize.sidebar', function() {
                            $('.is-sticky').hide();
                            clearTimeout(resizeThisWin);
                            var resizeThisWin = setTimeout($.proxy(_fixSidebr, this), 1000); 
                    });
                    $(window).off('scroll.sidebar').on('scroll.sidebar', $.proxy(_fixSidebr, this));
                   
                    $.proxy(_fixSidebr, this);
            });
        }


        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));