/*

HomePage
 *
 */
(function($) {
    'use strict';

    var MF = window.MF || {};

    MF.homepage = (function() {

        var defaults = {};
        var $heroSlider;
        var $styleGuide = $('.style-guide');
        var $contentWrapper = $('#content__wrapper');
        var $scrollPaneWrapper = $('.ph-tpl__scroll-pane');
        var scrollPaneClass = 'ph-tpl__scroll-pane';
        var $heroSliderItem = $('.hero_slider > li')
        var $productCarrousel;
        var mySlider;
        var $sHeight = $(window).innerHeight() - 150;
        var $wind = $(window).width();


        if ($scrollPaneWrapper.length) var stickySidebarTop = $scrollPaneWrapper.offset().top;

        function redraw() {
            var redrawMySlider = setTimeout(function() {
                $heroSliderItem.css({
                    'min-height': '0',
                });
                if ($heroSlider.length) $heroSlider.redrawSlider();
            }, 100);
        }

        function init() {

            MF.scrollBars.init();
            stickySidebar();
            windowResize();
            updatePage();
            heroSlider();
            redraw();
            _fixMobileCarousel(MF.breakpoint.getActive())

        }

        function orderPromos(breakpoint) {
            if (breakpoint == 'desktop-large') breakpoint = 'desktop';
            var ul = $('.section'),
                li = ul.children('li');

            $.each(li, function(index, val) {

                if ($(this).attr('data-mf-' + breakpoint)) {

                    li.detach().sort(function(a, b) {
                        return $(a).data('mf-' + breakpoint) - $(b).data('mf-' + breakpoint);
                    });
                    ul.prepend(li);

                } else {
                    return
                }
            });
        }

        function heroSlider() {
            $heroSlider = $('.hero_slider').bxSlider({
                preloadImages: 'all',
                onSliderLoad: function() {
                    var listText = $(".hero_slider > li:eq(1)").find('.hero__content');

                    $heroSliderItem.fadeIn(400, function() {
                        $contentWrapper.text('');
                        $contentWrapper.append(listText.html());

                        $(this).find('img').css({
                            'visibility': 'visible',
                            'opacity': '0'
                        }).animate({
                                opacity: 1
                            },
                            1000, function() {
                                $contentWrapper.fadeIn(1000);
                                $('.bx-controls-direction').find('a').fadeIn(1000);
                            });

                        //$(this).find('img').fadeIn(1000, function() {

                        // });

                    });
                },

                onSlideAfter: function() {
                    $contentWrapper.fadeIn(500);
                },

                onSlideNext: function() {
                    $contentWrapper.fadeOut(500, function() {
                        $(this).text('');
                        var listText = $(".hero_slider > li:eq(" + ($heroSlider.getCurrentSlide() + 1) + ")").find('.hero__content');
                        $(this).append(listText.html());
                    });
                },

                onSlidePrev: function() {
                    $contentWrapper.fadeOut(500, function() {
                        $(this).text('');
                        var listText = $(".hero_slider > li:eq(" + ($heroSlider.getCurrentSlide() + 1) + ")").find('.hero__content');
                        $(this).append(listText.html());
                    });
                },

                onSlideBefore: function() {}
            });
        }


        function mobileMenu(breakpoint) {
            var menuString;
            var gender = $.cookie("gender");
            var revGender = $.cookie("gender");
            if (revGender == 'womens') {
                revGender = ('mens')
            } else {
                revGender = ('womens')
            }
            var bottomPosition = $('.section');
            var mobileMenu = $('#genderMenu');

            // TODO
            if (revGender == 'mens') {
                menuString = '<ul class="mobile-menu womens-MobileMenu" id="genderMenu"><li><a href="/womens/just-in/just-in-this-month">JUST IN</a></li><li><a href="/womens/shop">SHOP</a></li><li><a href="/womens/designers">DESIGNERS</a></li><li><a href="/womens/the-style-report">THE STYLE REPORT</a></li><li><a href="/womens/sale">SALE</a></li><li><a class="shop" href="/mens">SHOP MEN&#8217;S</a></li></ul>';
            } else {
               menuString = '<ul class="mobile-menu mens-MobileMenu" id="genderMenu"><li><a href="/mens/just-in/just-in-this-month">JUST IN</a></li><li><a href="/mens/shop">SHOP</a></li><li><a href="/mens/designers">DESIGNERS</a></li><li><a href="/mens/the-style-report">THE STYLE REPORT</a></li><li><a href="/mens/sale">SALE</a></li><li><a class="shop" href="/womens">SHOP WOMEN&#8217;S</a></li></ul>';
            }

            if (breakpoint == "mobile") {
                if (!mobileMenu.length) {
                    $(menuString).insertBefore(bottomPosition);
                }

            } else {
                mobileMenu.remove();
            }
        }

        function mobileSlider(breakpoint) {
            var $wind = $(window).width();

            if (breakpoint == 'mobile') {
                $styleGuide.css({
                    'border-bottom': 'none'
                });

                //$('.hpg-tpl__scroll').append('<a href="#" class="center__item__link">More from the Style Report</a>');
                if (!$('.slider').length) {

                    $styleGuide.addClass('is--slider');

                    if ($styleGuide.hasClass('is--slider')) {

                        if (!$('.hpg-tpl__scroll').find('.bx-viewport').length) {
                            MF.scrollBars.destroy(scrollPaneClass);
                            mySlider = $scrollPaneWrapper.bxSlider({
                                mode: 'horizontal',
                                pagerType: 'full',

                                onSlideAfter: function() {
                                    $('.hpg-tpl__scroll__item__info').fadeIn(250);
                                },

                                onSlideNext: function() {
                                    $('.hpg-tpl__scroll__item__info').fadeOut(250);
                                }

                            });

                        }
                    }

                } else {
                    MF.scrollBars.destroy(scrollPaneClass);
                    clearTimeout(timer);
                    timer = setTimeout(mySlider.reloadSlider, 500);
                }

            } else {

                $styleGuide.css({
                    'border-bottom': '3px solid black'
                });
                if ($('.is--slider').length) {
                    $styleGuide.removeClass('is--slider');
                    mySlider.destroySlider();
                    //MF.scrollBars.update('ph-tpl__scroll-pane');
                    MF.scrollBars.init();
                }
            }

            stickySidebar();
        }

        function stickySidebar() {

            // If not iPad
            if ($(window).width() > 980 && navigator.userAgent.match(/iPad/i) == null) {
                var sideBarWidth = $('.hpg-tpl__scroll').width();

                MF.sidebar.init({
                    sidebarSelector: '.style-guide',
                    headerSelector: '#header',
                    navSelector: '.hero',
                    contentSelector: '.section',
                    footerSelector: '#footer',
                    footerElement: '.cms-crl__wrapper',
                    sidebarTopMargin: 110,
                    footerThreshold: 0
                });

                $sHeight = $(window).innerHeight() - 150;
                $scrollPaneWrapper.height($sHeight - 50);

                $('.style-guide').width(sideBarWidth);

            } else if ($(window).width() > 980 && navigator.userAgent.match(/iPad/i) != null) {
                $styleGuide.removeClass('is-sticky').height($('.section').height());
                $scrollPaneWrapper.height($('.section').height());

            } else if ($(window).width() < 980 && $(window).width() > 640) {
                $styleGuide.removeClass('is-sticky');
                //$('.style-guide').height(465);
                $scrollPaneWrapper.height(340);
                $('.style-guide').css({
                    'width': '100%'
                });
            } else {
                // $('.style-guide').height(265);
            }
        }
        // Refator later
        function section(breakpoint) {
            var sectionListItems = $('.section >li').length;
            var $el = $('.section');
            var rmItem = $el.find('li:eq(0)');
            var tablet = false;

            $('.section').waitForImages(function() {
                $(this).fadeIn(100).css({
                    display: 'inline-block',
                });
            });

            $('.style-guide').waitForImages(function() {
                $(this).fadeIn(100);
            });
        }

        function _fixMobileCarousel(breakpoint){
              if(breakpoint == 'mobile'){
                var car_width=Math.floor($(".tsr-carousel .bx-wrapper").width()*93.33/100);
                $(".tsr-carousel .hpg-tpl__scroll__item").width(car_width);
                $(".tsr-carousel .bx-viewport").height($(".tsr-carousel .hpg-tpl__scroll__item").height());
                $(".tsr-carousel .bx-next").click();
                setTimeout(function() {
                  $(".tsr-carousel .bx-prev").click();
                }, 650);
              }
            }

        function updatePage() {
            mobileSlider(MF.breakpoint.getActive());
            mobileMenu(MF.breakpoint.getActive());
            section(MF.breakpoint.getActive());
            orderPromos(MF.breakpoint.getActive());
            
            redraw();

            MF.productCarousel.init($('[data-cms-carousel]'), {
                'desktop': '4',
                'tablet': '3',
                'mobile': '1'
            });
        }

        function windowResize() {
            $window.unbind("resize.MFHomepage").bind("resize.MFHomepage", function(ev) {
                ev.stopPropagation();
                clearTimeout(resizeWin);
                var resizeWin = setTimeout(updatePage, 100);
            });
        }

        return {
            init: init,
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

$(document).ready(function() {

    if ($(".section").length || $('.editorial_wrapper').length) {
        MF.homepage.init();
    }

});