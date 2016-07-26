/*
 * Requires:
 *  MF.overlay
 */

;(function ($, window, document) {
    'use strict';
    var MF = window.MF = window.MF || {};
    MF.checkoutHelpLinks = (function () {
    	var $container;
    	function init() {
    		$container = $('.helper__icons');

    		$('.open-popup-link').click(function(){
                
                // MF.overlay.openWithElement({
                //     element: $( $(this).attr('data-mfp-src') )
                // })

    			return false;
    		}).click();


            var $dropdown = $('.footer-page-popup__aside--mobile select');
            $dropdown.change(function(){
                console.log('Clicked', $(this).val() )
            })
            MF.select.init({contextId: '.footer-page-popup__aside--mobile'});

    		/*
			$('.open-popup-link').magnificPopup({
			  type:'inline',
			  midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
			  mainClass: 'checkout-overlay-wrap'
			}).click();
			*/


    	}

    	return {
    		init: init
    	}
    })()
})(jQuery, this, this.document);

MF.checkoutHelpLinks.init();
