/*
 * Requires:
 *  jquery.magnific-popup.js
 */

// Overlay generator
//
// Usage:
// Lets assume we want to display as an overlay the element with the class "test-overlay"
//
// 1. The way to hide the element is by adding the .mfp-hide class to it (this is magnific-popup implementation)
//
// 2. Call the following JS function (this uses the magnific-popup plugin via MF.overlay)
//
//    MF.overlay.openWithElement({
//        element: $( '.test-overlay' )
//    })
//
//    The element will be wrapped in .mfp (magnific-popup) namespaced element, the topmost
//    element being .mfp-wrap. If you want a custom class added to this element you must
//    pass the mainClass property to the paramter as well.
//
// 3. Now to style it you have to create an overlay depending on how many columns it has
//    to span. Go to the _overlay-definitions.scss file and check if the wanted overlay is
//    already there.
//    If it is then just use it (i.e. jump to step 3)
//    If it isn't then create a new one. The syntax is:
//    
//    @include create-overlay (overlay-name, desktop-columns[ wide], desktop-padding[ wide], tablet-columns[ wide], tablet-padding[ wide]);
//
//    As a convention ideally the overlay name should reflect how many columns it uses on desktop layout
//        (eg: desktop-20-wide)
//
//    Example:
// *  @include create-overlay (desktop-20-wide, 20 wide, 1 wide, 20, 1);
//
// 4. Attach the styling to the element
//
//    .test-overlay {
// *       @include extend-overlay (desktop-20-wide);
//     }
// 
// 5. HTML markup that needs to be used:
//        <div class="test-overlay mf-overlay mfp-hide">
//            <!-- note that the header is wrapped in <class_chosen_by_you>__header -->
//            <div class="test-overlay__header"><h2><span> <!-- Title goes here --> </span></h2></div>
//
//            <!-- Your HTML goes here -->
//        </div>


;(function ($, window, document) {
    "use strict";

    var MF = window.MF = window.MF || {};

    var defaultOptions = {
        closeMarkup: '<a title="%title%" type="button" class="mfp-close"></a>',
        type: "inline",
        callbacks: {
            close: function() {
                // We add a callback which is used for Geo IP popups only
                if ( $.isFunction(MF.geoip.is_geo_ip_popup_activated) ){
                    if ( MF.geoip.is_geo_ip_popup_activated() === true ){
                        if ( $.isFunction(MF.custom.bindOverlay) ){
                            MF.geoip.remove_geo_ip_popup();
                            setTimeout(MF.custom.bindOverlay, 3000);
                            MF.geoip.set_geo_ip_activated_to_false();
                        }
                    }
                }
            }
        }
    };

    MF.overlay = (function () {

        /*
            A standard way to show overlay with options 'opts' which are accepted by original 'magnificPopup' plugin
         */
        function open(opts) {
            var magnificData = $.extend({}, defaultOptions, opts);

            $.magnificPopup.open(magnificData);
        }

        /*
            Opening overlay with an quick option to specify overlay element directly in data argument
         */
    	function openWithElement(data) {
            $.extend(data, {
                items: {
                    src: $( data.element )
                }
            });

            open(data);
        }


        // To link opening a popup directly to an <a> element
		/*
		$('.open-popup-link').magnificPopup({
		  type:'inline',
		  midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
		  mainClass: 'checkout-overlay-wrap'
		}).click();
		*/

        function close() {
            $.magnificPopup.close();
        }

    	return {
    		openWithElement: openWithElement,
            open: open,
            close: close
    	}
    })()
})(jQuery, this, this.document);
