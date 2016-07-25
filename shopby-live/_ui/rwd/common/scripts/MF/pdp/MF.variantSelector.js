;(function($, ACC, breakpoint) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        outEvents: {
            variantSelected: "pdp:variant:selected"
        },
        gtyDDContainer: ".data-qtyDD-container",
        variantDDContainer: ".data-variantDD-container",
        productIDContainer: "input#currentProductId"
    };

    MF.variantSelector = function() {

        var options,
            $variantContainer,
            productId,
            $cssdMessageContainer,
            $citesMessageContainer,
            baseProductCode,
            $quantityDropDown = $('#quantityDropDown'),
            $entrySizeVariant = $('#entrySizeVariant');

		var variantDD, qtyDD; //DD stands for drop down

        var onProductVariantDataFetched = function(productData) {
            adjustQtyDD();

            if ( $('#citesLinkContent').exists() ) {
                updateCitesMessage();
            }

            $(options.variantDDContainer, $variantContainer).find('.cs__selected').on('click', 
                function() {
                    handleNoStockForProduct();
                     // Initial Check for All On Click
                    initSoldOutComingSoonMessage();
                });
            setTimeout(handleNoStockForProduct, 1);
        };

        var adjustQtyDD = function(variantData) {
            variantData = variantData || variantDD.getSelectedVariantData();
			qtyDD.render(variantData.stockQuantity);
        };

        var resetWishListButton = function() {
            if ($('.btn--go-to-wishlist').is(':visible')) {
                $('[data-add-to-wishlist]').show();
                $('.btn--go-to-wishlist').hide();
            }
        }

        var handleNoStockForProduct = function () {
            var data = variantDD.getData()
              , variants = data.variantOptions
              , variant
              , i
              , anyAvailable = false
            
            for(i=0; i<variants.length; i++) {
                variant = variants[i];
                if (variant.commingSoon || variant.stock.stockLevelStatus.code == "outOfStock") {
                    
                } else {
                    //we have at least one item available
                    anyAvailable = true;
                }
            }

            if(!anyAvailable) {
                hideAddToBasketButton();
            }
            // Initial Check for All
            updateMessageForAllSoldOut();
            updateMessageForAllComingSoon();
        }

        var hideAddToBasketButton = function() {
            var $addToBasketButton = $variantContainer.find("[data-add-to-basket]");
            $addToBasketButton.hide();
        }

        var onSizeVariantDDChange = function(value) {
            var variantData = variantDD.getSelectedVariantData();

            updateAddToBasketButtonText(variantData);
           
            hideNoProductCodeMessage();

            adjustQtyDD(variantData);

            mediator.publish(defaults.outEvents.variantSelected, variantData);

            syncVariantSelectors(variantData);
            
            resetWishListButton();

            updateSoldOutComingSoonMessage();
          
        };

        var initSoldOutComingSoonMessage = function() {
            // Variation to check 3 states creates a Add sold out / Coming Soon on click
            var productData = variantDD.getData();
            var variants = productData.variantOptions;
           
            if (getSoldOutItems().length > 0 && (getSoldOutItems().length < variants.length && getComingSoonItems().length == 0))  {
                $cssdMessageContainer.text($("#addSoldOut").text());
                updateMessagePlacehoder();
            } else if (getComingSoonItems().length > 0 && (getComingSoonItems().length < variants.length && getSoldOutItems().length == 0)) {
                $cssdMessageContainer.text($("#addComingSoon").text());
                updateMessagePlacehoder();
            } else if (getComingSoonItems().length > 0 && getSoldOutItems().length > 0) {
            	$cssdMessageContainer.text($('#addSoldOutComingSoon').text());
            	updateMessagePlacehoder();
            }
        };    

        var updateSoldOutComingSoonMessage = function() {
            var selectedVariant = variantDD.getSelectedVariantData();

            if (selectedVariant.comingSoon) {
                $cssdMessageContainer.text($("#addComingSoon").text());
                $cssdMessageContainer.show();
            } else if (selectedVariant.dataStock == "outOfStock") {
                $cssdMessageContainer.text($("#addSoldOut").text());
                $cssdMessageContainer.show();
            } else {
                $cssdMessageContainer.hide();
            }
        };

        var updateCitesMessage = function() {
            var cites = $('#citesLinkContent');
            if (cites.exists()) {
                $citesMessageContainer.append(cites.children());
                $citesMessageContainer.addClass("single").show();
            }
        }

        var updateMessageForAllComingSoon = function() {
            var productData = variantDD.getData();
            var variants = productData.variantOptions;

            if (getComingSoonItems().length == variants.length) {
                $cssdMessageContainer.text($("#addComingSoon").text());
                hideAddToBasketButton();
                updateMessagePlacehoder();
            }
        }

        var updateMessageForAllSoldOut = function() {
            var productData = variantDD.getData();
            var variants = productData.variantOptions;
    
            if (getSoldOutItems().length == variants.length) {

               $cssdMessageContainer.text($("#addSoldOut").text());
               hideAddToBasketButton();
               updateMessagePlacehoder();

            }
        }

        var updateMessagePlacehoder = function() {
            var $messagePlaceHolder = $('#addCSSDMessage');
            var cites = $('#citesLinkContent');

            var $addToBag = $('#addToCartButton').is(':visible'),
                $contactUs = $('#contactUsButton').is(':visible'),
                $shopTheLook = $('.btn--shop-the-look').is(':visible'),
                $shopTheLookHidden = $('.btn--shop-the-look').is(':hidden'),
                $addToWishlistButton = $('.btn--add-to-wishlist'),
                $addToWishlist = $('.btn--add-to-wishlist').is(':visible');

                if ($('#shopTheLook').not(':visible')) {

                    $('#addCSSDMessage').removeClass("single");
                 }

                //Resets
                $messagePlaceHolder.removeAttr('style');
                $('#addCSSDMessage').removeClass("single");
                $addToWishlistButton.removeClass('wishlist__left');

                $cssdMessageContainer.show();

                if (MF.breakpoint.getActive() == 'mobile') {
                    $messagePlaceHolder.addClass("single");
                    if (cites.exists()) {
                         $messagePlaceHolder.css({'margin-top':'10px'})
                    }
                } else {
                    if ( ( $addToBag || $contactUs ) && $shopTheLookHidden ) {
                        $messagePlaceHolder.addClass("single");
                    } else if ( $addToWishlist  &&  ( $addToBag || $contactUs ) &&  $shopTheLook ) { 
                        $('#addCSSDMessage').removeClass("single");
                    } else if ( $addToWishlist && ( $addToBag || $contactUs ) ) {
                        $messagePlaceHolder.addClass("single");
                    } else if ( $addToWishlist && $shopTheLook ) {
                        $messagePlaceHolder.addClass("single");
                        $messagePlaceHolder.css({'margin-bottom': '15px'});
                         if (cites.exists()) {
                            $messagePlaceHolder.css({'margin-top':'10px'})
                         }
                    } else {
                        $messagePlaceHolder.removeClass("single");
                        $addToWishlistButton.addClass('wishlist__left');
                        $messagePlaceHolder.css({'margin-top': '30px'});

                    }
                }

            }

        var updateAddToBasketButtonText = function(variantData) {

			var $addToBasketButton = $variantContainer.find("[data-add-to-basket]");
            var $placeHolder = $('.stl__placeholder__text');

            var comingSoonText = $("#productComingSoon").text();
            var outOfStockText = $("#variantsOutOfStock").text();
            var addToBasketText = $("#basketAddToBasket").text();

            var $outMessage = $(".pdp__add__sold-out", $variantContainer);
            var $wishlist = $(".btn--add-to-wishlist", $variantContainer);

            if (variantData.dataStock == "inStock" || typeof variantData.dataStock == 'undefined') {
                $addToBasketButton.removeAttr("disabled").show().text(addToBasketText).siblings($placeHolder).hide();
                updateMessagePlacehoder();
            } else {
                
                variantData.comingSoon ? $addToBasketButton.attr("disabled", "disabled").hide().siblings($placeHolder).show().text(comingSoonText) :
                
                $addToBasketButton.attr("disabled", "disabled").hide().siblings($placeHolder).show().text(outOfStockText);
                updateMessagePlacehoder();
            }
        };

        var syncVariantSelectors = function(variantData) {
            variantData = variantData || variantDD.getSelectedVariantData();
            mediator.publish("pdp:variant:sync:" + baseProductCode, variantData);
        };

        var getQty = function() {
            return qtyDD.getQty();
        };

		var selectVariantBySize = function(size) {
			return variantDD.selectVariantBySize(size);
		};

        var getProductCode = function() {
            return variantDD.getSelectedVariantData().productCode;
        };

        var printMessage = function($template, $messageContainer) {
            if ($template) {
                var message = $template.text();
                $messageContainer.text(message);
            }
        };

        var getSoldOutItems = function() {
            return variantDD.getSelect().find("[data-stock='outOfStock']").not("[data-comingsoon='true']");
        };

        var getComingSoonItems = function() {
            return variantDD.getSelect().find("[data-comingsoon='true']");
        };

        var hideNoProductCodeMessage = function() {
            $("[data-mf-select-error]", $variantContainer).empty();
        };

        var notifyNoProductCode = function() {
            $("[data-mf-select-error]", $variantContainer).empty().text($("#pleaseSelectSize").text());
        };

        var onProductVariantSync = function(variantData) {
            var selectedVariantData = variantDD.getSelectedVariantData();

            if(selectedVariantData.productCode !== variantData.productCode) {
				variantDD.selectVariantBySize(variantData.sizeCode);
            }
        };

		var initObjects = function() {
			$cssdMessageContainer = $("#addCSSDMessage");
			$citesMessageContainer = $("#addCitesMessage");

			variantDD = MF.variantDropDown();
			qtyDD = MF.qtyDropDown();

			variantDD.init({
				container: $(options.variantDDContainer, $variantContainer)
			});

			qtyDD.init({
				container: $(options.gtyDDContainer, $variantContainer),
				elementId: "entrySizeVariant"
			});

			productId = $(options.productIDContainer, $variantContainer).val();
		};

        var init = function(_$variantContainer, opts) {
            options = $.extend({}, defaults, opts);

			$variantContainer = _$variantContainer;

            if ($variantContainer.exists()) {
				initObjects();

				variantDD.callbacks.onDataFetched.add(onProductVariantDataFetched);
				variantDD.callbacks.onChange.add(onSizeVariantDDChange);

				baseProductCode = $("#currentProductId", $variantContainer).val();
				mediator.subscribe("pdp:variant:sync:" + baseProductCode, onProductVariantSync);

				variantDD.loadVariants(productId);
            }
        };

        var init_shop_the_look = function(_$variantContainer, opts) {
            options = $.extend({}, defaults, opts);

            $variantContainer = _$variantContainer;

            if ($variantContainer.exists()) {
                initObjects();

                variantDD.callbacks.onDataFetched.add(onProductVariantDataFetched);
                variantDD.callbacks.onChange.add(onSizeVariantDDChange);

                baseProductCode = $("#currentProductId", $variantContainer).val();
                mediator.subscribe("pdp:variant:sync:" + baseProductCode, onProductVariantSync);

                var options2 = 'shop_the_look';

                variantDD.loadVariants(productId, options2);
            }
        };

        return {
            init: init,
            init_shop_the_look: init_shop_the_look,
            getQty: getQty,
            getProductCode: getProductCode,
            selectVariantBySize: selectVariantBySize,
            syncVariantSelectors: syncVariantSelectors,
            notifyNoProductCode: notifyNoProductCode
        };
    };

    window.MF = MF;

}(jQuery, ACC, MF.breakpoint));
