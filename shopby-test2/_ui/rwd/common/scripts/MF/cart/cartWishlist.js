;(function($, window, document, mediator) {
    'use strict';

    var MF = window.MF || {};

    MF.cartWishlist = (function() {

        var defaultOptions = {
            url: {
                addProductToWishList: "/ajax/wishlist/add",
                isIncluded: "/ajax/wishlist/is/included"
            },
            inEvents: {
                userLoggedIn: "user:logged:in",
            },
            outEvents: {
                attemptToAddProductToWishlistAnonymously: "wishlist:attempt:add:anonymously"
            },
            $item : $(".items-list-row__add-wishlist[data-ajax-hook='true']")
        };

        var addToWishlistLink,
            wishlistRolloverTemplate,
            $wishlistRolloverContainer;

        var initPopUpElements = function() {

            var template = $("#wishlistRolloverTemplate");

            if(template.exists()) {
                wishlistRolloverTemplate = Handlebars.compile(template.html());
                $wishlistRolloverContainer =  $(".wishlist-rollover-wrapper");
            }

        };
        var fadeLinkItems = function(){
             defaultOptions.$item.off('click.wishlist').on('click.wishlist', function(){
                return false;
            });
        };

        var showPopup = function(productData) {
            if ($('.items-list-row__add-wishlist').data('isanonymous') == false) {
                $wishlistRolloverContainer.html(wishlistRolloverTemplate(productData));
                $wishlistRolloverContainer.prepend('<div class="wishlist-rollover-wrapper__headline">Added to wishlist</div>');

                $wishlistRolloverContainer.fadeIn(200, function(){
                   fadeLinkItems();
                }).delay(5000).fadeOut(200, function(){
                    $(this).empty();
                    defaultOptions.$item.fadeTo(50 ,1);
                    init();
                });
        }
            
        };

        var listOfHandeledProductCodes = [];
        var handleVisibility = function(link) {

            var productCode = link.attr("data-code");
            var linkMessage = link.attr("data-text-message");

            //don't process the same productCode twice
            if(listOfHandeledProductCodes.indexOf(productCode) !== -1) {
                return;
            }
            listOfHandeledProductCodes.push(productCode);
           
            $.post(defaultOptions.url.isIncluded, { "productCode" : productCode})
                .then(function(result) {

                    var linkObj = $("[data-code='" + productCode + "']");

                	var included = result.status === "SUCCESS" && result.data.included;

                	$.each(linkObj ,function(index, value){
                		 var insufficientStock = $(this).data("stock") < $(this).data("qty");
                         if(!included && insufficientStock) {
                        	 $(this).show();
                         } else if (result.data.included == true) {

                            $(value).text(linkMessage).off('click.wishlist').on('click', function(){location.pathname = '/account/wishlist';})
                         }
                	});
               });
        };

        var handleAttemptToAddProductToWishlist = function(link) {
            var productData = link.data("product-data");

            if($.cookie('loggedIn') === 'false') {
                addToWishlistLink = link;
                mediator.publish(defaultOptions.outEvents.attemptToAddProductToWishlistAnonymously);
                $.cookie('selectedVariantCode', link.data("code"), { expires: 7 });
            } else { 
                addProductToWishList(link);
                showPopup(productData);
            }
        };

        var addProductToWishList = function(link) {
            var productCode = link.attr("data-code");
            var linkMessage = link.attr("data-text-message");

            $.post(defaultOptions.url.addProductToWishList, { "productCode" : productCode})
                .then(function(result) {
                    if(result.status === "SUCCESS") {
                        link.text(linkMessage).off('click').on('click', function(){location.pathname = '/account/wishlist';});
                    }
                }
            );
        };

        var addProductToWishListAfterLogin = function() {
             if(addToWishlistLink) {
                addProductToWishList(addToWishlistLink);
                addToWishlistLink = undefined;
             }
        };

        var initBulkActionSelect = function() {
            var selected = $(".wishlistItem:checked").size() > 0;
            var bulkActionSelect = $("#wishlistBulkActions");
            if(selected) {
                MF.select.enable(bulkActionSelect);
                bulkActionSelect.prop('selectedIndex',0).change();
            } else {
                MF.select.disable(bulkActionSelect);
            }
        };

        var init = function() {

            defaultOptions.$item = $("[data-ajax-hook='true']");
            if ($.cookie('loggedIn') == 'true') {
                defaultOptions.$item.each(function() {handleVisibility($(this));});
            }

            defaultOptions.$item.each(function() {
                var link = $(this);
                link.on("click.wishlist", function(ev) {
                    ev.preventDefault();
                    handleAttemptToAddProductToWishlist(link);
                    defaultOptions.$item.fadeTo(50, 0.6);

                });
            });

            mediator.subscribe(defaultOptions.inEvents.userLoggedIn, addProductToWishListAfterLogin);

            initPopUpElements();

            initBulkActionSelect();
            
            if (typeof $.cookie('selectedVariantCode') != 'undefined') {
                    // $selectorEl replaces link
                    var $selectorEl = $('[data-code = '+$.cookie('selectedVariantCode')+']');
                    handleAttemptToAddProductToWishlist($selectorEl);
                    $.removeCookie('selectedVariantCode');
                }
        };

        return {
            init : init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.product.mediator));


if ($('.page-cart').length) MF.cartWishlist.init();
