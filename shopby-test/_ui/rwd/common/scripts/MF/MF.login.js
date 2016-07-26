;(function($, window, document, mediator) {
    'use strict';

    var MF = window.MF || {};

    MF.login = (function() {
        var validator;
        var options = {
            inEvents: {
                attemptToAddProductToWishlistAnonymously: "wishlist:attempt:add:anonymously"
            },
            outEvents: {
                userLoggedIn: "user:logged:in"
            }
        };

        var init = function() {
                bindHandlers();
                mediator.subscribe(options.inEvents.attemptToAddProductToWishlistAnonymously, handleAddToWishList);
                bindgetPrivacyOverlayClick();
                // This is for the impersonation - it is to turn the sub channel into a standard form selecter that we use
                $("#subChannelCode").selecter();
        };

         var bindHandlers = function() {
        
           $("#loginForm").find(":submit").on("click", function(ev){ 
                ev.preventDefault();
                validateLoginForm($("#loginForm"));
                });
        };

        var handleAddToWishList = function() {
            var locationParam = '/login';
            window.location.pathname = locationParam;
            // Keep to add to wishlist
            // #######################
        };

      
        var validateLoginForm = function(loginForm) {
            
            var errorWarning = '<label class="error">'+ $('#globalErrorMessageText').text() + '</label>';
            var errorWarningContainer = '#errorWarningContainer';
            var validator = loginForm.validate({
                rules: {
                    j_username: {
                        required: true
                    },
                    j_password: {
                        required: true
                    }
                },
                messages: {
                    j_username: {
                        required: $("#loginEmailInvalid").text()
                    },
                    j_password: {
                        required: $("#loginPasswordInvalid").text()
                    }
                },
                errorPlacement: function(error, element) {
                     if ( loginForm.prop('id') == 'headerLoginForm' ) {
                        if (element.attr('id') == 'j_username') {
                            error.appendTo('#emailErrorMessage');
                            $('#globalErrorMessage').html(errorWarning).show();
                        } else if (element.attr('id') == 'j_password') {
                            error.appendTo('#passwordErrorMessage');
                            $('#globalErrorMessage').html(errorWarning).show();
                        } else {

                        }
                      } else {
                        error.insertBefore(element);
                        $('#errorWarningContainer').empty().prepend(errorWarning);
                     }
                }
            });
             if ((validator.form()) == true) loginForm.submit();
        };

        var publishUserLoggedIn = function() {
            return mediator.publishAsync(options.outEvents.userLoggedIn);
        };

        var handleLoginFail = function (data, loginForm) {
            var breakpointPlaceholder = loginForm.find('.user-access__area--login__button');
            var message = $('#loginError').data('msg');
            var logMessage = data.message;
            var errorLogin = '<label class="error">'+ $('#loginError').text() + '</label>';
            if ( loginForm.prop('id') == 'headerLoginForm' ) {
                if(logMessage == message) $('#globalErrorMessage').empty().html(errorLogin);
            } else {
                if(logMessage == message) {
                    breakpointPlaceholder.find('.error').remove();
                    breakpointPlaceholder.prepend(errorLogin)
                }
            }
        };



        // // Privacy Popup.
        // will ajax privacy_content_html content slot into overlay.

        function popUpPrivacyOverlay() {

            MF.overlay.openWithElement({
                element: $("#privacyOverlay")
            });
        }

        function getPrivacyOverlayContent() {
            var url = '/component/json/privacy_content_html';
            MF.busyOverlay.enable();

            $.ajax({
                url: url,
                beforeSend: function(request) {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
            })
                .done(function(data) {
                    MF.busyOverlay.disable();
                    popUpPrivacyOverlay();
                    $('#privacyOverlayContent').html(data.data.content);
                })
        }


        function bindgetPrivacyOverlayClick() {
            $('[data-privacy]').on('click', function(event) {
                event.preventDefault();
                getPrivacyOverlayContent();
            });
        }
               



        return {
            init : init,
            validateLoginForm: validateLoginForm
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.product.mediator));

MF.login.init();
