/*
 MF.header
 */
;
(function($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.header = (function() {

        var defaults = {};
        var $window = $(window);
        var gender = $.cookie('gender')
        var menuItemGender = "#" + gender;
        var hideLoginPage = $('.page-orderConfirmation');
        var $scroll = $(window);

        var headerWrapper = $('.header-wrapper');
        var $navMain = $('#nav_main');
 
        function init() {

            initShopCategoryIE();
            initCurrency();
            mobileMenu();
            buildMobileHeader();
            displayGlobalMessages();

            windowResize();
            updateHeader();
            tabletTrigger();

            if (!Modernizr.csstransitions) {
                if ($('body').hasClass('fixed')) $('.logo').width(250);
            }
        }

        function initShopCategoryIE(){
            if ( ! Modernizr.csscolumns && MF.breakpoint.getActive() != 'mobile'){
                $(".shop__cols__wrapper__womens, .shop__cols__wrapper__mens, .sub_menu__wrapper__xl")
                    .parents(".main-menu__item")
                    .addClass("is--IE");
            }
        }

        function initCurrency() {
            // Topbar currency
            MF.select.init({
                contextId: '#currency-form',
                slideDown: true,
                callback: function() {
                    $('#currency-form').submit();
                }
            });
        }

        function animSearch(breakpoint) {
            var $target = $('.topbar__options--user .topbar__options__item:last-of-type');
            if (breakpoint == 'mobile') {
                $target.animate({
                    'width': '125'
                }, 1000, function() {});
            } else {
                $target.fadeIn(10).animate({
                    'width': '175'
                }, 1000, function() {});
            }
        }

        function displayGlobalMessages() {
            if ($('#global__messages').exists()) {
                var elm = $('#global__messages');
                MF.overlay.openWithElement({
                    element: elm,
                    callbacks: {
                        open: function() {
                            clearTimeout(timeOutMessage);
                            var timeOutMessage = setTimeout(MF.overlay.close, 5000);
                        }
                    }
                });

            } else {
                return;
            }
        }

        function handleData(data) {
            var $offCanvasMenu = $('#offcanvaslist');
            if (!$('.slide-menu__list__wrapper').length) {
                $offCanvasMenu.append(data);


                if ($.cookie('loggedIn') == 'true') {
                    $offCanvasMenu.find('[data-href]').queue(function() {

                        $(this).attr('href', $(this).data('href'));
                        $(this).removeClass('loginOverlay');

                    });
                    $offCanvasMenu.find('[data-log-in]').queue(function() {
                        $(this).removeClass('loginOverlay').text('log out').attr({
                            'href': '/logout'
                        });
                    });
                }

                if ($('.slide-menu__list__wrapper li').find('ul').length) {
                    MF.accordion.init();
                }
            }
        }

        function buildMobileHeader() {
            if (!$('.page-homepage').length) {

                var $leftMenuEl = $('#left-menu');
                var header = '<div class="slide-menu" data-width="235" id="sidr-left">';
                header += '<ul class="slide-menu__header">';
                header += '<li class="slide-menu__header__item">';
                header += '<a class="slide-menu__header__item__link" id="mens" href="#mens">MEN</a>';
                header += '<div class="slide-menu__header__item__active"></div>';
                header += '</li>';
                header += '<li class="slide-menu__header__item">';
                header += '<a class="slide-menu__header__item__link" id="womens" href="#womens">WOMEN</a>';
                header += '<div class="slide-menu__header__item__active"></div>';
                header += '</li>';
                header += '</ul><div id="offcanvaslist"></div></div>';

                $('#offcanvas').append(header);

                $leftMenuEl.sidr({
                    name: 'sidr-left',
                    side: 'left',
                    speed: 400,
                    displace: true,
                    body: 'body'
                }).css({
                    'display': 'block'
                });


                $(menuItemGender).next('div').show();
                mainMenu('mobile', gender);


                var offCanvas = new Hammer(document.getElementById("Swipeheader"), {
                    drag_vertical: true
                });
                var offCanvasEl = $('#Swipeheader');

                var onMobile = Breakpoints.on({
                    name: "mobile",
                    matched: function() {
                        offCanvasEl.show();
                        offCanvas.on("dragright dragleft", function(ev) {
                            ev.gesture.preventDefault();
                            if (ev.type == 'dragright') {
                                $.sidr('open', 'sidr-left');
                            } else {
                                $.sidr('close', 'sidr-left');
                            }
                        });
                    },
                    exit: function() {
                        offCanvasEl.hide();
                        offCanvas.off("dragright dragleft").on("dragright dragleft", function(ev) {
                            return false;
                        });
                    }
                });
            }
        }

        var HeaderOn = {
            removeLine: function() {
                headerWrapper.removeClass('sub__nav--on');
            },
            addLine: function() {
                return;
            }
        }

        function megaIn() {

            headerWrapper.addClass('sub__nav--on');
            $(this).find('.main-menu__link').css({
                'border-bottom': '9px solid'
            });
            $(this).find('.sub_menu').fadeIn(100);
        }

        function megaOut() {
            $(this).find('.main-menu__link').css({
                'border-bottom': 'none'
            });
            $(this).find('.sub_menu').fadeOut(100);
        }

        function mainMenu(breakpoint, _gender) {

            if (breakpoint == 'mobile' || MF.breakpoint.getActive() == 'mobile') {

                if (typeof _gender === "undefined" || _gender == "") {
                    return false;
                } else {
                    $.ajax({
                        url: "/_ui/rwd/common/menu/" + _gender + ".html",
                        cache:true
                    }).done(function(data) {
                        handleData(data);
                    });
                }

            } else {
                if ($('.slide-menu__list__wrapper').length) $.sidr('close', 'sidr-left');

                    var $emptySelector = $('.shop__cols__wrapper__');
                    var genderSelectorClass = 'shop__cols__wrapper__'+gender;
                
                    if ( $emptySelector.exists() ) {
                        $emptySelector.removeAttr('class').addClass(genderSelectorClass);
                    }

                $('#nav_main li').hoverIntent({
                    over: megaIn,
                    out: megaOut,
                    timeout: 50
                });

                $navMain.hoverIntent({
                    over: HeaderOn.addLine,
                    out: HeaderOn.removeLine,
                    timeout: 50
                });
            }
        }

        function tabletTrigger() {

            $('.sub_menu').on('click', function(event) {
                event.stopImmediatePropagation();
                console.log(event.type);

                 $navMain.find('.main-menu__link').css({
                        'border-bottom': 'none'
                    });
                    $navMain.find('.sub_menu').fadeOut(100, function(){
                        headerWrapper.removeClass('sub__nav--on');

                    });

                 $navMain.on('click', 'li',function(){
                    megaOut();
                    megaIn();
                 });
            });
        }

        function mobileMenu() {
            $('#offcanvas').on('click', '.slide-menu__header__item__link', function(event) {
                event.preventDefault();
                $('#offcanvaslist').children().remove();
                $('.slide-menu__header__item__active').fadeOut(10);
                mainMenu('mobile', $(this).attr('href').replace('#', ''));
                $(this).next('.slide-menu__header__item__active').fadeIn(10);
            });
        }

        function initStikyHeader(breakpoint) {

            var $body = $("body");
            var $topbar = $('.topbar');
            var $checkoutHeader = $('.checkout-header').length;
            var animPos = 14;

            var setState = null;

            if (!$('.page-productDetails').length) {
                if ((breakpoint == 'desktop' || breakpoint == 'desktop-large') && $('html').hasClass('no-touch')) {
                    var scrollTop = $window.scrollTop();

                    if (!$checkoutHeader) {
                        if (scrollTop >= animPos && setState != 1) {
                            setState = 1;
                            $body.addClass("fixed").css({
                                'padding-top': '92px'
                            });
                            $topbar.addClass("sticky");

                        } else if (scrollTop < animPos && setState != 2) {
                            setState = 2;

                            $body.removeClass("fixed").css({
                                'padding-top': '0'
                            });
                            $topbar.removeClass("sticky");
                        }
                    }

                } else {
                    $scroll.off("scroll.topBar");
                    $body.removeClass("fixed").css({
                        'padding-top': '0'
                    });
                    $topbar.removeClass("sticky");
                }
            }
        }


        function initScrollEvent() {
            $scroll.off("scroll.topBar").on("scroll.topBar", function() {
                initStikyHeader(MF.breakpoint.getActive());
            });
        }

        function updateHeader() {
            initStikyHeader(MF.breakpoint.getActive());
            mainMenu(MF.breakpoint.getActive());
            initScrollEvent(MF.breakpoint.getActive());
        }

        function windowResize() {
            $window.off("resize.MFHeader").on("resize.MFHeader", function() {
                clearTimeout(resizeWin);
                var resizeWin = setTimeout(updateHeader, 100);
            });

        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

if ($('.header-wrapper').length) MF.header.init();