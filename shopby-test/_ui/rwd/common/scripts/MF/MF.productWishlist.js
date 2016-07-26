;(function($, window, document, mediator) {
    'use strict';

    var MF = window.MF || {};

    MF.productWishlist = (function() {

        var shouldAddProductToWishlist = false;
        var wishlistRolloverTemplate,
            $wishlistRolloverContainer,
            $addToWishlistBtn,
            currentText,
            currentProductData,
            $currentProduct;

        var options = {
            url: {
                addProductToWishList: "/ajax/wishlist/add",
                isIncluded: "/ajax/wishlist/is/included",
            },
            inEvents: {
                userLoggedIn: "user:logged:in",
                variantSelected: "pdp:variant:selected"
            },
            outEvents: {
                attemptToAddProductToWishlistAnonymously: "wishlist:attempt:add:anonymously",
            }
        };

        var init = function(container) {
            initElements();

            var $container = (container ? container : "body");

            $(document).ready(function() {
                $("a.btn--add-to-wishlist", $container).on("click", handleAttemptToAddProduct);
                mediator.subscribe(options.inEvents.variantSelected, handleVariantSelection);
                mediator.subscribe(options.inEvents.userLoggedIn, addProductToWishListAfterLogin);
                
                if (typeof $.cookie('selectedVariantCode') != 'undefined' ) {
                    checkIfIncludedInWishlist();
                    
                    showPopupOnAddProductToWishlist();

                    postSelectedVariantCode();

                }

            });
        };

        var initElements = function() {

            var template = $("#wishlistRolloverTemplate");

            if(template.exists()) {
                wishlistRolloverTemplate = Handlebars.compile( $.trim(template.html()) );
                $wishlistRolloverContainer =  $(".wishlist-rollover-wrapper");
                $addToWishlistBtn = $("[data-add-to-wishlist]");
                currentText = $addToWishlistBtn.html();
            }

        };

        var handleAttemptToAddProduct = function(e) {
            e.preventDefault();
            $currentProduct = $(this).closest("[data-product]");
            currentProductData =  $(this).data('product-data')
            if(getSelectedVariantCode()) {
                if($.cookie('loggedIn') === 'false') {
                    publishAddProductAnonymously(e);
                } else {
                   addProductToWishlist();
                }
            } else {
               showEmptyVariantMessage();
            }
        };

        var addProductToWishlist = function() {
           if(getSelectedVariantCode()){
              return postSelectedVariantCode();
           } else {
              showEmptyVariantMessage();
           }
        };

        var isReadyToPublish = function() {
            return shouldAddProductToWishlist && getSelectedVariantCode();
        };

        var addProductToWishListAfterLogin = function() {
            if(isReadyToPublish()) {
                shouldAddProductToWishlist = false;
                return postSelectedVariantCode();
            }
        };

        var showPopup = function() {

            var productData = $addToWishlistBtn.data("product-data");
            var popUpTemplate = wishlistRolloverTemplate(currentProductData);
            $wishlistRolloverContainer.html(popUpTemplate);

            $wishlistRolloverContainer.show();
        };

        var hidePopup = function() {  
            $wishlistRolloverContainer.hide();
        };

        var showButtonOverlay = function() {
            $addToWishlistBtn = $("[data-add-to-wishlist]");
            $addToWishlistBtn.text($addToWishlistBtn.data("overlay-message"));
        };

        var hideButtonOverlay = function() {
            $addToWishlistBtn = $("[data-add-to-wishlist]");
            $addToWishlistBtn.text(currentText);
        };

        var showPopupOnAddProductToWishlist = function() {

            var stickyOffset,
                $stickyWishlist;

            var closePopup = function() {

                var $variantContainer = $(".pdp__main-wrapper");
                var $addedToWishListButton = $variantContainer.find('.btn--go-to-wishlist');
                var addToBasketButtonWrapperClass = $variantContainer.find(".pdp__add").hasClass('no-shop-the-look');
                var testAddtoCart = $('#addToCartButton').is(':visible');

                hidePopup();
                hideButtonOverlay();
                hideAddToWishlistButton();
                showGoToWishlistButton();

                if(addToBasketButtonWrapperClass && testAddtoCart == false) {$addedToWishListButton.css({'float':'left'});}
            };

            showButtonOverlay();
            showPopup();

            if ($(".sticky__wishlist").is(":visible")) {
                $stickyWishlist = $(".sticky__wishlist");
                stickyOffset = $stickyWishlist.offset();
                stickyOffset.top += $stickyWishlist.height() + 25;
                $(".wishlist-rollover-wrapper").offset(stickyOffset);
                $(window).one("scroll", function() {
                    closePopup();
                    return;
                });
            }

            _.delay(function() {
                closePopup();
            }, 3000);
        };

        var postSelectedVariantCode = function() {
            var selectedVariantCode;

            if ( $.cookie('selectedVariantCode') != undefined ) {
                selectedVariantCode = $.cookie('selectedVariantCode');
                $.removeCookie('selectedVariantCode');
            } else {
                selectedVariantCode = getSelectedVariantCode();
            }
           

          return $.post(options.url.addProductToWishList, { "productCode" : selectedVariantCode})
              .then(function(result) {
                  if (result.status === "SUCCESS") {
                        hideEmptyVariantMessage();
                        showPopupOnAddProductToWishlist();
                    }
          }).fail(function() {
                  handleUnableToAddProductToWishlist(selectedVariantCode);
              });
        };

        var getSelectedVariantCode = function() {
            var $currentVariant = $("select#entrySizeVariant", $currentProduct);
            var selectedProductCode = $currentVariant.val();
            var defaultProductCode = $("a.btn--add-to-wishlist", $currentProduct).data("code");

            if (selectedProductCode) {
                return selectedProductCode;
            } else if (!$currentVariant.is(":visible")) {
                return defaultProductCode
            }

            return;
        };

        var hideAddToWishlistButton = function() {
            $("a.btn--add-to-wishlist", $currentProduct).hide();
        };

        var showAddToWishlistButton = function() {
            $("a.btn--add-to-wishlist", $currentProduct).show();
        };

        var hideGoToWishlistButton = function() {
           $("a.btn--go-to-wishlist", $currentProduct).hide();
        };

        var showGoToWishlistButton = function() {
            $("a.btn--go-to-wishlist", $currentProduct).show();

        };

        var isAnonymous = function() {
           return $("a.btn--add-to-wishlist", $currentProduct).attr("data-isAnonymous") === "true";
        };

        var publishAddProductAnonymously = function(e) {

            shouldAddProductToWishlist = true;
            var selectedProductData = getSelectedVariantCode();
        
            if ($.cookie('loggedIn') == 'false') 
            $.cookie('selectedVariantCode', selectedProductData.toString(), { expires: 7 });

            mediator.publish(options.outEvents.attemptToAddProductToWishlistAnonymously);
        };

        var handleVariantSelection = function() {
            if(getSelectedVariantCode()) {
                hideEmptyVariantMessage();
                checkIfIncludedInWishlist();
            } else {
              showEmptyVariantMessage();
            }
        };

        var hideEmptyVariantMessage = function() {
           $($currentProduct).find("[data-mf-select-error]").empty();
        };

        var showEmptyVariantMessage = function() {
            $($currentProduct).find("[data-mf-select-error]").empty().text($("#pleaseSelectSize").text());
        };

        var checkIfIncludedInWishlist = function() {
        
        var selectedVariantCode = getSelectedVariantCode();
        
            $.post(options.url.isIncluded, { "productCode" : selectedVariantCode})
              .then(function(result) {
                  if(result.status === "SUCCESS") {
                      handleButtonsVisibility(result.data.included);
                  } else {
                      handleUnableToDetectProductInclusion(selectedVariantCode);
                      handleButtonsVisibility(false);
                  }
              }).fail(function() {
                handleUnableToDetectProductInclusion(selectedVariantCode);
                handleButtonsVisibility(false);
              });
        };

        var handleButtonsVisibility = function(included) {
            if(included) {
                hideAddToWishlistButton();
                showGoToWishlistButton();
            } else {
                hideGoToWishlistButton();
                showAddToWishlistButton();
            }
        };

        var handleUnableToAddProductToWishlist = function(selectedVariantCode) {

        };

        var handleUnableToDetectProductInclusion = function(selectedVariantCode) {

        };


        return {
            init : init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.product.mediator));


if ($('.page-productDetails').length) MF.productWishlist.init();