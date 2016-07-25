/*
 *  require
 *  MF.minicart.refreshMiniCartCount
 *  MF.track.trackAddToCart
 *  MF.common.setHeaderDynamics
 *  MF.productDetail.loadProductDynamicData
 *  MF.checkout.mediator
 */

;(function ($, window, document, mediator, mfMediator, variantSelector, addToBagForm, contactUsForm) {
  'use strict';

  var MF = window.MF || {};

  MF.product = (function () {

    var defaults = {
        outEvents : {
            variantSelected : "pdp:variant:selected"
        }
    };

    var mediator = new Mediator();
    var contactUsForm = MF.contactUsForm();

    mediator.subscribe("pdp:addtowishlist:submit", function() {
        var product = arguments[0],
            $sizeSelectDDContainer = arguments[1];

        // validate the drowdown please
        var $form = $("#addToWishlistForm");

        var $productCodePost = $("input[name='productCodePost']", $form);

        if (product.productCodePost) {
            $productCodePost.val(product.productCodePost);
            window.location = $form.attr("action") + "?" + $form.serialize();
        }
    });

    function initQuickviewLightbox() {
      bindToAddToCartForm();
    }

    function enableStorePickupButton() {
      $('.pickupInStoreButton').removeAttr("disabled");
    }

    function bindToAddToCartForm() {
      var addToCartForm = $('.add_to_cart_form');

      addToCartForm.ajaxForm({
          beforeSubmit: validateAddToBasketForm,
          success: displayAddToCartPopup
      });
    }

    function bindToAddToCartStorePickUpForm() {
      var addToCartStorePickUpForm = $('#pickup_store_results .add_to_cart_storepickup_form');
      addToCartStorePickUpForm.ajaxForm({
        success: displayAddToCartPopup
      });
    }

    function displayAddToCartPopup(cartResult, statusText, xhr, formElement) {
      $('#addToCartLayer').remove();

      if (typeof MF.minicart.refreshMiniCartCount == 'function') {
        MF.minicart.refreshMiniCartCount();
      }

      $("#header").append(cartResult.addToCartLayer);

      $('#addToCartLayer').fadeIn(function() {
        $.colorbox.close();
        if (typeof defaults.timeoutId != 'undefined') {
          clearTimeout(defaults.timeoutId);
        }
        defaults.timeoutId = setTimeout(function () {
          $('#addToCartLayer').fadeOut(function() {
             $('#addToCartLayer').remove();
          });
        }, 5000);

      });

      var productCode = $('[name=productCodePost]', formElement).val();
      var quantityField = $('[name=qty]', formElement).val();

      var quantity = 1;
      if (quantityField != undefined) {
        quantity = quantityField;
      }

      MF.track.trackAddToCart(productCode, quantity, cartResult.cartData);
      MF.common.setHeaderDynamics();

      var productId = $("input#currentProductId").val();
      var selectedVariantOption = $('select#' + productId + '-variants').val();
      MF.productDetail.loadProductDynamicData($("#variantDropDown"), selectedVariantOption);
    }

    function validateAddToBasketForm() {
        var $form = $("#addToCartForm"),
            productCodePost = $('input[name="productCodePost"]', $form).val();

        return Boolean(productCodePost);
    }



    mfMediator.subscribe('carousel:empty', function(data){
        var id = data.carousel.closest('.tabber-tab').attr('id');
        var link = data.carousel.closest('.tabber').find('a[href="#' + id + '"]');
        //disable current tab
        link
          .addClass('disabled')
          .on('click', function(){return false})
        //try clicking on the next tab
        var nextLink = link.closest('.tabs')
          .find('a:not(.disabled):eq(0)')
        if(nextLink.length > 0) {
            //if there is a next tab click it
            if( !nextLink.data('already-clicked') ) {
              nextLink.click();
              nextLink.data('already-clicked', true);
            }
        }
    })

    function initYourMatchesTabs() {

        var $pdpMatches = $('.pdp-your-matches');
        var productId = $("input#currentProductId").val();
        $('#yourMatchesTabs').tabber({
            whenTabChanged: function (i) {
                i === 0 && MF.carousel.init({ elId: '#matchItWith', isYourMatches: true });
                i === 1 && $('[data-mfcarousel]').resize();
                i === 2 && MF.carousel.init({ elId: '#matchesRecommendsProducts', isYourMatches: true });
              }
        }).find('.tabber-menu a.disabled').click(function(){
            //prevent disabled tabs to be triggered
            return false;
        });
    }

      function showContactUsThankYou() {
          $(".thank-you-message").show();
          $(".contact-form").hide();
      }

      function hideContactUsThankYou() {
          $(".thank-you-message").hide();
          $(".contact-form").show();
      }

      function errorContactUS() {
          showContactUsThankYou();
          console.log("Error submitting contact us form");
      }

      function initContactUsForm() {
          contactUsForm.init({selectors: {form: "#contactSfForm"}});
          hideContactUsThankYou();

          contactUsForm.getForm().ajaxForm({
              // type: "POST",
              dataType: "jsonp",
              success: function() {
                  showContactUsThankYou();
              },
              error: errorContactUS,
              beforeSubmit: function() {
                  return contactUsForm.getValidator().form();
              }
          });

        }

        function initCurrncyPopUp() {

          $('.pdp-billing-icn').on('click', function(event) {
            event.preventDefault();
             MF.overlay.openWithElement({
                      element: $('.pdp__currency__overlay'),
                      callbacks: {
                          open: function() {
                              // Refactor
                      }
                  }
              });
          });


        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function bindOutfitClick() {
            $('[data-outfit-code]').on('click', function(event) {
            event.preventDefault();

            var currentOutfit =  $(this).data('outfit-code');
            var productCode = $('input[name="baseProductCode"]').val();
            if (currentOutfit != '') {
              var urlOutfit = '/ajax/outfitproducts/'+productCode+'/'+currentOutfit;
              $('#matchItWith').data('ajax', urlOutfit);
              MF.carousel.init({ elId: '#matchItWith', isYourMatches: 'true' });
            }

          });
        }

      var init = function() {
          var selector = variantSelector();
          var addToBag = addToBagForm();

          selector.init($(".pdp__main-wrapper"));
          addToBag.init($("[data-cart-form='true']", ".pdp__main-wrapper"), selector);

          initCurrncyPopUp();
          bindOutfitClick();
      };


    return {
        init: init,
        bindToAddToCartStorePickUpForm: bindToAddToCartStorePickUpForm,
        enableStorePickupButton: enableStorePickupButton,
        initQuickviewLightbox: initQuickviewLightbox,
        initYourMatchesTabs: initYourMatchesTabs,
        mediator: mediator,
        initContactUsForm:initContactUsForm
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document, mediator, MF.checkout.mediator, MF.variantSelector, MF.addToBagForm, MF.contactUsForm));

MF.product.init();
MF.product.bindToAddToCartStorePickUpForm();
MF.product.enableStorePickupButton();
MF.product.initYourMatchesTabs();
MF.product.initContactUsForm();
