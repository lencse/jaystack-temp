/*
 *  No Dependencies (check pub/sub ref on the window) 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.track = (function () {

    function trackAddToCart(productCode, quantity, cartData)
    {
      window.mediator.publish('trackAddToCart',{
        productCode: productCode,
        quantity: quantity,
        cartData: cartData
      });
    }

    function trackRemoveFromCart(productCode, initialCartQuantity)
    {
      window.mediator.publish('trackRemoveFromCart',{
        productCode: productCode,
        initialCartQuantity: initialCartQuantity
      });
    }

    function trackUpdateCart(productCode, initialCartQuantity, newCartQuantity)
    {
      window.mediator.publish('trackUpdateCart',{
        productCode: productCode,
        initialCartQuantity: initialCartQuantity,
        newCartQuantity: newCartQuantity
      });
    }

    return {
      trackAddToCart: trackAddToCart,
      trackRemoveFromCart: trackRemoveFromCart,
      trackUpdateCart: trackUpdateCart
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));



