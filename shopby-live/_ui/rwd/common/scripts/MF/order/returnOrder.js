/*
 *  requires
 */

;(function($, window, formMode, select, returnReasonValidator) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        input: {
            initialReturnItemsJson: "[name=initialReturnItemsJson]",
            returnItemRow: ".returnItemRow",
            returnItemRowMode: "mode",
            entryNumber: "entry-number",
            returnItemQty: "[name=returnItemQty]",
            returnReasonForm: "[name=returnReasonForm]",
            returnReason: "[name=returnReason]",
            hasMessage: "has-message",
            returnReasonMessage: ".returnReasonMessage",
            returnReasonMessageText: "[name=returnReasonMessageText]",
            returnOrderItemsForm: "[name=returnOrderItemsForm]",
            returnOrderItemsMessage: ".returnOrderItemsMessage",
            returnItemsJson: "[name=returnItemsJson]"
        },
        button: {
            cancelReturnOrderItemBtn: ".cancelReturnOrderItemBtn",
            returnOrderItemBtn: ".returnOrderItemBtn",
            cancelReturnItemsBtn : ".cancelReturnItemsBtn",
            reviewReturnItemsBtn: ".reviewReturnItemsBtn",
            backToOrdersBtn: ".backToOrdersBtn"
        },
        message: {
            noItemsSelected: "no-items-selected"
        },
        mode: {
            view: "view",
            edit: "edit"
        }
    };

    MF.returnOrder = (function() {

        var options;

        var initialReturnItems, returnOrderItemButton, cancelReturnOrderItemButton, returnReasonSelect,
            returnOrderItemsForm, reviewReturnItemsButton, returnItemsJson, returnReasonForms,
            returnOrderItemsMessage, returnReasonValidators;

        var getReturnItemRow = function(element) {
            return element.closest(options.input.returnItemRow);
        };

        var initDropdownSelector = function(contextID, callbackFn) {
            select.init({
                contextId: contextID,
                callback: callbackFn || $.noop
            });
        };

        var resetReturnRow = function(returnItemRow) {
            var returnItemQty = returnItemRow.find(options.input.returnItemQty);
            var returnReason = returnItemRow.find(options.input.returnReason);
            var returnReasonMessageText = returnItemRow.find(options.input.returnReasonMessageText);

            returnItemQty.prop("selectedIndex", 0);
            returnReason.prop("selectedIndex", 0);
            returnReasonMessageText.val("").trigger("paste");
        };

        var switchReturnItemRowMode = function(returnItemRow, mode) {
            returnItemRow.each(function() {
                formMode.switchMode(returnItemRow, mode);
            });
        };

        var onReturnItemsButtonClick = function() {
            switchReturnItemRowMode(getReturnItemRow($(this)), options.mode.edit);
        };

        var onCancelReturnOrderItemButtonClick = function() {
            var returnItemRow = getReturnItemRow($(this));

            resetReturnRow(returnItemRow);
            switchReturnItemRowMode(returnItemRow, options.mode.view);
        };

        var onReturnReasonSelectChange = function() {
            var returnItemRow = getReturnItemRow($(this));
            var returnReasonMessage = returnItemRow.find(options.input.returnReasonMessage);

            var hasMessage = $(this).find(":selected").data(options.input.hasMessage);
            if (hasMessage) {
                returnReasonMessage.show();
            } else {
                returnReasonMessage.hide();
            }
        };

        var validateReturnReason = function() {
            var allValid = true;

            _.each(returnReasonValidators, function(validator) {
                var formValid = validator.form();
                allValid = allValid && formValid;
            });

            return allValid;
        };

        var submitReturnOrderItems = function() {
            if (validateReturnReason()) {
                var returnItems = getReturnItems();

                if (returnItems.length > 0) {
                    returnItemsJson.val(JSON.stringify(returnItems));
                    returnOrderItemsForm.submit();
                } else {
                    var noItemsSelectedMessage = returnOrderItemsMessage.data(options.message.noItemsSelected);
                    returnOrderItemsMessage.text(noItemsSelectedMessage);
                }
            }
        };

        var onReviewReturnItemsButtonClick = function() {
            submitReturnOrderItems();
        };

        var getReturnItems = function() {
            var returnItems = [];

            $(options.input.returnItemRow).each(function() {
                var returnItemRow = $(this);

                if (returnItemRow.data(options.input.returnItemRowMode) === options.mode.edit) {
                    var returnItem = createReturnItem($(this));
                    returnItems.push(returnItem);
                }
            });

            return returnItems;
        };

        var createReturnItem = function(returnItemRow) {
            var returnItem = {
                entryNumber: returnItemRow.data(options.input.entryNumber),
                quantity: returnItemRow.find(options.input.returnItemQty).val(),
                returnReason: returnItemRow.find(options.input.returnReason).val(),
                returnReasonMessage: returnItemRow.find(options.input.returnReasonMessageText).val()
            };

            return returnItem;
        };

        var populateReturnItemRow = function(returnItemRow, returnItem) {
            var quantity = returnItemRow.find(options.input.returnItemQty);
            var returnReason = returnItemRow.find(options.input.returnReason);
            var returnReasonMessageText = returnItemRow.find(options.input.returnReasonMessageText);

            switchReturnItemRowMode(returnItemRow, options.mode.edit);

            quantity.val(returnItem.quantity).trigger("change");
            returnReason.val(returnItem.returnReason).trigger("change");
            returnReasonMessageText.val(returnItem.returnReasonMessage).trigger("paste");
        };

        var initReturnOrderObjects = function() {
            returnOrderItemButton = $(options.button.returnOrderItemBtn);
            cancelReturnOrderItemButton = $(options.button.cancelReturnOrderItemBtn);

            returnReasonSelect = $(options.input.returnReason);

            returnOrderItemsForm = $(options.input.returnOrderItemsForm);
            returnOrderItemsMessage = $(options.input.returnOrderItemsMessage);
            returnItemsJson = $(options.input.returnItemsJson);

            reviewReturnItemsButton = returnOrderItemsForm.find(options.button.reviewReturnItemsBtn);
        };

        var initReturnReasonValidator = function() {
            returnReasonForms = $(options.input.returnReasonForm);
            returnReasonValidators = _.map(returnReasonForms, function(form) {
                return returnReasonValidator.validate($(form));
            });
        };

        var initReturnMessageCounters = function() {
           var returnReasonMessages = $(options.input.returnReasonMessageText);

           returnReasonMessages.each(function() {
                var returnReasonMessageText = $(this);
                returnReasonMessageText.simplyCountable({
                    counter: returnReasonMessageText.data("counter-id"),
                    maxCount: returnReasonMessageText.attr("maxLength")
                });
           });
        };

        var initReturnItemRows = function() {
            var initialReturnItemsJson = $(options.input.initialReturnItemsJson);
            initialReturnItems = $.parseJSON(initialReturnItemsJson.val());

            if (initialReturnItems) {
                var returnItemRows = $(options.input.returnItemRow);

                $.each(initialReturnItems, function(index, returnItem) {
                    $.each(returnItemRows, function(index, returnItemRow) {
                        var entryNumber = $(returnItemRow).data(options.input.entryNumber);
                        if (entryNumber === returnItem.entryNumber) {
                            populateReturnItemRow($(returnItemRow), returnItem);
                        }
                    });
                });
            }
        };

        var initNonReturnableItemsModal = function(){
            $("#nonReturnableItemsHandle").on("click", function(e){
                e.preventDefault();
                MF.overlay.openWithElement({
                    element: $( '#nonReturnableItemsModal' )
                });
            });
        };

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initReturnOrderObjects();
            initReturnReasonValidator();
            initNonReturnableItemsModal();

            $(function() {
                returnOrderItemButton.on("click", onReturnItemsButtonClick);
                cancelReturnOrderItemButton.on("click", onCancelReturnOrderItemButtonClick);

                returnReasonSelect.on("change", onReturnReasonSelectChange);

                reviewReturnItemsButton.on("click", onReviewReturnItemsButtonClick);

                initReturnMessageCounters();
                initReturnItemRows();
                initDropdownSelector(".returnableItems");
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.formMode, MF.select, MF.returnReasonValidator));

MF.returnOrder.init();
