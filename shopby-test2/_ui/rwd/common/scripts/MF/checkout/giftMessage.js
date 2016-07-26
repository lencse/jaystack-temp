/*
 *  requires
 */

;(function($, window, mediator, formMode) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        url: {
            getGiftMessageData: "/ajax/checkout/giftMessage/data",
            setGiftMessage: "/ajax/checkout/giftMessage/set",
            removeGiftMessage: "/ajax/checkout/giftMessage/remove"
        },
        data: {
            root: "data",
            giftMessage: "giftMessage"
        },
        inEvents: {
            checkoutInit: "checkout:init",
            deliveryAddressChanged: "checkout:delivery:address:changed"
        },
        outEvents: {}
    };

    var modes = {
        add: "add",
        edit: "edit",
        view: "view"
    };

    MF.giftMessage = (function() {

        var options;

        var giftMessageForm, giftMessageValidator, addGiftMessageLink,
            giftMessageView, giftMessageText, giftMessageMaxLength, cancelGiftMessageButton,
            saveGiftMessageButton, giftMessageWrapper, giftTextarea, dummyTextarea, giftButtons,
            removeGiftMessageButton;


        var onCheckoutInit = function(data) {
            var giftMessageData = data[options.data.root][options.data.giftMessage];
            populateGiftMessageForm(giftMessageData);
        };

        var loadGiftMessageData = function() {
            return $.getJSON(options.url.getGiftMessageData)
                .then(function(data) {
                    var giftMessageData = data[options.data.root][options.data.giftMessage];
                    updateCitesRestriction(giftMessageData);
                })
                .fail(function() {
                    console.error("Cannot load gift message data");
                }).always(function(){
                    MF.busyOverlay.disable();
                });
        };

        var updateCitesRestriction = function(giftMessageData) {
            var citesRestriction = giftMessageData.citesRestriction;

            if (citesRestriction) {
                giftMessageText.val("").trigger("paste");
                $("#checkoutGiftMessageSection").addClass("notVisible");

                if ($("#citesRestrictionOverlay").length) {
                    $("#citesRestrictionOverlay").removeClass("notVisible");

                    MF.overlay.openWithElement({
                        element: $( '.citesRestrictionOverlay' )
                    })
                    $('.citesRestrictionOverlay').find(".continue-btn").click(function(){
                        MF.overlay.close();
                    })
                }
            } else {
                populateGiftMessageForm(giftMessageData);
                $("#checkoutGiftMessageSection").removeClass("notVisible");

                if ($("#citesRestrictionOverlay").length) {
                    $("#citesRestrictionOverlay").addClass("notVisible");
                }
            }
        };

        var populateGiftMessageForm = function(giftMessageData) {
            var giftMessage = giftMessageData.giftMessage;

            if (giftMessage) {
                giftMessageText.val(giftMessage).trigger("paste");
                giftMessageView.html(giftMessage);

                /* Check if user is in Shipping Section */
                if( $(".checkout-stage").hasClass("shipping-stage") ){
                    formMode.switchMode(giftMessageForm, modes.edit);
                    giftButtons.addClass("hidden");
                } else {
                    formMode.switchMode(giftMessageForm, modes.view);
                }
            } else {
                formMode.switchMode(giftMessageForm, modes.add);
            }
        };

        var enableGiftButtons = function(){
            giftButtons.removeClass("hidden");
        };

        var cancelMessageText = function(){
            loadGiftMessageData();
            var mode = giftMessageText.val() ? modes.view : modes.add;
            formMode.switchMode(giftMessageForm, mode);
        };

        var removeGiftMessage = function() {
            $.post(options.url.removeGiftMessage, {})
                .then(function(data) {
                    if (data.status === "SUCCESS") {
                       giftMessageText.val("");
                       formMode.switchMode(giftMessageForm, modes.add);
                    } else {
                        console.error("Cannot remove gift message");
                    }
                })
                .fail(function() {
                    console.error("Error occurred while removing gift message");
                });
        };

        var onAddGiftMessageLinkClick = function(e) {
            e.preventDefault();
            formMode.switchMode(giftMessageForm, modes.edit);
        };

        var onGiftMessageViewClick = function() {
            formMode.switchMode(giftMessageForm, modes.edit);
        };

        var onSaveGiftMessageButtonClick = function() {
            if (giftMessageValidator.form()) {
                $.post(options.url.setGiftMessage, giftMessageForm.serialize())
                    .then(function(data) {
                        if (data.status === "SUCCESS") {
                            loadGiftMessageData();
                        } else {
                            console.error("Cannot save gift message");
                        }
                    })
                    .fail(function() {
                        console.error("Error occurred while saving gift message");
                    });
            }
        };

        var initGiftMessageValidator = function() {
            giftMessageValidator = giftMessageForm.validate({
                onfocusout: false,
                rules: {
                    giftMessage: {
                        required: true
                    }
                },
                messages: {
                    giftMessage: {
                        required: $("#giftMessageInvalid").text()
                    }
                },
                errorPlacement: function(error, element) {
                    error.insertBefore(element.parents("#giftMsg"));
                }
            });
        };

        var formatDummyTextarea = function(text){
            if ( !text ) {
                return '&nbsp;';
            }
            return text.replace( /\n$/, '<br>&nbsp;' )
                .replace( /\n/g, '<br>' );
        };

        var positionTextarea = function() {
            var h = giftMessageWrapper.height();
            var top = Math.max( 0, ( h - dummyTextarea.height() ) * 0.5 ) - 20;

            giftTextarea.css({
                paddingTop: top,
                height: h - top
            });
        };

        var initCenterTextarea = function(){
            giftTextarea.on( 'keyup change', function( event ) {
                var html = formatDummyTextarea( giftTextarea.val() );
                dummyTextarea.html( html );
                positionTextarea();
            }).trigger('change');
        };

        var initGiftMessageObjects = function() {
            giftMessageForm = $("#giftMessageForm");

            addGiftMessageLink = giftMessageForm.find("#addGiftMessageLink");

            giftMessageView = giftMessageForm.find("#giftMessageView");

            giftMessageText = giftMessageForm.find("#giftMessageText");
            giftMessageMaxLength = giftMessageText.attr("maxlength");

            cancelGiftMessageButton = giftMessageForm.find("#cancelGiftMessageBtn");
            saveGiftMessageButton = giftMessageForm.find("#saveGiftMessageBtn");
            removeGiftMessageButton = giftMessageForm.find("#removeGiftMessageBtn");

            giftMessageWrapper = $('#giftMsg');
            giftButtons = $(".gift__buttons");
            giftTextarea = giftMessageWrapper.find('textarea');
            dummyTextarea = giftMessageWrapper.find('.dummyTextarea');
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initGiftMessageObjects();
            initGiftMessageValidator();
            initCenterTextarea();

            $(function() {
                mediator.subscribe(options.inEvents.checkoutInit, onCheckoutInit);
                mediator.subscribe(options.inEvents.deliveryAddressChanged, loadGiftMessageData);

                addGiftMessageLink.on("click", onAddGiftMessageLinkClick);

                $('#addEditGiftMessageLink').on("click", onAddGiftMessageLinkClick);

                giftMessageView.on("click", onGiftMessageViewClick);

                giftMessageText.on("click", enableGiftButtons);

                giftMessageText.simplyCountable({
                    counter: giftMessageText.data("counter-id"),
                    maxCount: giftMessageText.attr("maxLength")
                });

                saveGiftMessageButton.on("click", onSaveGiftMessageButtonClick);
                cancelGiftMessageButton.on("click", cancelMessageText);
                removeGiftMessageButton.on("click", removeGiftMessage);

                $( window ).on( 'resize', _.debounce( positionTextarea, 200 ) );
            });
        }

        return {
            init: init,
            loadGiftMessageData: loadGiftMessageData,
            updateCitesRestriction: updateCitesRestriction
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.checkout.mediator, MF.formMode));

if ($('#checkoutShipping, #checkoutReviewAndPay').length !== 0) {
    MF.giftMessage.init();
}
