/*
 *  require
 *  MF.common.refreshScreenReaderBuffer
 */

;
(function($, window, document, requestResult) {
    'use strict';

    var MF = window.MF || {};

    MF.forgotpassword = (function() {

        var options = {
            url: {
                sendForgottenPassword: "/ajax/password/request",
                sendPasswordHint: "/ajax/passwordhint/request"
            }

        };

        var $modal = $(".password__hint--modal, a.password-hint"),
            $modalforgotten = $(".password__forgotten--modal, .password-forgotten"),
            $modalForgottenLogin = $(".forgottenPassword__login--modal"),
            $modalReset = $(".passwordhint__forgotten--modal"),
            $modalLogin = $(".passwordhint__login--modal");

        var forgottenPasswordForm, forgottenPasswordValidationMessage, forgottenPasswordFormValidator;
        var passwordHintForm, sendPasswordHintBtn, passwordHintFormValidator;

        function bindAll() {
            bindForgotPasswordLink($('#headerForgottenPassword'));
            bindGetPasswordLink($('#headerPasswordHint'));
            bindResetPasswordLink($('#headerForgottenPassword'));
            bindForgotPasswordObjects();
            bindPasswordHintObjects();
        }

        function bindForgotPasswordLink(passwordForgottenModal) {

            $modalForgottenLogin.on("click", function(e) {
                    MF.overlay.close();
                });
            
            if (MF.breakpoint.MOBILE || MF.breakpoint.TABLET) {
                $modalforgotten.on("click", function(e) {
                    e.preventDefault();
                    MF.overlay.close();
                    clearTimeout(popup);
                    var popup = setTimeout(function() {
                        MF.overlay.openWithElement({
                            element: passwordForgottenModal,
                        });
                    }, 100);
                });
            } else {
                $modalforgotten.on("click", function(e) {
                    e.preventDefault();
                    MF.overlay.openWithElement({
                        element: passwordForgottenModal,
                    });
                });
            }

        }

        function bindGetPasswordLink(passwordGetForgottenModal) {
            if (MF.breakpoint.MOBILE || MF.breakpoint.TABLET) {
                 $modal.on("click", function(e) {
                    e.preventDefault();
                    clearTimeout(popup);
                    var popup = setTimeout(function() {
                    MF.overlay.openWithElement({
                        element: passwordGetForgottenModal,
                    });
                });
            });
             } else {    
                $modal.on("click", function(e) {
                    e.preventDefault();
                    MF.overlay.close();
                    clearTimeout(popup);
                        var popup = setTimeout(function() {
                            MF.overlay.openWithElement({
                                element: passwordGetForgottenModal,
                        });
                    }, 100);
                });
            }
        }

        function bindResetPasswordLink(passwordResetModal) {
            $modalReset.on("click", function(e) {
                e.preventDefault();
                MF.overlay.close();
                clearTimeout(popup);
                var popup = setTimeout(function() {
                    MF.overlay.openWithElement({
                        element: passwordResetModal,
                    });
                }, 100);

            });

            $modalLogin.on("click", function(e) {
                MF.overlay.close();
            });
        }

        function showMessage($msgElement, text) {
            $msgElement.text(text).show();
        }

        function clearMessage($msgElement) {
            $msgElement.text("").hide();
        }

        function validateForgottenPasswordForm() {
            clearMessage(forgottenPasswordValidationMessage);

            return forgottenPasswordFormValidator.form();
        }

        function onForgottenPasswordSubmitted(result) {
            if(result.status == requestResult.status.SUCCESS) {
                $(".headerForgottenPassword").trigger("reveal:close");

                $("#forgottenpwdbox").hide();
                $("#forgottenpwdconfbox").show();
            } else if(result.status == requestResult.status.FAIL) {
                showMessage(forgottenPasswordValidationMessage, result.message);
            }
        }

        function bindForgotPasswordObjects() {
            forgottenPasswordForm = $("#forgottenPasswordForm");
            forgottenPasswordValidationMessage = $(".forgottenPasswordMessage", forgottenPasswordForm);

            var errorMessage = forgottenPasswordForm.find("#forgottenPasswordEmailInvalid").text();
            forgottenPasswordFormValidator = validateForm(forgottenPasswordForm, errorMessage);

            forgottenPasswordForm.ajaxForm({
                url: options.url.sendForgottenPassword,
                method: "POST",
                beforeSubmit: validateForgottenPasswordForm,
                success: onForgottenPasswordSubmitted
            });
        }

        function bindPasswordHintObjects() {
            passwordHintForm = $("#passwordHintForm");
            sendPasswordHintBtn = passwordHintForm.find("#sendPasswordHintBtn");
            var errorMessage = passwordHintForm.find("#passwordHintEmailInvalid").text();
            passwordHintFormValidator = validateForm(passwordHintForm, errorMessage);

            sendPasswordHintBtn.on("click", onSendPasswordHint);
        }

        function onSendPasswordHint() {
            if (passwordHintFormValidator.form()) {
                var result = $.post(options.url.sendPasswordHint, passwordHintForm.serialize())
                    .done(function(data) {
                        if (data.status == "SUCCESS") {
                            if (data.data.passwordHintData.passwordHint) {
                                $("#sendPasswordHintBtn").hide();
                                $("#passwordhintdesc").hide();
                                $("#passwordHintEmail").hide();
                                $("#pwdHiddenContent").show();
                                $('.overlay-password__hint-reveal').show();
                                $('.overlay-password__links-wrapper').hide();
                                $("#pwdHiddenContentValue").html(data.data.passwordHintData.passwordHint);
                                $("#pwdHiddenContentValue").show();
                            } else {
                                var errorMessage = passwordHintForm.find("#passwordHintNotAvailable").text();
                                $("#pwdHiddenContentValue").html(errorMessage);
                                $("#pwdHiddenContentValue").show();
                            }
                        } else {
                            var errorMessage = passwordHintForm.find("#passwordHintEmailInvalid").text();
                            $("#pwdHiddenContentValue").html(errorMessage);
                            $("#pwdHiddenContentValue").show();
                        }
                    })
                    .fail(function() {
                        // console.error("error sending request for password hint");
                    });

                return result;
            }
        }

        function validateForm(form, errorMessage) {
            var validator = form.validate({
                onfocusout: function(element) {
                    $(element).valid();
                },
                rules: {
                    email: {
                        required: true,
                        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
                    }
                },
                messages: {
                    email: {
                        required: errorMessage,
                        pattern: errorMessage
                    }
                },
                errorPlacement: function(error, element) {
                    error.insertBefore(element);
                }
            });

            return validator;
        }

        return {
            bindAll: bindAll
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.requestResult));


MF.forgotpassword.bindAll();