/*
 *  require 
 *  MF.product.bindToAddToCartStorePickUpForm
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.pickupinstore = (function () {

    var defaults = {};

    function init(){
        bindPickupInStoreClick();
        bindPickupInStoreSearch();
        bindPickupHereInStoreButtonClick();
        bindPaginateStoreResultsButtons();
        bindPickupRadioButtonSelection();
        bindFindPickupStoresNearMeSearch();
        bindLoadingSpinnerOnClick('.add_to_cart_storepickup_form');
        bindLoadingSpinnerOnClick('.select_store_form');
    }

    function bindPickupInStoreClick()
    {
      $(document).on('click', '.pickupInStoreButton', function (e)
      {
        var ele = $(this);
        var productId = "popup_store_pickup_form_" + $(this).attr('id');
        var cartItemProductPostfix = '';
        var productIdNUM = $(this).attr('id');
        productIdNUM = productIdNUM.split("_");
        productIdNUM = productIdNUM[1];

        if (productId !== null)
        {
          cartItemProductPostfix = '_' + productId;
        }

        var boxContent = $('#popup_store_pickup_form').clone();

        $.colorbox({
          html: boxContent,
          height:600,
          onComplete: function ()
          {
            boxContent.show();
            // set the ids for the pickup
            $("#colorbox #popup_store_pickup_form *").each(function ()
            {
              $(this).attr("id", $(this).attr("data-id"));
              $(this).removeAttr("data-id")
            });
            $("#colorbox #popup_store_pickup_form label[data-for=pickupQty]").attr("for", ele.attr("data-for"))
            $("#colorbox #popup_store_pickup_form label[data-for=pickupQty]").removeAttr("data-for")
            $("#colorbox  input#locationForSearch").focus()

            // set a unique id
            $("#colorbox #popup_store_pickup_form").attr("id", productId);


            // insert the product image
            $("#colorbox #" + productId + " .thumb").html(ele.data("img"));

            // insert the product cart details
            $("#colorbox #" + productId + " .price").html(ele.data("productcart"));

            // insert the product name
            $("#colorbox #" + productId + " .details").html(ele.data("productname"))

            // insert the form action
            $("#colorbox #" + productId + " form.searchPOSForm").attr("action", ele.data("actionurl"))

            // set a unique id for the form
            $("#colorbox #" + productId + " form.searchPOSForm").attr("id", "pickup_in_store_search_form_product_" + productIdNUM)

            // set the quantity, if the quantity is undefined set the quantity to the data-value defined in the jsp
            $("#colorbox #" + productId + " #pickupQty").attr("value", ($('#qty').val() !== undefined ? $('#qty').val() : ele.data("value")));

            // set the entry Number
            $("#colorbox #" + productId + " input.entryNumber").attr("value", ele.data("entrynumber"))

            // set the cartPage bolean
            $("#colorbox #" + productId + " input#atCartPage").attr("value", ele.data("cartpage"))

            // get the stores
            rememberlocationSearchSubmit($('#atCartPage').val(), ele.data("entrynumber"), ele.data("actionurl"));
          }
        });
      });
    }

    function bindPickupInStoreSearch()
    {
      $(document).on('click', '#pickupstore_search_button', function (e)
      {
        locationSearchSubmit($('#locationForSearch').val(), $('#atCartPage').val(), $('input.entryNumber').val(), $(this).parents('form').attr('action'));
        return false;
      });

      $(document).on('keypress', '#locationForSearch', function (e)
      {
        if (e.keyCode === 13)
        {
          locationSearchSubmit($('#locationForSearch').val(), $('#atCartPage').val(), $('input.entryNumber').val(), $(this).parents('form').attr('action'));
          return false;
        }
      });
    }

    function bindFindPickupStoresNearMeSearch()
    {
      
      $(document).on('click','#find_pickupStoresNearMe_button', function (e){
        e.preventDefault();
        var cartPageVal = $('#atCartPage').val();
        var entryNumber = $('input.entryNumber').val();
        var formAction = $(this).parents('form').attr('action');
    
        navigator.geolocation.getCurrentPosition(
        function (position)
        {
          locationSearchSubmit('', cartPageVal, entryNumber, formAction, position.coords.latitude, position.coords.longitude);
        },
        function (error)
        {
          console.log("An error occurred... The error code and message are: " + error.code + "/" + error.message);
        });
      });
    }

    function bindPickupHereInStoreButtonClick()
    {
      $(document).on('click','.pickup_add_to_bag_instore_button', function (e){
        $(this).prev('.hiddenPickupQty').val($('#pickupQty').val());
      });
      
      $(document).on('click','.pickup_here_instore_button', function (e){
        $(this).prev('.hiddenPickupQty').val($('#pickupQty').val());
        $.colorbox.close();
      });
    }

    function bindLoadingSpinnerOnClick(form)
    {
      $(document).on('click', form, function (e)
      {
        $.colorbox.toggleLoadingOverlay();
      });
    }

    function locationSearchSubmit(location, cartPage, entryNumber, productCode, latitude, longitude)
    {
      $.colorbox.toggleLoadingOverlay();
      $.ajax({
        url: productCode,
        data: {locationQuery: location, cartPage: cartPage, entryNumber: entryNumber, latitude: latitude, longitude: longitude},
        type: 'POST',
        success: function (response)
        {
          refreshPickupInStoreColumn(response);
          $.colorbox.toggleLoadingOverlay();
          $('.pickup_store_results-item button').first().focus();
        }
      });
    }

    function rememberlocationSearchSubmit(cartPage, entryNumber, formUrl)
    {
      
      $.ajax({
        url: formUrl,
        data: {
          cartPage: cartPage,
          entryNumber: entryNumber
        },
        type: 'GET',
        success: function (response)
        {

          refreshPickupInStoreColumn(response);

          $('#locationForSearch').val(searchLocation);
        }
      });
    }

    function bindPaginateStoreResultsButtons()
    {
      $(document).on('click', '.searchPOSPaging button', function (e)
      {
        e.preventDefault();
        var data = {
          location: $('#locationForSearch').val(),
          cartPage: $('#atCartPage').val(),
          entryNumber: $('.entryNumber').val(),
          page: $(this).parent('form').find('input[name=page]').val()
        };
        var url = $(this).parent('form').attr('action');

        paginateResultsSubmit(url, data);
      });
    }

    function paginateResultsSubmit(url, data)
    {
      $.colorbox.toggleLoadingOverlay();
      $.ajax({
        url: url,
        data: data,
        type: 'GET',
        success: function (response)
        {
          refreshPickupInStoreColumn(response);
          $.colorbox.toggleLoadingOverlay();
        }
      });
    }

    function refreshPickupInStoreColumn(data)
    {
      $('#pickup_store_results').html(data);
      MF.product.bindToAddToCartStorePickUpForm();
    }

    function bindPickupRadioButtonSelection()
    {
      $("form.cartEntryShippingModeForm").each(function ()
      {
        var formELE = $(this);
        formELE.find("input[checked]").click();
        formELE.find("input[name=shipMode]").change(function ()
        {
          if ($(this).val() == "pickUp")
          {
            bindChangeToPickupinStoreTypeSelection(formELE);
          }
          else
          {
            bindChangeToShippingTypeSelection(formELE);
          }
        })
      })
    }

    function bindChangeToShippingTypeSelection(formELE)
    {
      formELE.find('.changeStoreLink').hide();
      formELE.removeClass("shipError");
      $('div#noStoreSelected').hide();
      formELE.find('input[type="radio"]').removeAttr("checked");
      formELE.find('input[type="radio"][value="ship"]').attr("checked", "checked");
      if (!checkIfPointOfServiceIsEmpty(formELE))
      {
        formELE.submit();
      }
    }

    function bindChangeToPickupinStoreTypeSelection(formELE)
    {
      formELE.find('.changeStoreLink').show();
      formELE.find('input[type="radio"]').removeAttr("checked");
      formELE.find('input[type="radio"][value="pickUp"]').attr("checked", "checked");
    }

    function validatePickupinStoreCartEntires()
    {
      var validationErrors = false;
      $("form.cartEntryShippingModeForm").each(function ()
      {
        var formid = "#" + $(this).attr('id');
        if ($(formid + ' input[value=pickUp][checked]').length && checkIfPointOfServiceIsEmpty($(this)))
        {
          $(this).addClass("shipError");
          validationErrors = true;
        }
      });

      if (validationErrors)
      {
        $('div#noStoreSelected').show().focus();
        $(window).scrollTop(0);
      }
      return validationErrors;
    }

    function checkIfPointOfServiceIsEmpty(cartEntryDeliveryModeForm)
    {
      return (!cartEntryDeliveryModeForm.find('.pointOfServiceName').text().trim().length);
    }

    return {
      init: init,
      validatePickupinStoreCartEntires: validatePickupinStoreCartEntires
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.pickupinstore.init();



