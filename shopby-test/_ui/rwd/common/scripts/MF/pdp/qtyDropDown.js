;(function($) {
	"use strict";

	var MF = window.MF || {};

	var defaultOptions = {
		container: document,
		selectElement: "[data-mf-select]",
		$quantityDropDown : $('#quantityDropDown'),
		maxQty: 1
	};



	MF.qtyDropDown = function() {

		var options;

		var $container, $select;

		var variantQuantityOptionsTemplate;

		var renderVariantQtyDD = function(stockLevel) {

		    if (stockLevel == 0) {
		        stockLevel = 1;
		    } else if (stockLevel > 0 ) {
		        stockLevel = stockLevel || options.maxQty;
		        $('#quantityDropDown').css({'pointer-events':'auto'});
		    } else {
		    	$('#quantityDropDown').css({'pointer-events':'none'});
		    }

			var upperValue = Math.min(stockLevel, 10) + 1;
			var qtyRange = stockLevel > 0 ? _.range(1, upperValue) : [ 1 ];

			$container.html(variantQuantityOptionsTemplate(qtyRange));
			$select = $(options.selectElement, $container);


			MF.select.init({
				contextId: $container
			});
		};

		var getQty = function() {
			return $select.val();

		};

		var initObjects = function() {
			variantQuantityOptionsTemplate = Handlebars.compile($("#variantQuantityOptionsTemplate").html());

			$('#quantityDropDown').css({'pointer-events':'none'});

			$container = $(options.container);
			$select = $(options.selectElement, $container);
		};

		var init = function(opts) {
			options = $.extend({}, defaultOptions, opts);

			initObjects();

		};

		return {
			init: init,
			render: renderVariantQtyDD,
			getQty: getQty
		};
	};

	window.MF = MF;

}(jQuery));
