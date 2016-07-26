;(function($, document, spinnerHandler) {
	"use strict";

	var MF = window.MF || {};

	var defaultOptions = {
		selectors: {
			container: document,
			button: "#addToCartButton"
		}
	};

	MF.addToBagButton = function(opts) {

		var options = $.extend(true, {}, defaultOptions, opts);

		var $container = $(options.selectors.container);
		var $button = $(options.selectors.button, $container);

		var enable = function() {
			return spinnerHandler.hideSpinner($button);
		};

		var disable = function() {
			return spinnerHandler.showSpinner($button);
		};

		var showOverlayMessage = function() {
			var currentText = $button.filter(':eq(0)').text();
			$button.text($button.data("overlaymessage"));
			
			_.delay(function() {
				$button.text(currentText);	
			}, 3000);
		};

		var showErrorMessage = function() {
			var currentText = $button.filter(':eq(0)').text();
			// Temp placeholder message for generic Error
			$button.text('Out Of Stock');
		}

		return {
			enable: enable,
			disable: disable,
			showOverlayMessage: showOverlayMessage,
			showErrorMessage: showErrorMessage
		};
	};

	window.MF = MF;

}(jQuery, window.document, MF.spinnerHandler));
