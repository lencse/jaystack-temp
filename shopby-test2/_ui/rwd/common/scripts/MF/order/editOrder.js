/*
 *  requires
 */

;(function($, window, formMode, select) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        input: {
            initialEditItemsJson: "[name=initialEditItemsJson]",
            editItemRow: ".editItemRow",
            editItemRowMode: "mode",
            entryNumber: "entry-number",
            editItemQty: "[name=editItemQty]",
            editOrderItemsForm: "[name=editOrderItemsForm]",
            editOrderItemsMessage: ".editOrderItemsMessage",
            editItemsJson: "[name=editItemsJson]",
            voucherCode: "[name=voucherCode]",
            editVoucherCode: "[name=editVoucherCode]",
            deliveryModeSelect: "[name=deliveryModeSelect]",
            editDeliveryModeCode: "[name=editDeliveryModeCode]"
        },
        button: {
            cancelEditOrderItemBtn: ".cancelEditOrderItemBtn",
            editOrderItemBtn: ".editOrderItemBtn",
            cancelEditItemsBtn : ".cancelEditItemsBtn",
            reviewEditItemsBtn: ".reviewEditItemsBtn",
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

    MF.editOrder = (function() {

        var options;

        var initialEditItems, editOrderItemButton, cancelEditOrderItemButton,
            editOrderItemsForm, reviewEditItemsButton, editItemsJson, voucherCode, editVoucherCode,
            deliveryModeSelect, editDeliveryModeCode, originalDeliveryModeCode,
            editOrderItemsMessage;

        var getEditItemRow = function(element) {
            return element.closest(options.input.editItemRow);
        };

        var initDropdownSelector = function(contextID, callbackFn) {
            select.init({
                contextId: contextID,
                callback: callbackFn || $.noop
            });
        };

        var resetEditRow = function(editItemRow) {
            var editItemQty = editItemRow.find(options.input.editItemQty);

            editItemQty.prop("selectedIndex", 0);
        };

        var switchEditItemRowMode = function(editItemRow, mode) {
            editItemRow.each(function() {
                formMode.switchMode(editItemRow, mode);
            });
        };

        var onEditItemsButtonClick = function() {
            switchEditItemRowMode(getEditItemRow($(this)), options.mode.edit);
        };

        var onCancelEditOrderItemButtonClick = function() {
            var editItemRow = getEditItemRow($(this));

            resetEditRow(editItemRow);
            switchEditItemRowMode(editItemRow, options.mode.view);
        };

        var submitEditOrderItems = function() {
            var editItems = getEditItems();

            if (editItems.length > 0 || originalDeliveryModeCode != deliveryModeSelect.val() || !isBlank(voucherCode.val())) {
                editItemsJson.val(JSON.stringify(editItems));
                editVoucherCode.val(voucherCode.val());
                editDeliveryModeCode.val(deliveryModeSelect.val())

                editOrderItemsForm.submit();
            } else {
                var noItemsSelectedMessage = editOrderItemsMessage.data(options.message.noItemsSelected);
                editOrderItemsMessage.text(noItemsSelectedMessage);
            }
        };

        var onReviewEditItemsButtonClick = function() {
            submitEditOrderItems();
        };

        var getEditItems = function() {
            var editItems = [];

            $(options.input.editItemRow).each(function() {
                var editItemRow = $(this);

                if (editItemRow.data(options.input.editItemRowMode) === options.mode.edit) {
                    var editItem = createEditItem($(this));
                    editItems.push(editItem);
                }
            });

            return editItems;
        };

        var createEditItem = function(editItemRow) {
            var editItem = {
                entryNumber: editItemRow.data(options.input.entryNumber),
                quantity: editItemRow.find(options.input.editItemQty).val()
            };

            return editItem;
        };

        var populateEditItemRow = function(editItemRow, editItem) {
            var quantity = editItemRow.find(options.input.editItemQty);

            switchEditItemRowMode(editItemRow, options.mode.edit);

            quantity.val(editItem.quantity).trigger("change");
        };

        var initEditOrderObjects = function() {
            editOrderItemButton = $(options.button.editOrderItemBtn);
            cancelEditOrderItemButton = $(options.button.cancelEditOrderItemBtn);

            editOrderItemsForm = $(options.input.editOrderItemsForm);
            editOrderItemsMessage = $(options.input.editOrderItemsMessage);
            editItemsJson = $(options.input.editItemsJson);
            voucherCode = $(options.input.voucherCode);
            editVoucherCode = $(options.input.editVoucherCode);

            deliveryModeSelect = $(options.input.deliveryModeSelect);
            editDeliveryModeCode = $(options.input.editDeliveryModeCode);
            originalDeliveryModeCode = deliveryModeSelect.val();

            reviewEditItemsButton = editOrderItemsForm.find(options.button.reviewEditItemsBtn);
        };

        var initEditItemRows = function() {
            var initialEditItemsJson = $(options.input.initialEditItemsJson);
            initialEditItems = $.parseJSON(initialEditItemsJson.val());

            if (initialEditItems) {
                var editItemRows = $(options.input.editItemRow);

                $.each(initialEditItems, function(index, editItem) {
                    $.each(editItemRows, function(index, editItemRow) {
                        var entryNumber = $(editItemRow).data(options.input.entryNumber);
                        if (entryNumber === editItem.entryNumber) {
                            populateEditItemRow($(editItemRow), editItem);
                        }
                    });
                });
            }
        };

        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            initEditOrderObjects();

            $(function() {
                editOrderItemButton.on("click", onEditItemsButtonClick);
                cancelEditOrderItemButton.on("click", onCancelEditOrderItemButtonClick);

                reviewEditItemsButton.on("click", onReviewEditItemsButtonClick);

                initEditItemRows();
                initDropdownSelector(".editableItems");
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, MF.formMode, MF.select));

MF.editOrder.init();
