/*
 *  require
 *
 */

;(function ($, window, document, paymentData){
  'use strict';

  var MF = window.MF || {};

  MF.removepaymentdetails = (function () {

    var $removePaymentDetailsModal;
    var defaults = {};

    function init(){
        if (!paymentData) {
            return;
        }
        $removePaymentDetailsModal = $('#removePaymentDetailsModal');
        bindRemovePaymentDetails();
        bindEvents();
    }

    function bindRemovePaymentDetails() {
         $(".submitRemove").on("click", function(e) {
             e.preventDefault();

             $removePaymentDetailsModal.data("id", this.id);

             MF.overlay.openWithElement({
               element: $removePaymentDetailsModal,
               callbacks: {
                   open: function() {
                    var cardInfotext = $(e.target).closest('div').parent().find('ul');
                        $(cardInfotext).clone().insertAfter('.cancel-paymentcards').wrap('<div class="temp__card" />');      
                   },
                   close: function() {
                        $('.temp__card').remove();
                   }
               }
            });
         });
        }
      var bindRemovePaymentCardConfirmation = function() {
          $(document).on("click", ".payment-delete-continue-btn", function () {
              var addressId = $(this).data("payment-id").toString();

              addressDeletePopup.find(".address-modal-content").html($.tmpl(addressDeleteTemplate, {
                  address: getAddress(addressId)
              }));

              overlay.openWithElement({
                  element: addressDeletePopup
              });

              addressDeletePopup.find(".continue-delete-btn").on("click", onRemoveAddressButtonClick);
          });
      }

    function bindEvents() {
        $removePaymentDetailsModal.on("click", ".cancel-btn", onCancelButtonClicked);
        $removePaymentDetailsModal.on("click", ".continue-btn", onContinueButtonClicked);
        $removePaymentDetailsModal.on("click", ".close-reveal-modal", onDialogClose);
    }

    var onCancelButtonClicked = function() {
        //$removePaymentDetailsModal.trigger("reveal:close");
        MF.overlay.close();
    };

    var onContinueButtonClicked = function() {
        $('#removePaymentDetails' + $removePaymentDetailsModal.data("id")).submit();
    };

    var onDialogClose = function() {
        $removePaymentDetailsModal.trigger("reveal:close");
    };

    var onSubmitSetDefault = function(e) {
        $('#setDefaultPaymentDetails' + $(this).attr('id')).submit();
    };

    return {
      init: init
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document, MF.paymentData));

MF.removepaymentdetails.init();
