;(function($, document, ACC) {
	"use strict";

	var MF = window.MF || {};

	var fetchProductData = function fetchData(productId, options) {
		return fetchData[productId] || (fetchData[productId] = MF.pdpFetchData.getData(productId, options) )
	};
	var defaultOptions = {
		selectedValue: null,
		container: document,
		selectElement: "[data-mf-select]",
		elementId: "entrySizeVariant",
		elementName: "entrySizeVariant",
		variantDDTemplate: "#sizeVariantDDTemplate"
	};

	MF.variantDropDown = function() {

		var options = {};

		var $container;
		var $select;
		var $variantDDTemplate;
		var privateData;

		var callbacks = {
			onChange: $.Callbacks("unique stopOnFalse"),
			onDataFetched: $.Callbacks("unique stopOnFalse")
		};

		var initObjects = function() {
			$container = $(options.container);
			$select = $(options.selectElement, $container);
			$variantDDTemplate = $(options.variantDDTemplate);
		};

		var productHasVariants = function(data) {
			return data && !_.isEmpty(data.variantOptions);
		};

		var getData = function() {
			return privateData;
		}

		var onVariantDataFetched = function(data) {
			privateData = data;
			if (productHasVariants(data)) {
				renderProductVariants({
					sizeVariantDDId: options.elementId,
					sizeVariantDDName: options.elementName,
					product: data,
					selectedValue: options.selectedValue,
					oneSizeLabel: ACC.productSingleSizeLabel,
					soldOutLabel: ACC.soldOutLabel,
					comingSoonLabel: ACC.comingSoonLabel
				});

				callbacks.onDataFetched.fire(data);

				if (data.variantOptions.length == 1) {
					updateAddToBagButton(data);
				}
			}
		};

		var updateAddToBagButton = function(product) {
			var $variantContainer = $(".pdp__main-wrapper");
			var $addToBasketButton = $variantContainer.find("[data-add-to-basket]");
			var $addToWishListButton = $variantContainer.find("[data-add-to-wishlist]");
			var addToBasketButtonWrapperClass = $variantContainer.find(".pdp__add").hasClass('no-shop-the-look');

			if (product.stock.stockLevelStatus.code == "inStock") {
				$addToBasketButton.removeAttr("disabled");
			} else {

				if(addToBasketButtonWrapperClass) {

					$addToWishListButton.addClass('wishlist__left');
					$('.pdp__add').css({'display': 'none'});

					if (MF.breakpoint.getActive() == 'mobile') {

						$('#addCSSDMessage').addClass("single");

					} else {

						$('#addCSSDMessage').removeClass("single");
					}

				}

				if ($('#shopTheLook').is(':visible')) {

					$addToBasketButton.removeAttr("disabled");

				} else {
					$addToBasketButton.attr("disabled", "disabled");
				}

			}
		};

		var renderProductVariants = function(renderOptions) {
			var sizeOptionsDD = $.tmpl($variantDDTemplate, renderOptions);

			$container.empty().html(sizeOptionsDD);

			MF.select.init({
				callback: function(value) {
					callbacks.onChange.fireWith(this, [ value ]);
				},
				contextId: $container
			});

			// Reinit select element
			$select = $(options.selectElement, $container)
		};

		var getSelect = function() {
			return $select;
		};

		var getSelectedVariantData = function() {
			var selectedValue = $select.val();
			var selectedOption = $select.find("option[value='" + selectedValue + "']");

			return {
				"productCode": selectedValue,
				"dataStock": selectedOption.data("stock"),
				"sizeCode": selectedOption.data("size-code"),
				"comingSoon": selectedOption.data("comingsoon"),
				"stockQuantity": selectedOption.data("stockqty")
			};
		};

		var selectVariantBySize = function(size) {
			$select.find("[data-size-code='" + size + "']").prop("selected", true);
			MF.select.refresh($container);
		};

		var loadVariants = function(productId, options) {
			fetchProductData(productId, options).then(onVariantDataFetched);
		};

		var init = function(opts) {
			options = $.extend({}, defaultOptions, opts);

			initObjects();
		};

		return {
			init: init,
			loadVariants: loadVariants,
			selectVariantBySize: selectVariantBySize,
			getSelectedVariantData: getSelectedVariantData,
			getSelect: getSelect,
			callbacks: callbacks,
			fetchProductData : fetchProductData,
			getData: getData
		};
	};

	window.MF = MF;

}(jQuery, this.document, ACC));
