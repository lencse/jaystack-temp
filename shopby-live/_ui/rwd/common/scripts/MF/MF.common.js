/*
 *  require
 *  ACC.config.commonResourcePath
 *  MF.product.initQuickviewLightbox
 *  ACC.config.CSRFToken
 */
;(function ($, window, document, ACC, mediator){
  'use strict';

  var MF = window.MF || {};

  MF.common = (function () {

    var defaults = {
      currentCurrency: "USD",
      page: $("#page"),
      processingMessage: $("<img src='" + ACC.config.commonResourcePath + "/images/spinner.gif'/>"),
      reloadPage : false,
      inEvents : {
         handleAddToWishList : "show:login:overlay"
      }
    };

    function setCurrentCurrency() {
      defaults.currentCurrency = defaults.page.data("currencyIsoCode");
    }

    function refreshScreenReaderBuffer() {
        // changes a value in a hidden form field in order
        // to trigger a buffer update in a screen reader
        $('#accesibility_refreshScreenReaderBufferField').attr('value', new Date().getTime());
    }

    function bindAll() {
        bindToUiCarouselLink();
        bindShowProcessingMessageToSubmitButton();

        checkoutRegisterForm();
        checkoutAsGuestUser();
        submitShareByEmailForm();
        handleMyAccountLinks();

        updateFilledInputTags();
        togglePhoneInformation();
        revealSubscriptionPopup();
        toolTip();
    }

      function revealSubscriptionPopup(){
          $("#designerEmailASubButton").on("click", function(e){
              e.preventDefault();
              MF.overlay.openWithElement({
                  element: $( '#sailThruPopup' )
              });
          });
      }

    function bindToUiCarouselLink() {
        $("ul.carousel > li a.popup").colorbox({
            onComplete: function() {
                refreshScreenReaderBuffer();
                $.colorbox.resize();
                MF.product.initQuickviewLightbox();
            },

            onClosed: function() {
                refreshScreenReaderBuffer();
            }
        });
    }

    function bindShowProcessingMessageToSubmitButton() {
        $(':submit.show_processing_message').each(function() {
            $(this).on("click", showProcessingMessageAndBlockForm);
        });
    }

    function showProcessingMessageAndBlockForm() {
        $("#checkoutContentPanel").block({
            message: processingMessage
        });
    }

    function blockFormAndShowProcessingMessage(submitButton) {
        var form = submitButton.parents('form:first');
        form.block({
            message: processingMessage
        });
    }
    function handleHeaderBreakpoints(data) {
        if(data.guest == true) {
            // anonymous || guest || guest buyer
            $(".topbar li.anonymous-user").show();
            $('#loginLinks').show();
        } else {
            // registered
            $(".topbar #accountLinks [value='#'], .topbar #accountLinks [href='#'], .topbar #accountLinks .default-opt").text(data.customerDisplayName);
            $(".topbar li.authenticated-user").show();
        }
    }

    function setHeaderDynamics() {
        $.ajax({
            beforeSend: function (request)
            {
                request.setRequestHeader("Cache-Control", "no-store");
            },
            url: '/ajax/headerdata',
            type: "GET",
            cache: false,
            xhrFields: {
                withCredentials: true
            },
            success: function(data, status) {
                $(".shoppingCartCount").text(data.shoppingCartCount);
                $(".menu__icon__cart__total").text(data.shoppingCartCount);

                if (data.billingCurrencyCode != null && data.billingCurrencyCode.length > 0) {
                    $(".topbar #currency-selector [value='" + data.billingCurrencyCode + "']").attr("selected", "selected");
                }

                if (data.shippingCountryName != null && data.shippingCountryName.length > 0) {
                    $(".topbar #shipping-country").text(data.shippingCountryName);
                }

                if (data.ng != null && data.ng.length > 0) {
                    // If SKPCPU1 is located in the returned string then bring up the popup as its related to the Korean address change
                    var  formData = '';  //Name value Pair
                    if (data.ng.indexOf("SKPCPU1") > -1 ){
                      formData = "ng=SKPCPU1";  //Name value Pair
                      if ( $.cookie('loggedIn') === "true" ){
                        MF.popup.init('<style>#korean-popup-desktop{display:none}#korean-popup-tablet{display:none}#korean-popup-mobile{display:block}@media screen and (min-width:42.5625em){#korean-popup-desktop{display:none}#korean-popup-tablet{display:block}#korean-popup-mobile{display:none}}@media screen and (min-width:61.25em){#korean-popup-desktop{display:block}#korean-popup-tablet{display:none}}</style><img alt border=0 height=414 id=korean-popup-mobile orgheight=414 orgwidth=261 src=http://assets.matchesfashion.com/images/korean_popup/korean_popup-mobile.jpg usemap=#korean-popup-mobile-map width=261><map id=korean-popup-mobile-map name=korean-popup-mobile-map><area alt coords=0,171,260,200 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self><area alt coords=89,397,178,414 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self></map><img alt=""border=0 height=308 id=korean-popup-tablet orgheight=308 orgwidth=615 src=http://assets.matchesfashion.com/images/korean_popup/korean_popup-tablet.jpg usemap=#korean-popup-tablet-map width=615><map id=korean-popup-tablet-map name=korean-popup-tablet-map><area alt=""coords=207,129,401,154 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self><area alt=""coords=272,296,344,308 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self></map><img alt border=0 height=418 id=korean-popup-desktop orgheight=418 orgwidth=840 src=http://assets.matchesfashion.com/images/korean_popup/korean_popup-desktop.jpg usemap=#korean-popup-desktop-map width=100%><img height=30 src="//:0" id=korean-popup-desktop><map id=korean-popup-desktop-map name=korean-popup-desktop-map><area alt coords=284,176,546,206 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self><area alt coords=361,397,468,418 href=javascript:void(0); onclick=MF.popup.closePopUp() style=outline:0 target=_self></map>');
                      }

                    }
                    $.ajax({
                        url : '/_ug/updateGroup?'+formData,
                        type: 'GET',
                        success: function(data, textStatus, jqXHR)
                        {
                            console.info("Group updated : "+textStatus);
                        },
                        error: function (jqXHR, textStatus, errorThrown)
                        {
                            console.info("Error updating Group : "+errorThrown);
                        }
                    });
                }

                if (data.indicativeCurrencySymbol.length > 0) {
                    $(".topbar #local-currency-symbol").text(data.indicativeCurrencySymbol);
                    $(".topbar #indicative-currency").fadeIn(100);
                } else if(data.countryHasDefaultIndicativeCurrency){
                    $(".topbar #indicative-currency").fadeIn(100);
                } else{
                    $("#indicative-currency").parent("li").css({"display":"none", "border-left":"none"}).prev().css({"border-right":"none"});
                }
                // This code is to load a S3-hosted file dynamically. This is related to we having control of menu items without needing a deployment
                $.ajaxSetup({
                  cache: true
                });
                $.getScript("//assets.matchesfashion.com/js/meta_menu.js")
                  .done(function(script, textStatus) {
                  })
                  .fail(function(jqxhr, settings, exception) {
                });
                //populate iAdvize data
                if(typeof idzCustomData !== 'undefined')
                {
                    idzCustomData.firstname=data.firstName;
                    idzCustomData.surname=data.lastName;
                    idzCustomData.cust_email=data.email;
                    idzCustomData.cg=data.cg;

                    idzCustomData.ready=true;
                    if(typeof initiateIAdvizeTag == 'function')
                    {
                        initiateIAdvizeTag();
                    }
                }
                //populate mentionMe data
                if(typeof mentionMe !== 'undefined')
                {
                    mentionMe.firstname=data.firstName;
                    mentionMe.surname=data.lastName;
                    mentionMe.email=data.email;
                    mentionMe.cg=data.cg;
                    mentionMe.ready=true;
                    if(typeof initiateMentionMeTag == 'function')
                    {
                        initiateMentionMeTag();
                    }
                }

                // Handle Breakpoint Mobile
                Breakpoints.on({
                    name: "mobile",
                    matched: function() {
                      $('#loginLinks').hide();
                    },
                    exit: function() {
                      handleHeaderBreakpoints(data);
                    }
                });
              // Handle page landing (reload)
               if (MF.breakpoint.getActive() != 'mobile') {
                  handleHeaderBreakpoints(data);
                }
            }
        });
    }

    function validateGuestCheckoutForm(guestCheckoutForm) {
      var validator = guestCheckoutForm.validate({
        rules: {
          email: {
            required: true,
            pattern: '\\b[A-Za-z0-9](\\.?[A-Za-z0-9_\'%+-]+)*\\.?@(\\.?[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}\\b'
          }
        },
        messages: {
          required: $("#guestCheckoutLoginEmailInvalid").text(),
          pattern: $("#guestCheckoutLoginEmailInvalid").text()
        }
      });
    }

    function checkoutAsGuestUser() {
      var checkoutAsGuestForm = $('#guestForm');
      checkoutAsGuestForm.on('submit', function() { return validateRegisterForm(checkoutAsGuestForm) } )
    }

    function validateRegisterForm(registerForm) {

        var validator = registerForm.validate({
            ignore:[],
            rules: {
                titleCode: {
                    required: true
                },
                firstName: {
                    maxlength: 255,
                    required: true
                },
                lastName: {
                    maxlength: 255,
                    required: true
                },
                pwd: {
                    maxlength: 255,
                    minlength: 6,
                    pattern: '^(?=.{6,255}$)(?=.*?[A-Z])(?=.*?\\d).*',
                    required: true
                },
                checkPwd: {
                    required: true,
                    equalTo: ".strength"
                },
                pwdHint: {
                    required: true
                },
                email: {
                    required: true,
                    pattern: '\\b[A-Za-z0-9](\\.?[A-Za-z0-9_\'%+-]+)*\\.?@(\\.?[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}\\b'
                },
                phone: {
                    required: true,
                    pattern: '(?=[\\d \\(\\)\\+\\-]+$)\\D*(\\d\\D*){9,}.*'
                }
            },
            messages: {
                titleCode: {
                    required: $("#registerTitleInvalid").text()
                },
                firstName: {
                    required: $("#registerFirstNameInvalid").text()
                },
                lastName: {
                    required: $("#registerLastNameInvalid").text()
                },
                pwd: {
                    minlength: $("#registerPasswordInvalid").text(),
                    pattern: $("#registerPasswordInvalid").text(),
                    required: $("#registerPasswordInvalid").text()
                },
                checkPwd: {
                    required: $("#registerConfirmationPasswordInvalid").text(),
                    equalTo: $("#registerPasswordNotMatch").text()
                },
                pwdHint: {
                    required: $("#registerPasswordHintInvalid").text()
                },
                email: {
                    required: $("#registerEmailInvalid").text(),
                    pattern: $("#registerEmailInvalid").text()
                },
                phone: {
                    required: $("#registerPhoneInvalid").text(),
                    pattern: $("#registerPhoneInvalid").text()
                }
            },
            errorPlacement: function(error, element) {
                error.insertBefore(element);
            }
        });

        return validator.form();
    }

    function toolTip(){
      $('.form_field-elements__info').off('mouseenter').on('mouseenter', function(event) {
        event.preventDefault();
        /* Act on the event */

        $('.form_field-elements__tooltip').show();

      });
      $('.form_field-elements__info').off('mouseleave').on('mouseleave', function(event) {
        event.preventDefault();
        /* Act on the event */

        $('.form_field-elements__tooltip').hide();

      });
    }

    function disableCreateAccoutButton(form) {
        var button = $(form).find('button[type="submit"]');
        return MF.spinnerHandler.showSpinner(button, {'margin-left': 0});
    }

    function checkoutRegisterForm() {
      var registerForm = $('#registerForm');
      registerForm.on('submit', function() { return validateRegisterForm(registerForm) && disableCreateAccoutButton(this) } )
    }

    function showConfirmationMessage(form) {
        defaults.reloadPage = true;
        $('.modal-content').hide();
        $('.overlay-register__confirmation').show().delay(5000).queue(function(){
          location.reload();
        });
    }

    function showModalConfirmation(form, confirmCallback) {
        showConfirmationMessage(form);
    }

    function validateShareByEmailForm(shareByEmailForm) {
          var validator = shareByEmailForm.validate({
              rules: {
                  name: {
                      maxlength: 255,
                      required: true
                  },
                  email: {
                      required: true,
                      pattern: '\\b[A-Za-z0-9](\\.?[A-Za-z0-9_\'%+-]+)*\\.?@(\\.?[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}\\b'
                  },
                  friendName: {
                      maxlength: 255,
                      required: true
                  },
                  friendEmail: {
                      required: true,
                      pattern: '\\b[A-Za-z0-9](\\.?[A-Za-z0-9_\'%+-]+)*\\.?@(\\.?[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}\\b'
                  },
                  message: {
                      maxlength: 2048
                   }
              },
              messages: {
                  name: {
                      required: $("#sharebyemailNameInvalid").text()
                  },
                  email: {
                      required: $("#sharebyemailEmailInvalid").text(),
                      pattern: $("#sharebyemailEmailInvalid").text()
                  },
                  friendName: {
                      required: $("#sharebyemailFriendNameInvalid").text()
                  },
                  friendEmail: {
                      required: $("#sharebyemailFriendEmailInvalid").text(),
                      pattern: $("#sharebyemailFriendEmailInvalid").text()
                  },
                  message: {
                	  maxlength: $("#sharebyemailMessageInvalid").text()
                  }

              },
              errorPlacement: function(error, element) {
                  error.insertBefore(element);
              },
              //errorLabelContainer: ".registerMessage"
          });

          return validator.form();
    }

    function submitShareByEmailForm() {

        var registerUrl = "/ajax/sharebyemail";

        var shareByEmailForm = $("#shareByEmailForm");

        shareByEmailForm.find(':submit').on("click", function(e) {
            e.preventDefault();

            if (validateShareByEmailForm(shareByEmailForm)) {
                $.ajax({
                    url: registerUrl,
                    type: "POST",
                    data: shareByEmailForm.serialize(),

                    success: function(data, status) {
                      //console.log(shareByEmailForm.serialize());
                        if (data.status == "SUCCESS") {
                            showModalConfirmation(shareByEmailForm, function() {
                                location.reload();
                            });
                        }
                    }
                });
            }
        });
    }

    function updateFilledInputTags(){
        $("input[type='text'], input[type='password'], textarea").on( "focusout keyup paste", function(){
            var $this = $(this);
            var controlLabel = $this.parents(".control-group");

            if( $this.val().length > 0 ){
                $this.addClass("blackOutline");
                if(controlLabel.exists()){
                    controlLabel.removeClass("error");
                    if( controlLabel.parents("form").find(".error").length === 1 ){
                        controlLabel.parents("form").find(".generic__error__message").removeClass("error");
                    }
                }
            } else {
                $this.removeClass("blackOutline");
            }
        });
    }

    var togglePhoneInformation = function(){
      if (!Modernizr.touch) {
          $( ".info__icon" ).hover(
              function() {
                  $( this ).siblings(".info__wrapper").show();
              }, function() {
                  $( this ).siblings(".info__wrapper").hide();
              }
          );
      } else {
          $( ".info__icon" ).on("click", function(event) {
              event.stopPropagation();
              var infoWrapper = $( this ).siblings(".info__wrapper").show();
              function onClick(e) {
                  if( !$(e.target).closest('.info__wrapper').andSelf().filter('.info__wrapper').exists() ) {
                      infoWrapper.hide();
                      $(document).off('click', onClick);
                  }
              }
              $(document).on('click', onClick);
          });
      }
    };

    function handleMyAccountLinks(){
          MF.select.init({
                contextId: '#accountLinks',
                links: true
            });
    }

      return {
      setCurrentCurrency: setCurrentCurrency,
      bindAll: bindAll,
      setHeaderDynamics: setHeaderDynamics,
      refreshScreenReaderBuffer: refreshScreenReaderBuffer
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document, ACC, MF.product.mediator));
MF.common.setCurrentCurrency();
MF.common.bindAll();
MF.common.setHeaderDynamics();


/* Extend jquery with a postJSON method */
jQuery.extend({
    postJSON: function(url, data, callback) {
        return jQuery.post(url, data, callback, "json");
    }
});

// add a CSRF request token to POST ajax request if its not available
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    // Modify options, control originalOptions, store jqXHR, etc
    if (options.type === "post" || options.type === "POST") {
        var noData = (typeof options.data === "undefined");
        if (noData || options.data.indexOf("CSRFToken") === -1) {
            options.data = (!noData ? options.data + "&" : "") + "CSRFToken=" + ACC.config.CSRFToken;
        }
    }
});
