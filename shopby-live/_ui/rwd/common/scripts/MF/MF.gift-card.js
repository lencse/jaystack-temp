;
(function($, window, document) {
  'use strict';

  var MF = window.MF || {};

  MF.giftCard = (function() {
    var config = {
      maxChars: 255,
      // Selectors
      $giftCardForm: $('#giftCardForm'),
      $_document: $(document),
      $addtoBag: $('[data-add-gift-to-basket]'),
      $emailText: $('[name="recipientEmail"]'),
      $dateInput: $('.date-input'),
      $dateButton: $('.date-button'),
      $tooltipWrapper: $(".info__wrapper__tooltip"),
      $tooltipButton: $(".info__icon__tooltip")
    }

    function init() {
      _base();

      _date();
      _events();
      _toggleToolTips();
    }

    function _events() {
      config.$addtoBag.on('click', function(event) {
        //event.preventDefault();
        _cart(event);
      });

      config.$giftCardForm.on('keypress onchange', 'input', function(event) {
        $(this).addClass('blackOutline')
      });

      config.$giftCardForm.on('keyup', 'textarea', function(event) {
        _count($(this));
      });

      $('[data-terms-and-conditions]').on('click', function(event) {
        event.preventDefault();
        console.log('here');
        _termsAndConditions()
      });
    }


    function _toggleToolTips() {
      if (!Modernizr.touch) {

        config.$tooltipButton.hover(
          function() {
            config.$tooltipWrapper.show();
          },
          function() {
            config.$tooltipWrapper.hide();
          }
        );

      } else {
        config.$tooltipButton.on("click", function(event) {
          event.stopPropagation();
          var infoWrapper = config.$tooltipWrapper.show();

          function onClick(e) {
            if (!$(e.target).closest('.info__wrapper__tooltip').andSelf().find('.info__wrapper__tooltip').exists()) {
              infoWrapper.hide();
              config.$_document.off('click', onClick);
            }
          }
          config.$_document.on('click', onClick);
        });
      }
    }

    function _count($this) {

      var count = $this.val().length;

      $('#count').remove();
      if (count < config.maxChars) {
        $('<div class="" id="count">You Have ' + (config.maxChars - count) + ' of ' + config.maxChars + ' characters left</div>').appendTo('.form-helper-text2');
      } else {
        $('<div class="" id="count">You Have 0 of ' + config.maxChars + ' characters left</div>').appendTo('.form-helper-text2');
      }
    }


    function _base() {
      $('[name="message"]').attr({
        'placeholder': 'Message',
        'maxlength': config.maxChars
      });

      MF.select.init({
        contextId: '#giftCardForm div',
        slideDown: true,
        callback: function() {
          config.$addtoBag.removeAttr('disabled').text('add to bag');
        }
      });
    }

    function _termsAndConditions() {
      $('body').append('<div id="genericPopUp" class="generic-popup mf-overlay mfp-hide"><div class="generic-popup__wrapper" id="genericPopUpContent"></div></div>');
      console.log('overlay');
      MF.overlay.openWithElement({
        element: $("#genericPopUp")
      });

    }

    function _date() {
      var today = new Date();
      // Defaults to six month from today
      var sixMonthLimit = new Date(new Date(today).setMonth(today.getMonth() + 6));

      // api - http://amsul.ca/pickadate.js/api/
      var input = config.$dateInput.pickadate({
        editable: true,
        container: '#date-picker',
        format: 'yyyy/mm/dd'
      });
      var datePicker = input.pickadate('picker');

      datePicker.set({
        'min': today, // new Date()
        /// this is going to be a number - 6 , 12 etc
        'max': new Date(2016, 3, 20, 10, 30)
      })

      config.$dateInput.off('click focus');

      config.$dateButton.on('click', function(e) {
        e.preventDefault();
        if (datePicker.get('open')) {
          datePicker.close()
        } else {
          datePicker.open()
        }
        e.stopPropagation()
      });

    }

    function _giftform() {
      var email = document.getElementsByName('recipientEmail');
      var validate = config.$giftCardForm.validate({

        rules: {
          productCodePost: {
            required: true
          },
          senderName: {
            maxlength: 255,
            required: true
          },
          recipientEmail: {
            required: true,
            pattern: '\\b[A-Za-z0-9](\\.?[A-Za-z0-9_\'%+-]+)*\\.?@(\\.?[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}\\b'
          },
          conifrmRecipientEmail: {
            required: true,
            equalTo: email
          },
          recipientName: {
            maxlength: 255,
            required: true
          },
          message: {
            maxlength: 255,
            required: true
          },
          sendDate: {
            required: true,
            date: true
          }
        },
        messages: {
          productCodePost: giftCard_js_messages.productCodePost,
          senderName: giftCard_js_messages.senderName,
          recipientEmail: giftCard_js_messages.recipientEmail,
          confirmRecipientEmail: giftCard_js_messages.confirmRecipientEmail,
          recipientName: giftCard_js_messages.recipientName,
          message: giftCard_js_messages.message,
          sendDate: giftCard_js_messages.sendDate,
        },
        errorPlacement: function(error, element) {
          error.insertBefore(element);
        },
        showErrors: function(errorMap, errorList) {
          if (this.numberOfInvalids() > 0) {
            $("#summary").html(giftCard_js_messages.showErrors1 + ' ' + this.numberOfInvalids() + ' ' + giftCard_js_messages.showErrors2);
          } else {
            $("#summary").empty();
          }
          this.defaultShowErrors();
        }
      });

      return validate.form();

    }

    function _cart(event) {
      if (_giftform()) {
        config.$giftCardForm.ajaxForm(
          function() {
            MF.minicart.showMiniCart()
            var close = setInterval(function() {
              MF.minicart.closeMiniCart();
              config.$addtoBag.attr('disabled', 'true').text(giftCard_js_messages.addedToBag);
              clearInterval(close);
            }, 3000)
          }
        )
      } else {
        event.preventDefault();
      }
    }

    return {
      init: init,
    };
  })();

  window.MF = MF;

}(jQuery, this, this.document));

if ($('.gft__wrapper').length) MF.giftCard.init()
