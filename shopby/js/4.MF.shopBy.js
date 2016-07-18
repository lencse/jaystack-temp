
(function($) {

  'use strict';

  var MF = window.MF || {};

  MF.shopBy = (function() {

    var swCarousel, $swFader, $swThumbsArrow = undefined, //shop with
      stCarousel, $stFader, // studios
      clickEvType = (Modernizr.touch) ? 'touchstart' : 'click', // click/touch event
      currBreak,
      $videoWrapper, $notVideoWrapper, videoHeight, videoOffsetTop, videoWrapperHeight, footerOffsetTop, //video parallax
      $headerWrapper, $navHeaderWrapper, headerOffsetTop, notVideoOffsetTop, //nav header animation
      $mobMenu, mobMenuOffset; //mobile menu

    function getCurrentBreakpoint() {
      return MF.breakpoint.getActive();
    }
    
    function setNotVideoPosition() {
      videoHeight = $videoWrapper.height();
      // console.log('videoHeight', videoHeight);
      $notVideoWrapper.css('margin-top', videoHeight);
    }

    function resetNotVideoPosition() {
      $notVideoWrapper.css('margin-top', '');
    }

    function computeNotVideoPosition(newBreak) {
      // if ( newBreak != 'mobile' ) {
      if ( newBreak != 'mobile' && !$('html').hasClass('touch') ) { //temporary disabling video animation on mobile and tablet(device only)
        if ( $videoWrapper.hasClass('is_fixed') ) {
          setNotVideoPosition();
        }
      }
      else { //reset for mobile
        resetNotVideoPosition();
      }
    }

    function resetVideoPosition() {
      $videoWrapper.removeClass('is_fixed').css('top', '');
    }

    function setVideoPosition(windowOffsetTop) {
      
      // videoOffsetTop = $('.mf-shopby').offset().top;
      // console.log('videoOffsetTop', videoOffsetvideoOffsetTopop);
      // $videoWrapper.css('top', videoOffsetTop).addClass('is_fixed');
      $videoWrapper.css('top', windowOffsetTop + 'px').addClass('is_fixed');
    }

    /**
     * Checks if video scrolling has reached the footer of the page
     * @param  {[type]} windowOffsetTop [description]
     * @return {[type]}                 [description]
     */
    function checkIfBelowFooter(windowOffsetTop) {
      if ( $videoWrapper.hasClass('is_fixed') ) { //lets check if it has reched the footer
        videoWrapperHeight = $videoWrapper.height();
        if ( windowOffsetTop > $notVideoWrapper.height() - videoWrapperHeight ) {
          $videoWrapper.css({
            'z-index': -1,
            'opacity': 0
          });
        }
        else {
          $videoWrapper.css({
            'z-index': '',
            'opacity': ''
          });
        }
      }
    }

    function computeVideoPosition(newBreak) {
      // if ( newBreak != 'mobile' ) {
      if ( newBreak != 'mobile' && !$('html').hasClass('touch') ) { //temporary disabling video animation on mobile and tablet(device only)
        videoOffsetTop = $('.mf-shopby').offset().top;
        // console.log('videoOffsetTop', videoOffsetTop);
        var windowOffsetTop = $(window).scrollTop();
        // console.log('windowOffsetTop', windowOffsetTop);
        var topNavHeight = 0;
        // console.log('topNavHeight', topNavHeight);
        if ( newBreak != 'tablet' && !$('html').hasClass('touch') ) {
          if ( $('.header-wrapper__nav > .topbar').hasClass('sticky') ) {
            topNavHeight = $('.header-wrapper__nav').height();
            windowOffsetTop += topNavHeight;
            // console.log('desktop windowOffsetTop', windowOffsetTop);
          }
        }
        if ( windowOffsetTop >= videoOffsetTop ) {
          //lets check if it has reached the footer
          checkIfBelowFooter(windowOffsetTop);
          if ( !$videoWrapper.hasClass('is_fixed') || currBreak != newBreak ) {
            setVideoPosition(topNavHeight);
            setNotVideoPosition();
          }
        }
        else if ( $videoWrapper.hasClass('is_fixed') ) {
          resetVideoPosition();
          resetNotVideoPosition();
        }
      }
      else {  //reset for mobile
        resetVideoPosition();
      }
      currBreak = newBreak;
    }

    function onResizeVideo() {
      $(window).off('resize.video').on('resize.video', function() {
        var vidResTo;
        clearTimeout(vidResTo);
        vidResTo = setTimeout(function() {
          var newBreak = getCurrentBreakpoint();
          handleTopsectionOnMob(newBreak);
          computeVideoPosition(newBreak);
          computeNotVideoPosition(newBreak);
        }, 250);
      });
    }

    function onScrollVideo() {
      $(window).off('scroll.video').on('scroll.video', function() {
        computeVideoPosition(getCurrentBreakpoint());
      });
    }  

    function handleTopsectionOnMob(currBreak) {
      if ( currBreak == 'mobile' && $videoWrapper.find('.mf-shopby__header__copy').length ) {
        $('#sb-header-copy').detach().insertAfter($('.mf-shopby__content__video'));
        $('#sb-header-copy').show();
      }
      else if ( currBreak != 'mobile' && !$videoWrapper.find('.mf-shopby__header__copy').length ) {
        $('#sb-header-copy').detach().appendTo($('.mf-shopby__content__video .mf-shopby__header'));
      }
    }  

    function handleVideo() {
      $videoWrapper = $('.mf-shopby__content__video');
      $notVideoWrapper = $('.mf-shopby__content__notvideo');

      var newBreak = getCurrentBreakpoint();
      handleTopsectionOnMob(newBreak);
      videoOffsetTop = $('.mf-shopby').offset().top;
      // console.log('$(window).scrollTop()', $(window).scrollTop());
      // console.log('videoOffsetTop', videoOffsetTop);
      if ( $(window).scrollTop() > videoOffsetTop ) {
        computeVideoPosition(newBreak);
        computeNotVideoPosition(newBreak);
      }
      onScrollVideo();
      onResizeVideo();
    }

    // //SIDEBAR HEADER ANIMATION WITH VIDEO ANIMATION ENABLED FOR TABLET (DEVICE)
    // function computeHeaderAnimation(newBreak) {
    //   headerOffsetTop = $headerWrapper.offset().top;
    //   notVideoOffsetTop = $notVideoWrapper.offset().top;
    //   // pull nav header in
    //   if ( headerOffsetTop >= notVideoOffsetTop && ( !$navHeaderWrapper.hasClass('slide-in-now') 
    //         || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
    //     $navHeaderWrapper.removeClass('slide-out slide-in-now');
    //     $navHeaderWrapper.slideDown(500, function() {
    //       $navHeaderWrapper.addClass('slide-in-now');
    //     });
    //   }
    //   // push nav header out
    //   else if ( headerOffsetTop < notVideoOffsetTop && ( !$navHeaderWrapper.hasClass('slide-out')
    //         || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
    //     $navHeaderWrapper.removeClass('slide-out').addClass('slide-out');
    //     $navHeaderWrapper.removeClass('slide-in-now');
    //     $navHeaderWrapper.slideUp(500, function() {
    //         $navHeaderWrapper.css({
    //             'overflow': '',
    //             'display': ''
    //         });
    //     });
    //   }
    // }
    
    //SIDEBAR HEADER ANIMATION WITH VIDEO ANIMATION DISABLED FOR TABLET (DEVICE)
    function computeHeaderAnimation(newBreak) {
      headerOffsetTop = $headerWrapper.offset().top;
       // DEVICES
      if ( $('html').hasClass('touch') ) {
        // pull nav header in
        if ( $(window).scrollTop() >= headerOffsetTop && ( !$navHeaderWrapper.hasClass('slide-in-now') 
              || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
          $navHeaderWrapper.removeClass('slide-out slide-in-now');
          $navHeaderWrapper.slideDown(500, function() {
            $navHeaderWrapper.addClass('slide-in-now');
          });
        }
        // push nav header out
        else if ( $(window).scrollTop() < headerOffsetTop && ( !$navHeaderWrapper.hasClass('slide-out')
              || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
          $navHeaderWrapper.removeClass('slide-out').addClass('slide-out');
          $navHeaderWrapper.removeClass('slide-in-now');
          $navHeaderWrapper.slideUp(500, function() {
              $navHeaderWrapper.css({
                  'overflow': '',
                  'display': ''
              });
          });
        }
      }
      // NON DEVICES
      else { 
        notVideoOffsetTop = $notVideoWrapper.offset().top;
        // pull nav header in
        if ( headerOffsetTop >= notVideoOffsetTop && ( !$navHeaderWrapper.hasClass('slide-in-now') 
              || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
          $navHeaderWrapper.removeClass('slide-out slide-in-now');
          $navHeaderWrapper.slideDown(500, function() {
            $navHeaderWrapper.addClass('slide-in-now');
          });
        }
        // push nav header out
        else if ( headerOffsetTop < notVideoOffsetTop && ( !$navHeaderWrapper.hasClass('slide-out')
              || ( $navHeaderWrapper.hasClass('slide-in-now') && $navHeaderWrapper.hasClass('slide-out') ) ) ) { // hack
          $navHeaderWrapper.removeClass('slide-out').addClass('slide-out');
          $navHeaderWrapper.removeClass('slide-in-now');
          $navHeaderWrapper.slideUp(500, function() {
              $navHeaderWrapper.css({
                  'overflow': '',
                  'display': ''
              });
          });
        }
      }
    }

    function onScrollSidebar(newBreak) {
      $(window).off('scroll.sidebar').on('scroll.sidebar', function() {
        var newBreak = getCurrentBreakpoint();
        if ( newBreak != "mobile" ) {
          computeHeaderAnimation(newBreak);
        }
      });
    }

    function onResizeSidebar() {
      var rsTo;
      $(window).off('resize.sidebar').on('resize.sidebar', function() {
        clearTimeout(rsTo);
        rsTo = setTimeout(function() {
          var newBreak = getCurrentBreakpoint();
          if ( newBreak != "mobile" ) { //not mobile
            computeHeaderAnimation(newBreak);
          }
          else { //mobile
            $navHeaderWrapper.removeClass('slide-out slide-in-now');
            $navHeaderWrapper.css({
                'overflow': '',
                'display': ''
            });
          }
        }, 250);
      });
    }

    function handleSideBarAnimation() {
      $headerWrapper = $('.mf-shopby__header');
      $navHeaderWrapper = $('.mf-shopby__nav__header');

      $('#mf-shopby__nav').addClass('slide-in');
      var newBreak = getCurrentBreakpoint();
      computeHeaderAnimation(newBreak);
      onScrollSidebar(newBreak);
      onResizeSidebar();
    }

    // function initStickyMobile($mobMenu, mobMenuOffset) {
    function initStickyMobile() {
      if ( getCurrentBreakpoint() == 'mobile' ) {
        mobMenuOffset = $('.mf-shopby__breadcrumb__mob__wrapper').offset().top;
        if ( $(window).scrollTop() >= mobMenuOffset - 20 ) {
          $mobMenu.addClass('is_stuck');
        }
        else {
          $mobMenu.removeClass('is_stuck');
        }
      }
      else {
        $mobMenu.removeClass('is_stuck');
      }
    }

    function onScrollResizeMobMenu() {
      $(window).off('scroll.mobmenu').on('scroll.mobmenu', function() {
        initStickyMobile($mobMenu, mobMenuOffset);
      });
      var rmm;
      $(window).off('resize.mobmenu').on('resize.mobmenu', function() {
        clearTimeout(rmm);
        rmm = setTimeout(function(){
          initStickyMobile($mobMenu, mobMenuOffset);
        }, 250);
      });
    }

    function initStickyMenu() {
      //initializing sticky bar on tablet, desktop and large desktop breakpoints
      MF.stickitShopby.init({
          targetElement: '#mf-shopby__nav--sticky',
          topElement: '.header-wrapper',
          // topOffset: 70,
          // topOffsetTab: 40,
          topOffset: 53,
          topOffsetTab: 39,
          bottomElement: '.mf-footer',
          bottomOffset: 20
      });

      //initializing sticky menu on mobile
      $mobMenu = $(".mf-shopby__breadcrumb__mob");
      // mobMenuOffset = $('.mf-shopby__breadcrumb__mob__wrapper').offset().top;
      // initStickyMobile($mobMenu, mobMenuOffset);
      initStickyMobile();
      onScrollResizeMobMenu();
    }

    /**
     * Builds a specific dropdown
     * @param  {jQuery object} $selectWrapper Wrapper of the <select> element
     * @return {[type]}                [description]
     */
    function initDropdown($selectWrapper) {
      MF.select.init({
        contextId: $selectWrapper,
        links: true,
        mobile: true
      });
    }

    /**
     * Builds the Digital Trunkshows carousel
     */
    function initTrunkShows() {
      $('.mf-shopby__dt__car').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: false,
          mobileFirst: true,
          responsive: [{
                  breakpoint: 980, //until 980 (tablet)
                  settings: {
                      infinite: true,
                      dots: false,
                      slidesToShow: 3,
                      slidesToScroll: 1
                  }
              }, {
                  breakpoint: 680, //until 680 (mobile)
                  settings: {
                      infinite: true,
                      dots: true,
                      slidesToShow: 1,
                      slidesToScroll: 1
                  }
              }
          ]
      });
    }

    /**
     * Handles actions on mobile breakpoint
     * builds thumbnails carousel and destroys content scroller
     * @return {[type]}
     */
    function handleShopWithMobile() {
      if ( getCurrentBreakpoint() == "mobile" ) {
        var $thumbsArrow = $('#sw-thumbs-arrow');
        if ( $('#sw-thumbs-arrow').length ) {
          $swThumbsArrow = $thumbsArrow.detach();
        }
        //destroy fader 
        $swFader = $('.mf-shopby__sw__copy');
        if ( $swFader.children('.cycle-slide').length > 0 ) {
          $swFader.cycle('destroy');
          //let's remove active flag from thumbs
          $('.mf-shopby__sw__thumbs').children().removeClass("active");
          //let's put back the looks in the initial order
          $('.mf-shopby__sw__look').empty().html($('#swlookbkp').html());
        }
        //build thumbs carousel
        var swMobTo;
        clearTimeout(swMobTo);
        swMobTo = setTimeout(function() {
          var $car = $('.mf-shopby__sw__thumbs');
          if ( typeof swCarousel == "undefined" || (typeof swCarousel != "undefined" && !swCarousel.parents('.bx-wrapper').length) ) {
            var $carouselCta,
              $look = $('.mf-shopby__sw__look'),
              $lookChildren = $look.children();
            swCarousel = $car.bxSlider({
              auto: true,
              onSliderLoad: function() {
                $carouselCta = $car.find('figcaption');
              },
              onSlideAfter: function($slideElement, oldIndex, newIndex) {
                $carouselCta.fadeIn();

                var $currLook = $($lookChildren.get(newIndex)).detach();
                $look.prepend($currLook);
              },
              onSlideBefore: function() {
                $carouselCta.hide();
              }
            });
          }
        }, 250);
      }
    }

    function computeSwArrowPos($activeThumb) {
      return $activeThumb.position().left + ($activeThumb.outerWidth(true) / 2);
    }

    function onResizeThumbArrow() {
      var $thumbsArrow = $('#sw-thumbs-arrow');
      var rtaTo;
      $(window).off('resize.thumbarrow').on('resize.thumbarrow', function() {
        if ( getCurrentBreakpoint() != "mobile" ) { //not mobile
          var $nextThumb = $('.mf-shopby__sw__thumbs > a.active');
          if ( $nextThumb.length ) {
            $thumbsArrow.css('left', computeSwArrowPos($nextThumb) + 'px');
            $thumbsArrow.show();
          }
        }
        else { //mobile
          $thumbsArrow.hide();
        }
      });
    }

    /**
     * Handles actions on tablet, desktop and large desktop breakpoints
     * builds content scroller and destroys thumbnails carousel
     * @return {[type]}
     */
    function handleShopWithNotMobile() {
      if ( getCurrentBreakpoint() != "mobile" ) {
        //destroy thumbs carousel
        if ( typeof swCarousel != "undefined" && swCarousel.parents('.bx-wrapper').length ) {
          swCarousel.destroySlider();
          swCarousel.find('figcaption').css('display', '');
          //let's put back the looks in the initial order
          $('.mf-shopby__sw__look').empty().html($('#swlookbkp').html());
        }
        var $thumbs = $('.mf-shopby__sw__thumbs'),
            $thumbsArrow = $('#sw-thumbs-arrow');
        if ( !$thumbsArrow.length && typeof $swThumbsArrow != "undefined" ) {
          $thumbs.append($swThumbsArrow);
          $thumbsArrow = $thumbs.children('#sw-thumbs-arrow');
          $swThumbsArrow = undefined;
        }
        //load fader
        var swTo;
        clearTimeout(swTo);
        swTo = setTimeout(function() {
          if ( $('.mf-shopby__sw__copy').children('.cycle-slide').length <= 0 ) {
              // var $thumbs = $('.mf-shopby__sw__thumbs'),
              var thumbsChildren = $thumbs.children('a'),
                  $look = $('.mf-shopby__sw__look'),
                  lookChildren,// = $look.children(),
                  $swFader = $('.mf-shopby__sw__copy'),
                  faderChildren = $swFader.children(),
                  currIndexb, currIndexa,
                  nextIndexb, nextIndexa;
              $(thumbsChildren.get(0)).addClass('active');
              //loads arrow
              if ( $thumbsArrow.is(':hidden') ) {
                var $nextThumb = $('.mf-shopby__sw__thumbs > a.active');
                if ( $nextThumb.length ) {
                  $thumbsArrow.css('left', computeSwArrowPos($nextThumb) + 'px');
                  $thumbsArrow.show();
                }
              }
              //loads fader
              $swFader.cycle({
                speed: 10,
                delay: 5000,
                timeout: 5000,
                slides: '>p'
              });
              $swFader.on( 'cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                  currIndexb = faderChildren.index(outgoingSlideEl);
                  // console.log('currIndex', currIndex);
                  $thumbsArrow.hide();
                  $(thumbsChildren.get(currIndexb)).removeClass("active");
                  nextIndexb = faderChildren.index(incomingSlideEl);
                  // console.log('nextIndex', nextIndex);
                  $nextThumb = $(thumbsChildren.get(nextIndexb));
                  $nextThumb.addClass("active");
                  $thumbsArrow.css('left', computeSwArrowPos($nextThumb) + 'px');
                  $thumbsArrow.show();

                  lookChildren = $look.children();
                  // var $currLook = $(lookChildren.get(0)).detach();
                  // $look.append($currLook);
                  $(lookChildren.get(currIndexb)).removeClass("active");
                  $(lookChildren.get(nextIndexb)).addClass("active");
              });
          }
        }, 250);
      }
    }

    function swThumbsHoverIn($elemHover) {
        if ( getCurrentBreakpoint() != 'mobile' ) {
            var thumbIndex = $('.mf-shopby__sw__thumbs').children().index($elemHover);
            $('.mf-shopby__sw__copy').cycle('goto', thumbIndex);
        }
    }

    function swLookHoverIn($elemHover) {
        if ( getCurrentBreakpoint() != 'mobile' ) {
            var lookIndex = $('.mf-shopby__sw__look').children().index($elemHover.parent());
            $('.mf-shopby__sw__copy').cycle('goto', lookIndex);
        }
    }

    function onHoverShopWith() {
      //on hover the thumbs
      $(".mf-shopby__sw__thumbs > a").off("mouseenter.shopbyswthumb").on( "mouseenter.shopbyswthumb", function() {
        event.stopPropagation();
        swThumbsHoverIn($(this));
      });
      //on hover the look
      $(".mf-shopby__sw__look img").off("mouseenter.shopbyswlook").on( "mouseenter.shopbyswlook", function() {
        event.stopPropagation();
        swLookHoverIn($(this));
      });
    }
    
    /**
     * Initiates Shop With actions/events
     * @return {[type]} [description]
     */
    function initShopWith() {
      //lets backup the look content (order)
      if ( !$('#swlookbkp').length ) {
        $('body').append($('<div id="swlookbkp"></div>').hide().html($('.mf-shopby__sw__look').html()));
      }
      //building thumbs carousel and destroying scroller on mobile breakpoint
      handleShopWithMobile();
      //building scroller and destroying thumbs carousel on tablet or desktop breakpoints
      handleShopWithNotMobile();

      onHoverShopWith();

      onResizeThumbArrow();
    }

    /**
     * Handles actions on mobile and tablet breakpoints
     * builds carousel and destroys content scroller
     * @return {[type]}
     */
    function handleStudiosMobTab() {
      if ( getCurrentBreakpoint() == 'mobile' || getCurrentBreakpoint() == 'tablet' ) {
        //destroy fader 
        $stFader = $('.mf-shopby__st__data');
        if ( $stFader.children('.cycle-slide').length > 0 ) {
          $stFader.cycle('destroy');
          //let's remove active flag from categories
          $('.mf-shopby__st__cat').children().removeClass("active");
        }

        var stMobTo;
        clearTimeout(stMobTo);
        stMobTo = setTimeout(function() {
          //build carousel
          if ( typeof stCarousel == "undefined" ) {
            var $car = $('.mf-shopby__st__data');
            var $carouselCta;
            stCarousel = $car.bxSlider({
              auto: true,
              onSliderLoad: function() {
                $carouselCta = $car.find('figcaption');
              },
              onSlideAfter: function() {
                $carouselCta.fadeIn();
              },
              onSlideBefore: function() {
                $carouselCta.hide();
              }
            });
          }
        }, 250);
      }
    }

    /**
     * Handles actions on desktop and large desktop breakpoints
     * builds content scroller and destroys carousel
     * @return {[type]}
     */
    function handleStudiosDesktop() {
      var currBreak = getCurrentBreakpoint();
      if ( currBreak == "desktop" || currBreak == "desktop-large" ) {
        //destroy carousel
        if ( typeof stCarousel != "undefined" ) {
          stCarousel.destroySlider();
          stCarousel = undefined;
        }
        //load fader
        var stTo;
        clearTimeout(stTo);
        stTo = setTimeout(function() {
          if ( $('.mf-shopby__st__data').children('.cycle-slide').length <= 0 ) {
              var catsList = $('.mf-shopby__st__cat').children(),
                  $stFader = $('.mf-shopby__st__data'),
                  faderChildren = $stFader.children(),
                  currIndexb, currIndexa,
                  nextIndexb, nextIndexa;
              $(catsList.get(0)).addClass('active');
              $stFader.cycle({
                speed: 10,
                slides: '>a'
              });
              $stFader.on( 'cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                  currIndexb = faderChildren.index(outgoingSlideEl);
                  $(catsList.get(currIndexb)).removeClass("active");
                  nextIndexb = faderChildren.index(incomingSlideEl);
                  $(catsList.get(nextIndexb)).addClass("active");
              });
          }
        }, 250);

        adjustStStrokeHeight(currBreak);
      }
    }

    function adjustStStrokeHeight(currBreak) {
      //adjust horizontal stroke height
      if ( currBreak == "desktop" || currBreak == "desktop-large" ) {
        var catH = $('.mf-shopby__st__cat').height();
        // console.log('catH', catH);
        var imgH;
        var stInt = setInterval(function() {
          imgH = $('.mf-shopby__st__data__wrapper .cycle-slide-active img').height();
          // console.log('imgH', imgH);
          if ( imgH > 0 ) {
            clearInterval(stInt);
            if ( imgH > catH ) {
              $('.mf-shopby__st__cat__wrapper').css('min-height', imgH);
            }
          }
        }, 100);
      }
    }

    function studiosHoverIn($elemHover) {
        if ( getCurrentBreakpoint() == 'desktop' || getCurrentBreakpoint() == 'desktop-large' ) {
            var catIndex = $('.mf-shopby__st__cat').children().index($elemHover);
            $('.mf-shopby__st__data').cycle('goto', catIndex);
        }
    }

    function onHoverStudios() {
      //on hover the categories
      $(".mf-shopby__st__cat > li").off("mouseenter.shopbystudios").on( "mouseenter.shopbystudios", function() {
        event.stopPropagation();
        studiosHoverIn($(this));
      });
    }

    /**
     * Initiates Studios actions/events
     * @return {[type]} [description]
     */
    function initStudios() {
      //loading studios drop down (mobile)
      initDropdown($(".mf-shopby__st__cat__mob"));
      // building the studios carousel
      handleStudiosMobTab();
      // buuilding studios scroller
      handleStudiosDesktop();

      onHoverStudios();

      adjustStStrokeHeight();
    }

    function handleFeaturedProductsCarousel($wrapper) {
      if ( getCurrentBreakpoint() != 'mobile' ) {
          onResizeMoreLessBtns();
          if ( !$wrapper.hasClass('slick-initialized') ) {
            $wrapper.slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false,
                speed: 500,
                responsive: [
                    {
                        breakpoint: 980, //until 980 (tablet)
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    }
                ],
                onBeforeChange: function(event, slick, currentSlide, nextSlide){
                  $(this)[0].$slider.find('.slick-slide').find('figcaption').css('visibility', 'hidden');
                },
                onAfterChange: function(event, slick, currentSlide){
                  $(this)[0].$slider.find('.slick-slide').filter('.slick-active').find('figcaption').hide().css('visibility', 'visible').fadeIn(250);
                }
            });
          }
        }
        else if ( $wrapper.hasClass('slick-initialized') ) {
          $wrapper.unslick();
        }
    }

    /**
     * Handles Featured Products carousels
     * @return {[type]} [description]
     */
    function handleFeaturedProductsCarousels() {
      var $carouselsList = $('.mf-shopby__prods__car');
      var $prodsCar;
      $carouselsList.each(function(index) {
        $prodsCar = $(this);
        handleFeaturedProductsCarousel($prodsCar);
        // if ( getCurrentBreakpoint() != 'mobile' ) {
        //   if ( !$prodsCar.hasClass('slick-initialized') ) {
        //     $prodsCar.slick({
        //         infinite: true,
        //         slidesToShow: 4,
        //         slidesToScroll: 4,
        //         dots: false,
        //         speed: 500,
        //         responsive: [
        //             {
        //                 breakpoint: 980, //until 980 (tablet)
        //                 settings: {
        //                     slidesToShow: 3,
        //                     slidesToScroll: 3
        //                 }
        //             }
        //         ],
        //         onBeforeChange: function(event, slick, currentSlide, nextSlide){
        //           $(this)[0].$slider.find('.slick-slide').find('figcaption').css('visibility', 'hidden');
        //         },
        //         onAfterChange: function(event, slick, currentSlide){
        //           $(this)[0].$slider.find('.slick-slide').filter('.slick-active').find('figcaption').hide().css('visibility', 'visible').fadeIn(250);
        //         }
        //     });
        //   }
        // }
        // else if ( $prodsCar.hasClass('slick-initialized') ) {
        //   $prodsCar.unslick();
        // }
      });
    }

    function onResizeMoreLessBtns() {
      $('.mf-shopby__loadmore, .mf-shopby__showless').css({
        'display': '',
        'overflow': ''
      });
      $('.mf-shopby__prods__car > div').css({
        'display': '',
        'overflow': ''
      });
    }

    function initShowLessBtns() {
      var clickEv = clickEvType + '.showless';
      $('a.mf-shopby__showless').off(clickEv).on(clickEv, '', function(ev) {
        ev.preventDefault();
        var $btn = $(this);
        $('html, body').animate({ // scrolls to btn position
            scrollTop: $btn.parent().offset().top
        }, 250);
        var $moreBtn = $btn.prev();
        $btn.hide();
        $moreBtn.prev().children(':nth-child(n+3)').slideUp(250); //collapses elements
        $moreBtn.css('display', 'block'); //shows 'Load More' button
      });
    }

    /**
     * Loads Load More buttons action
     * @return {[type]} [description]
     */
    function initLoadMoreBtns() {
      var clickEv = clickEvType + '.loadmore';
      $('a.mf-shopby__loadmore').off(clickEv).on(clickEv, '', function(ev) {
        ev.preventDefault();
        var $btn = $(this);
        var $lessBtn = $btn.next();
        $btn.prev().children().slideDown(250);
        $btn.hide();
        $lessBtn.css('display', 'block'); //shows 'Show less' button
      });

      initShowLessBtns(); //inits Show Less buttons
    }

    /**
     * Initiates Featured Products sections
     * @return {[type]} [description]
     */
    function initFeaturedProducts() {
      // loads/destroys studios carousel depending on the breakpoint
      // handleFeaturedProductsCarousels();
      MF.shopBy.prodsByCat.init();
      // loads Load More buttons action
      initLoadMoreBtns();
    }

    function thCatClick($elemHover) {
        if ( getCurrentBreakpoint() == 'desktop' || getCurrentBreakpoint() == 'desktop-large' ) {
            var thumbIndex = $('.mf-shopby__th__cat').children().index($elemHover.parent());
            $('.mf-shopby__th__car').slickGoTo(thumbIndex);
        }
    }

    function onClickThCat() {
      //on click on the categories
      $(".mf-shopby__th__cat > li > a").off("click.shopbythcat").on( "click.shopbythcat", function() {
        event.stopPropagation();
        thCatClick($(this));
      });
    }

    /**
     * Handles the Trend Hub carousel
     * @return {[type]} [description]
     */
    function handleTrendHubCarousel() {
      var thCarChildren = $('.mf-shopby__th__car').children(),
          thCatChildren = $('.mf-shopby__th__cat').children();
      $('.mf-shopby__th__car').slick({
          centerMode: true,
          // centerPadding: '12.63636%',
          centerPadding: '20.45455%',
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          autoplay: true,
          // variableWidth: true,
          responsive: [
              {
                  breakpoint: 980, //until 680 (tablet)
                  settings: {
                      centerMode: true,
                      centerPadding: '13.81481%',
                  }
              },
              {
                  breakpoint: 680, //until 680 (mobile)
                  settings: {
                      centerMode: false//,
                      // variableWidth: false,
                      // adaptiveHeight: true
                  }
              }
          ],
          onBeforeChange: function(slick, currentSlide, nextSlide){
            $(this)[0].$slider.find('.slick-slide').find('figcaption').css('visibility', 'hidden');
            $(thCatChildren.get(currentSlide)).removeClass("active");
          },
          onAfterChange: function(slick, currentSlide){
            $(this)[0].$slider.find('.slick-slide').filter('.slick-active').find('figcaption').hide().css('visibility', 'visible').fadeIn(250);
            $(thCatChildren.get(currentSlide)).addClass("active");
          }
      });
    }

    /**
     * Initiates Trend Hub section
     * @return {[type]} [description]
     */
    function initTrendHub() {
      //loading trend hub drop down (mobile)
      initDropdown($(".mf-shopby__th__cat__mob"));
      // building the trend hub carousel
      handleTrendHubCarousel();

      onClickThCat();
    }

    function handleExclusivesCarousel($wrapper) {
      $wrapper.slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          onInit: function(slick){
            $(this)[0].$slider.find('.slick-slide:not(".slick-active")').find('figcaption').css('visibility', 'hidden');
          },
          onBeforeChange: function(event, slick, currentSlide, nextSlide){
            $(this)[0].$slider.find('.slick-slide.slick-active').find('figcaption').css('visibility', 'hidden');
          },
          onAfterChange: function(event, slick, currentSlide){
            $(this)[0].$slider.find('.slick-slide.slick-active').find('figcaption').hide().css('visibility', 'visible').fadeIn(250);
          }
      });
    }

    /**
     * Handles Designer Exclusives carousels
     * @return {[type]} [description]
     */
    function handleExclusivesCarousels() {
      var $carouselsList = $('.mf-shopby__ex__car');
      var $prodsCar;
      $carouselsList.each(function(index) {
        $prodsCar = $(this);
        handleExclusivesCarousel($prodsCar);
      // $('.mf-shopby__ex__car').slick({
      //     infinite: true,
      //     slidesToShow: 1,
      //     slidesToScroll: 1,
      //     dots: true,
      //     onInit: function(slick){
      //       $(this)[0].$slider.find('.slick-slide:not(".slick-active")').find('figcaption').css('visibility', 'hidden');
      //     },
      //     onBeforeChange: function(event, slick, currentSlide, nextSlide){
      //       $(this)[0].$slider.find('.slick-slide.slick-active').find('figcaption').css('visibility', 'hidden');
      //     },
      //     onAfterChange: function(event, slick, currentSlide){
      //       $(this)[0].$slider.find('.slick-slide.slick-active').find('figcaption').hide().css('visibility', 'visible').fadeIn(250);
      //     }
      // });
      });
    }

    /**
     * Handles promos imagery - if faders or not
     * @return {[type]} [description]
     */
    function handleExclusivesFaders() {
      var $promosList = $('.mf-shopby__ex__promo'),
          $promo;
      $promosList.each(function(index) {
        $promo = $(this);
        if ( $promo.children().length > 1 ) { //has multiple images, so it'll be a fader
          $promo.cycle({
            speed: 500,
            slides: '>figure'
          });
        }
      });
    }

    /**
     * Initiates Designers Exclusives section
     * @return {[type]} [description]
     */
    function initExclusives() {
      //loading carousels
      // handleExclusivesCarousels();
      MF.shopBy.prods.init();
      //loading faders
      handleExclusivesFaders();
    }

    function sliceText(text, nrChars) {
      var newText = text;
      if ( text.length > nrChars ) {
        newText = text.slice(0, nrChars) +
                  '<span class="mf-shopby__copy-hidden">' +
                  text.slice(187) +
                  '</span>' +
                  '<span class="mf-shopby__copy-hidden__ret">...</span>' +
                  '<a href="javascript:void(0)" class="mf-shopby__copy-hidden__btn"> READ MORE</a>';
      }
      return newText;
    }

    function loadReadMoreAction() {
      var $btn;
      $.each($('.mf-shopby__copy-hidden__btn'), function(index, elem) {
        $(elem).off(clickEvType + '.shopByReadmore').on(clickEvType + '.shopByReadmore', function(event) {
          event.preventDefault();
          $btn = $(this);
          $btn.prev().hide();
          $btn.hide();
          $btn.siblings('.mf-shopby__copy-hidden').show();
        });
      });
    }

    function initReadMore() {
      var textList = $('.mf-shopby__dt, .mf-shopby__sw, .mf-shopby__ex').find('header p'),
          $elem,
          text, newText;
      $.each(textList, function(index, elem) {
        $elem = $(elem);
        $elem.html(sliceText($elem.text(), 187));
      });

      loadReadMoreAction();
    }


    /**
     * Actions bound to the resize event
     * @return {[type]} [description]
     */
    function onResize() {
      var to;
      $(window).off('resize.shopby').on('resize.shopby', function() {
        clearTimeout(to);
        to = setTimeout(function() {
          currBreak = getCurrentBreakpoint();
          // handling shop with actions on resize
          handleShopWithMobile();
          handleShopWithNotMobile();
          // handling studios actions on resize
          handleStudiosMobTab();
          handleStudiosDesktop();
          // loads/destroys products carousels depending on the breakpoint
          handleFeaturedProductsCarousels();
        }, 250);

        currBreak = getCurrentBreakpoint();
        adjustStStrokeHeight(currBreak);
      });
    }

    
    /**
     * Loads the Digital Trunkshows actions/events
     */
    function init() {
      currBreak = getCurrentBreakpoint();

      handleVideo();

      handleSideBarAnimation();

      initReadMore();

      //loading breadcrumb drop down (mobile)
    	initDropdown($(".mf-shopby__breadcrumb__mob"));

      //loading sticky menu
      initStickyMenu();

      // building Trunkshows carousel
      initTrunkShows();

      //loading Shop With actions
      initShopWith();

      // loading Studios actions
      initStudios();

      // loading Featured Products actions
      initFeaturedProducts();

      // loading Trend Hub actions
      initTrendHub();

      // loading Designers Exclusives actions
      initExclusives();

      // actions on window resize (when transitioning breakpoint)
      onResize();

      //init social
      MF.shareButtonsURLs.init();
    }

    return {
      init: init,
      loadProdsCarousel: handleExclusivesCarousel,
      loadCategoriesCarousel: handleFeaturedProductsCarousel
    };

  })();

  window.MF = MF;

}(jQuery));

$(document).ready(function() {
    MF.shopBy.init();
});
