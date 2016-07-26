/*
 *  require  (TODO: locate ACC objects below)
 *  
 *  MF.address.refreshDeliveryAddressSection()
 *  ACC.deliverymode.refreshDeliveryMethodSection()
 *  ACC.payment.refreshPaymentDetailsSection()
 *  ACC.placeorder.updatePlaceOrderButton()
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.refresh = (function () {

    function refreshCartTotals(checkoutCartData)
	{
		$('#ajaxCart').html($('#cartTotalsTemplate').tmpl(checkoutCartData));
	}

	function refreshPage(checkoutCartData)
	{
		//update delivery address, delivery method and payment sections, and cart totals section
		MF.address.refreshDeliveryAddressSection(checkoutCartData);
		ACC.deliverymode.refreshDeliveryMethodSection(checkoutCartData);
		ACC.payment.refreshPaymentDetailsSection(checkoutCartData);
		refreshCartTotals(checkoutCartData);
		ACC.placeorder.updatePlaceOrderButton();
	}

	function getCheckoutCartDataAndRefreshPage()
	{
		$.getJSON(getCheckoutCartUrl, function (checkoutCartData)
		{
			refreshPage(checkoutCartData);
		});
	}

    return {
      refreshCartTotals: refreshCartTotals,
      refreshPage: refreshPage,
      getCheckoutCartDataAndRefreshPage: getCheckoutCartDataAndRefreshPage
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));

// Cleanup!
$.blockUI.defaults.overlayCSS = {};
$.blockUI.defaults.css = {};
