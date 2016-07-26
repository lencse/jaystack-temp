;(function ($, window, document, requestResult, overlay) {
  "use strict";

  var MF = window.MF || {};

  var defaultOptions = {};

  MF.wishlistMessage = (function () {

    var POPUP_DELAY = 5000;

    var $shareForm, $shareSuccessPopup, $shareWishlistBtn, $wishlistMessageText;

    var options;

    var validateShareForm = function() {

        var validator =  $shareForm.validate({
            onfocusout: function (element) {
                $(element).valid();
            },
            rules: {
                recipient: {
                    required: true,
                    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
                },
                recipientName: {
                    required: true
                },
                message: {
                    required: true,
                    maxlength: 240
                }
            },
            errorPlacement: function(error, element) {
                error.insertBefore(element);
            },
            showErrors: function(errorMap, errorList) {
                $("#wishlistShareErrorResult, #wishlistShareErrorResultBottom").html("Please correct the highlighted fields.");
                if(this.numberOfInvalids() > 0) {this.defaultShowErrors();} else {$("#wishlistShareErrorResult, #wishlistShareErrorResultBottom").empty()}
              }
        });

        return validator.form();
    };

    var clearErrorMessages = function() {
        $("#wishlistShareErrorResult, #wishlistShareErrorResultBottom").empty();
    };

    var showShareSuccessPopup = function() {
         overlay.openWithElement({
             element: "#shareSuccessPopup",
             callbacks: {
                close: function() {
                    redirectToWishList();
                }
             }
         });
    };

    var redirectToWishList = function() {
        window.location = $shareForm.data("redirectUrl");
    };

    var onShareFormSubmitted = function(response) {
        if(response.status === requestResult.status.SUCCESS)  {
            showShareSuccessPopup();
            _.delay(redirectToWishList, POPUP_DELAY);
        } else {
            invalidShareFormError();
        }
    };

    var invalidShareFormError = function() {
         console.error("Share form is invalid");
         $("#wishlistShareErrorResult, #wishlistShareErrorResultBottom").html($("#invalidShareWishList").text());
    };

     var onShareFormError = function() {
        console.error("An error occurred while submitting share form");
        $("#wishlistShareErrorResult, #wishlistShareErrorResultBottom").html($("#failedToShareWishList").text());
    };

    var submitShareForm = function() {

        clearErrorMessages();

        $shareForm.ajaxSubmit({
            beforeSubmit: validateShareForm,
            success: onShareFormSubmitted,
            error: onShareFormError
        });
    }

    var initObjects = function() {
        $shareForm = $("#shareForm");
        $shareWishlistBtn = $(".shareWishlist");
        $shareSuccessPopup = $("#shareSuccessPopup");

        $wishlistMessageText = $shareForm.find("#message");
        $wishlistMessageText.simplyCountable({
            counter: $wishlistMessageText.data("counter-id"),
            maxCount: $wishlistMessageText.attr("maxLength")
        });
    };

    var bindEvents = function() {
        $shareWishlistBtn.on("click", submitShareForm);

        $("#recipientName").bind("keyup paste", function() {
            $("#recipientNameHolder").text($(this).val());


            $("#recipientNameHolder").removeClass('slowTransition').addClass('quickTransition').addClass('high');
            setTimeout(function(){
                $("#recipientNameHolder").removeClass('quickTransition').addClass('slowTransition').removeClass('high');
            },500)
        });
        $("#message").bind("keyup paste", function() {
            $("#messageHolder").html(
                $(this).val()
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\r?\n/g, '<br />')
            );

            $("#messageHolder").removeClass('slowTransition').addClass('quickTransition').addClass('high');
            setTimeout(function(){
                $("#messageHolder").removeClass('quickTransition').addClass('slowTransition').removeClass('high');
            },500)

        });
    };

    function disableEmailLinks() {
        $('.wishlist__email-preview a:not(.product-link)').css('cursor', 'default').on('click', function(){ return false; })
    }

    var init = function(opts) {
        options = $.extend({}, defaultOptions, opts);

        initObjects();

        bindEvents();

        disableEmailLinks();
    };

    return {
       init: init
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document, MF.requestResult, MF.overlay));

MF.wishlistMessage.init();