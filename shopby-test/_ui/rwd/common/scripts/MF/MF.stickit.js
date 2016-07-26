
/*
 *  require : jQuery
 *
 */
(function ($, window, mediator) {
    'use strict';

    var MF = window.MF = window.MF || {};

    var $window, $body, $targetElement, $topElement, $bottomElement, $wrapperElement
    ,   oldTargetElementPosition
    ,   oldWindowScroll = 0
    ,   oldTotalTopElementHeights
    ,   options
    ,   oldTopElementTopOffset
    ,   defaultOptions = { topOffset: 0, bottomOffset: 0 }
    ,   initialized = false


    function computePositions() {


        if (!enabledStickyBehaviour) {
            $targetElement.removeAttr('style');
            $wrapperElement.removeAttr('style');
            return;
        }


        var $relevantTopElement
        ,   referenceUpperLimit = -Infinity
        ,   totalTopElementHeights = 0;
        
        $topElement.each(function(){
            var $this = $(this)
            ,   topElementTopOffset = $this.offset().top
            ,   topElementHeight = $this.height()
            ,   upperLimit = topElementTopOffset + topElementHeight;

            totalTopElementHeights += topElementHeight;

            if ( upperLimit > referenceUpperLimit ) {
                referenceUpperLimit = upperLimit;
                $relevantTopElement = $this;
            }
        });

    	var topElementTopOffset = $relevantTopElement.offset().top
    	, 	topElementHeight = $relevantTopElement.height()
    	, 	bottomElementTopOffset = $bottomElement.offset().top
		,	targetElementTopOffset = $targetElement.offset().top
		,	targetElementHeight = $targetElement.height()
		,	windowScroll = $window.scrollTop()
		,	windowHeight = $window.height()

        // Fix bouncy effect on chrome
        windowScroll = Math.min ( windowScroll, $body.height() + parseInt($body.css('padding-top')) - windowHeight );   //prevent bouncing effect when scrolling beyond the bottom edge of the document when using touchpad
        windowScroll = Math.max ( windowScroll, 0 );                                                                    //prevent bouncing effect when scrolling beyond the top edge of the document when using touchpad

		var upperLimit = Math.max(topElementTopOffset + topElementHeight, windowScroll) + options.topOffset         // actual position of the top elements' bottom, or the top visible area of the window (whichever is lower)
		,	lowerLimit = Math.min(bottomElementTopOffset, windowScroll + windowHeight) - options.bottomOffset       // actual position of the bottom elements' top, or the bottom visible area of the window (whichever is higher)
        ,   elementLowerLimit = bottomElementTopOffset - options.bottomOffset                                       // actual position of the bottom element's top

		,	upperAlignement = upperLimit - windowScroll
		,	lowerAlignement = lowerLimit - targetElementHeight - windowScroll
        ,   elementLowerAlignement = elementLowerLimit - targetElementHeight - windowScroll
		,	targetElementPosition;



        oldTargetElementPosition = (oldTargetElementPosition || upperAlignement);
        targetElementPosition = oldTargetElementPosition - windowScroll + oldWindowScroll + totalTopElementHeights - oldTotalTopElementHeights;
        targetElementPosition = Math.max( targetElementPosition, lowerAlignement );             // preferably don't allow space between the lower elements and the target element
        targetElementPosition = Math.min( targetElementPosition, elementLowerAlignement );      // never allow the target element to go beneath the bottom elements
        targetElementPosition = Math.min( targetElementPosition, upperAlignement );             // never allow space between the top elements and the target element


        // Fix bouncy issue on safari when scrolling upwards beyond the edge of the document
        // Also prevent the top to be set too early
        if ($window.scrollTop() <= 75) {
            var topOffScreenScrollOffset = $targetElement.offset().top;
            targetElementPosition += topOffScreenScrollOffset;
        }

        // Fix bouncy issue on safari when scrolling downwards beyond the edge of the document
        if ($window.scrollTop() + $window.height() > $body.height() + parseInt($body.css('padding-top')) && $window.height() < $body.height() + parseInt($body.css('padding-top'))) {
            if(Math.abs($targetElement.offset().top - (oldTargetElementPosition + $window.scrollTop())) < 1) {
                var bottomOffScreenScrollOffset = $window.scrollTop() + $window.height() - ($body.height() + parseInt($body.css('padding-top')));
                targetElementPosition -= bottomOffScreenScrollOffset;
            }
        }
        // Also keep the sticky static so it does not jump over the header
        if($window.scrollTop() <= 75) {
            $targetElement.css({
                'position': 'static',
                'top': ''
            });
        } else {
    		$targetElement.css({
                'position': 'fixed',
                'top': targetElementPosition + 'px'
            });
        }

		oldTargetElementPosition = targetElementPosition;
		oldWindowScroll = windowScroll;
        oldTotalTopElementHeights = totalTopElementHeights;
        oldTopElementTopOffset = topElementTopOffset;
    }

    var oldWidth, oldHeight;
    function computeSizes() {
        if (!enabledStickyBehaviour) {
            return;
        }
        var width = $wrapperElement.width();
        if(width != oldWidth) {
          $targetElement.width(width);
          oldWidth = width;
        }
        var height = $targetElement.height();
        if(height != oldHeight) {
          $wrapperElement.height(height);
          oldHeight = height;
        }
    }

    var enabledStickyBehaviour = true;
    function disableStickyBehaviour() {
        if (enabledStickyBehaviour) {
            enabledStickyBehaviour = false;
            $(window).trigger('scroll');
        }
    }

    function enableStickyBehaviour() {
        if (!enabledStickyBehaviour && !Modernizr.touch) {
            enabledStickyBehaviour = true;
            
            $(window).trigger('scroll');
           
        }
    }

    function registerEvents() {
    	$window.on('scroll resize', computePositions);
    	$window.on('scroll resize', computeSizes);
		$body.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', computePositions);
        mediator.subscribe('mf-expand:animation-ended', function(){ $(window).trigger('resize') });
    }

    function unRegisterEvent() {
        if(!initialized) {
            // nothing to unregister
            return;
        }
        $window.off('scroll resize', computePositions);
        $window.off('scroll resize', computeSizes);
        $body.off('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', computePositions);
        $targetElement.find('>*').unwrap();
        //mediator.subscribe('mf-expand:animation-ended', function(){ $(window).trigger('resize') });
    }

    function init( pOptions ) {
        if(Modernizr.touch || MF.breakpoint.getActive() == 'mobile' || MF.breakpoint.getActive() == 'tablet') {
            enabledStickyBehaviour = false;
        }

    	options = $.extend(defaultOptions, pOptions);

        $wrapperElement = $(options.targetElement);
        $topElement = $(options.topElement);
        $bottomElement = $(options.bottomElement);
        $wrapperElement.wrapInner('<div></div>');
        $targetElement = $wrapperElement.find('>div');


    	$body = $(document.body);
    	$window = $(window);

        oldTotalTopElementHeights = 0;
        $topElement.each(function(){
            var $this = $(this)
            ,   topElementHeight = $this.height();
            oldTotalTopElementHeights += topElementHeight;
        });

        var currentBreakpoint = MF.breakpoint.getActive();
        if( currentBreakpoint == 'mobile' || currentBreakpoint == 'tablet' ) {
            disableStickyBehaviour();
        }
        Breakpoints.on({ name: 'mobile',        matched: function() { disableStickyBehaviour(); } });
        Breakpoints.on({ name: 'tablet',        matched: function() { disableStickyBehaviour(); } });
        Breakpoints.on({ name: 'desktop',       matched: function() { enableStickyBehaviour(); } });
        Breakpoints.on({ name: 'desktop-large', matched: function() { enableStickyBehaviour(); } });

    	registerEvents();
        computePositions();
        computeSizes();

        initialized = true;

    }

    MF.stickit = (function(){
    	return {
    		init: init,
            unRegisterEvent: unRegisterEvent
    	}
    })()


})(jQuery, window, MF.checkout.mediator);
